import { getCurrentUser, signOut } from './auth.js';
import { createSupabaseClient } from './supabase-client.js';
import { requireAuth } from './guards.js';

const demoProfile = {
  full_name: 'Student Name',
  email: 'student@example.com',
  college: 'ABC Institute',
  preferred_role: 'Full-Stack Developer',
  career_goal: 'Full-Stack Developer'
};

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function readFormValues() {
  return {
    full_name: document.getElementById('fullName')?.value?.trim() || '',
    email: document.getElementById('email')?.value?.trim() || '',
    college: document.getElementById('college')?.value?.trim() || '',
    preferred_role: document.getElementById('preferredRole')?.value?.trim() || '',
    career_goal: document.getElementById('preferredRole')?.value?.trim() || ''
  };
}

function fillForm(profile) {
  const fields = {
    fullName: profile.full_name || demoProfile.full_name,
    email: profile.email || demoProfile.email,
    college: profile.college || demoProfile.college,
    preferredRole: profile.preferred_role || profile.career_goal || demoProfile.preferred_role
  };

  document.getElementById('fullName').value = fields.fullName;
  document.getElementById('email').value = fields.email;
  document.getElementById('college').value = fields.college;
  document.getElementById('preferredRole').value = fields.preferredRole;
}

async function loadProfile() {
  const user = await requireAuth();
  if (!user) return;

  const profile = { ...demoProfile, email: user.email || demoProfile.email };
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';

  document.getElementById('userName')?.replaceChildren(document.createTextNode(userName));
  const avatar = document.getElementById('userAvatar');
  if (avatar) {
    const initials = userName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
    avatar.textContent = initials || 'S';
  }

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!error && data) {
      Object.assign(profile, data, { email: user.email || data.email || profile.email });
    }
  } catch (error) {
    console.warn('Profile is using demo data because Supabase is not configured.', error.message);
  }

  fillForm(profile);
}

async function saveProfile() {
  const user = await getCurrentUser();
  if (!user) {
    showToast('Please sign in to save your profile.', 'error');
    return;
  }

  const values = readFormValues();
  const payload = {
    id: user.id,
    full_name: values.full_name,
    email: values.email,
    college: values.college,
    preferred_role: values.preferred_role,
    career_goal: values.career_goal,
    updated_at: new Date().toISOString()
  };

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;

    showToast('Profile updated successfully.', 'success');
    const title = document.querySelector('h1');
    if (title) title.textContent = 'Profile & Settings';
  } catch (error) {
    showToast(error.message || 'Unable to save profile right now.', 'error');
  }
}

async function handleLogout() {
  try {
    await signOut();
    window.location.href = 'login.html';
  } catch (error) {
    showToast(error.message || 'Unable to sign out.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('profileForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await saveProfile();
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  await loadProfile();
});
