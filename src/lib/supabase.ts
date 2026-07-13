import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zekkojrgknpvmxskyqno.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_fbcN8yLZl8_5VMGokMH24g_4LaaOnCu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
