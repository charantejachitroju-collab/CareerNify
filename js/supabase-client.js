import { getSupabaseConfig } from './config.js';

export function createSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey || url.includes('your-project') || anonKey.includes('your-anon')) {
    throw new Error('Supabase project URL and anon key must be configured before using CareerNify.');
  }

  return window.supabase.createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}
