import { createSupabaseClient } from './supabase-client.js';

const getSupabase = () => {
  try {
    return createSupabaseClient();
  } catch (error) {
    console.warn('CareerNify auth is running in demo mode:', error.message);
    return null;
  }
};

export async function signUp(email, password, metadata = {}) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase credentials are not configured yet. Please add your project URL and anon key.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  });

  if (error) throw error;

  if (data?.user) {
    const profilePayload = {
      id: data.user.id,
      full_name: metadata.full_name || email.split('@')[0],
      updated_at: new Date().toISOString()
    };

    await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
  }

  return data;
}

export async function signIn(email, password) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase credentials are not configured yet. Please add your project URL and anon key.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase credentials are not configured yet. Please add your project URL and anon key.');
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password.html`
  });
  if (error) throw error;
}

export async function updatePassword(password) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase credentials are not configured yet. Please add your project URL and anon key.');
  }
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export async function getCurrentUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getSession() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function isAuthenticated() {
  const session = await getSession();
  return Boolean(session?.user);
}

export async function getProfile() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function saveProfile(profileData) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...profileData,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}
