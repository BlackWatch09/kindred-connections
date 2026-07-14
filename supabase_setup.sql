-- ============================================================
-- AlifXpert — Supabase setup
-- Paste this whole file into: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run (idempotent).
-- ============================================================

-- 1) Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2) Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Auto-touch updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4) Support tickets (contact form → admin panel)
-- ============================================================
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

grant insert on public.support_tickets to authenticated;
grant all on public.support_tickets to service_role;

alter table public.support_tickets enable row level security;

-- Authenticated users may only create their own ticket. No SELECT for regular
-- users — reads are performed by the `admin-support` edge function using the
-- service role, gated by the ADMIN_PASSWORD secret.
drop policy if exists "Users can create their own ticket" on public.support_tickets;
create policy "Users can create their own ticket"
  on public.support_tickets for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================
-- 5) COMMUNITY — Gamified Social Feed
-- ============================================================

-- 5.1 Add faction column to profiles (auto-assigned on first community visit)
alter table public.profiles
  add column if not exists faction text
  check (faction in ('fasaha','hikma','balagha'));

-- 5.2 Posts
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  image_url text,
  faction text,
  likes_count int not null default 0,
  comments_count int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists community_posts_created_idx on public.community_posts (created_at desc);

grant select, insert, delete on public.community_posts to authenticated;
grant all on public.community_posts to service_role;
alter table public.community_posts enable row level security;

drop policy if exists "Posts readable by authenticated" on public.community_posts;
create policy "Posts readable by authenticated"
  on public.community_posts for select to authenticated using (true);

drop policy if exists "Users insert own post" on public.community_posts;
create policy "Users insert own post"
  on public.community_posts for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users delete own post" on public.community_posts;
create policy "Users delete own post"
  on public.community_posts for delete to authenticated using (auth.uid() = user_id);

-- 5.3 Comments (supports Siraj AI replies via service role)
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  is_ai boolean not null default false,
  ai_name text,
  faction text,
  created_at timestamptz not null default now()
);
create index if not exists community_comments_post_idx on public.community_comments (post_id, created_at asc);

grant select, insert, delete on public.community_comments to authenticated;
grant all on public.community_comments to service_role;
alter table public.community_comments enable row level security;

drop policy if exists "Comments readable" on public.community_comments;
create policy "Comments readable" on public.community_comments for select to authenticated using (true);

drop policy if exists "Users insert own comment" on public.community_comments;
create policy "Users insert own comment"
  on public.community_comments for insert to authenticated
  with check (auth.uid() = user_id and is_ai = false);

drop policy if exists "Users delete own comment" on public.community_comments;
create policy "Users delete own comment"
  on public.community_comments for delete to authenticated using (auth.uid() = user_id);

-- Keep comments_count in sync
create or replace function public.bump_post_comments()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts set comments_count = comments_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.community_posts set comments_count = greatest(0, comments_count - 1) where id = old.post_id;
  end if;
  return null;
end $$;
drop trigger if exists community_comments_count on public.community_comments;
create trigger community_comments_count
  after insert or delete on public.community_comments
  for each row execute function public.bump_post_comments();

-- 5.4 Likes
create table if not exists public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
grant select, insert, delete on public.community_likes to authenticated;
grant all on public.community_likes to service_role;
alter table public.community_likes enable row level security;

drop policy if exists "Likes readable" on public.community_likes;
create policy "Likes readable" on public.community_likes for select to authenticated using (true);

drop policy if exists "Users like as self" on public.community_likes;
create policy "Users like as self"
  on public.community_likes for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users unlike own" on public.community_likes;
create policy "Users unlike own"
  on public.community_likes for delete to authenticated using (auth.uid() = user_id);

create or replace function public.bump_post_likes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts set likes_count = likes_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.community_posts set likes_count = greatest(0, likes_count - 1) where id = old.post_id;
  end if;
  return null;
end $$;
drop trigger if exists community_likes_count on public.community_likes;
create trigger community_likes_count
  after insert or delete on public.community_likes
  for each row execute function public.bump_post_likes();

-- 5.5 Weekly co-op challenge
create table if not exists public.community_challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  target_count int not null default 1000,
  progress_count int not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz
);
grant select on public.community_challenges to authenticated;
grant all on public.community_challenges to service_role;
alter table public.community_challenges enable row level security;

drop policy if exists "Challenges readable" on public.community_challenges;
create policy "Challenges readable" on public.community_challenges for select to authenticated using (true);

-- RPC to atomically bump progress + track per-faction contribution
create table if not exists public.community_challenge_contributions (
  challenge_id uuid not null references public.community_challenges(id) on delete cascade,
  faction text not null,
  count int not null default 0,
  primary key (challenge_id, faction)
);
grant select on public.community_challenge_contributions to authenticated;
grant all on public.community_challenge_contributions to service_role;
alter table public.community_challenge_contributions enable row level security;
drop policy if exists "Contribs readable" on public.community_challenge_contributions;
create policy "Contribs readable" on public.community_challenge_contributions for select to authenticated using (true);

create or replace function public.contribute_challenge(_faction text)
returns void language plpgsql security definer set search_path = public as $$
declare
  ch_id uuid;
begin
  select id into ch_id from public.community_challenges
    where is_active = true order by starts_at desc limit 1;
  if ch_id is null then return; end if;
  update public.community_challenges
    set progress_count = progress_count + 1
    where id = ch_id and progress_count < target_count;
  if _faction is not null then
    insert into public.community_challenge_contributions (challenge_id, faction, count)
      values (ch_id, _faction, 1)
    on conflict (challenge_id, faction) do update set count = community_challenge_contributions.count + 1;
  end if;
end $$;
grant execute on function public.contribute_challenge(text) to authenticated;

-- Seed a default challenge if none exists
insert into public.community_challenges (title, description, target_count)
select 'هدف السيرفر الأسبوعي: 1000 تفاعل عربي أصيل',
       'شاركوا منشوراً، علّقوا على منشور صديق، أو استعينوا بسراج لتصحيح خطأ. كل تفاعل يقرّبنا من الهدف!',
       1000
where not exists (select 1 from public.community_challenges where is_active = true);
