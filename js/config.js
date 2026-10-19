export const appConfig = {
  appName: 'CareerNify',
  baseUrl: window.location.origin,
  supabase: {
    url: 'https://kjppqklxxvznuprqrppx.supabase.co',
    anonKey: 'sb_publishable_cKj5E64JCqLdu9Ir-SBBKg_dHhFGgoQ'
  },
  demo: {
    userName: 'Demo Student',
    careerGoal: 'Full-Stack Developer'
  }
};

export function getRuntimeConfig() {
  const globalConfig = window.CAREER_NIFY_CONFIG || {};
  const localUrl = window.localStorage.getItem('careernify_supabase_url');
  const localKey = window.localStorage.getItem('careernify_supabase_anon_key');

  return {
    supabaseUrl: globalConfig.supabaseUrl || localUrl || appConfig.supabase.url,
    supabaseAnonKey: globalConfig.supabaseAnonKey || localKey || appConfig.supabase.anonKey,
    appName: globalConfig.appName || appConfig.appName,
    baseUrl: globalConfig.baseUrl || appConfig.baseUrl
  };
}

export const getSupabaseConfig = () => {
  const { supabaseUrl, supabaseAnonKey } = getRuntimeConfig();
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
};
