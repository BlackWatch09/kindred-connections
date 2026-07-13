-- ============================================================
-- Living Story World — Supabase setup
-- Paste in: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run (idempotent).
-- ============================================================

-- 1) Story sessions
create table if not exists public.story_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  world_id text not null,
  level text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  stars int,
  words_learned int not null default 0
);
grant select, insert, update on public.story_sessions to authenticated;
grant all on public.story_sessions to service_role;
alter table public.story_sessions enable row level security;

drop policy if exists "own sessions read" on public.story_sessions;
create policy "own sessions read" on public.story_sessions
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own sessions insert" on public.story_sessions;
create policy "own sessions insert" on public.story_sessions
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "own sessions update" on public.story_sessions;
create policy "own sessions update" on public.story_sessions
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2) Story messages
create table if not exists public.story_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.story_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.story_messages to authenticated;
grant all on public.story_messages to service_role;
alter table public.story_messages enable row level security;

drop policy if exists "own messages read" on public.story_messages;
create policy "own messages read" on public.story_messages
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own messages insert" on public.story_messages;
create policy "own messages insert" on public.story_messages
  for insert to authenticated with check (auth.uid() = user_id);

-- 3) Learned vocabulary
create table if not exists public.learned_vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  meaning text,
  learned_in_session uuid references public.story_sessions(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(user_id, word)
);
grant select, insert, delete on public.learned_vocabulary to authenticated;
grant all on public.learned_vocabulary to service_role;
alter table public.learned_vocabulary enable row level security;

drop policy if exists "own vocab read" on public.learned_vocabulary;
create policy "own vocab read" on public.learned_vocabulary
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own vocab insert" on public.learned_vocabulary;
create policy "own vocab insert" on public.learned_vocabulary
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "own vocab delete" on public.learned_vocabulary;
create policy "own vocab delete" on public.learned_vocabulary
  for delete to authenticated using (auth.uid() = user_id);

-- 4) User language profile
create table if not exists public.user_language_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  level text not null default 'beginner',
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.user_language_profile to authenticated;
grant all on public.user_language_profile to service_role;
alter table public.user_language_profile enable row level security;

drop policy if exists "own profile read" on public.user_language_profile;
create policy "own profile read" on public.user_language_profile
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own profile upsert" on public.user_language_profile;
create policy "own profile upsert" on public.user_language_profile
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "own profile update" on public.user_language_profile;
create policy "own profile update" on public.user_language_profile
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5) Scene history (to prevent scenario repetition)
create table if not exists public.scene_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  world_id text not null,
  scenario_used text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.scene_history to authenticated;
grant all on public.scene_history to service_role;
alter table public.scene_history enable row level security;

drop policy if exists "own scene read" on public.scene_history;
create policy "own scene read" on public.scene_history
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own scene insert" on public.scene_history;
create policy "own scene insert" on public.scene_history
  for insert to authenticated with check (auth.uid() = user_id);

create index if not exists idx_story_messages_session on public.story_messages(session_id, created_at);
create index if not exists idx_scene_history_user_world on public.scene_history(user_id, world_id, created_at desc);
create index if not exists idx_vocab_user on public.learned_vocabulary(user_id, created_at desc);
