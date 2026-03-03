import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured =
    supabaseUrl.length > 0 && !supabaseUrl.includes('YOUR_PROJECT_ID');

// ── Public (anon) client ── lazily initialised
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
    if (!isSupabaseConfigured) return null;
    if (!_client) {
        _client = createClient(supabaseUrl, supabaseAnonKey);
    }
    return _client;
}

// ── Admin client ── server-side only
// Uses the service role key when available (bypasses RLS entirely).
// Falls back to the anon key; writes then rely on the write RLS policies
// defined in schema.sql (auth enforced at app layer by JWT middleware).
export function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured');
    }
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const key =
        serviceKey && serviceKey !== 'YOUR_SERVICE_ROLE_KEY_HERE'
            ? serviceKey
            : supabaseAnonKey;
    return createClient(supabaseUrl, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

