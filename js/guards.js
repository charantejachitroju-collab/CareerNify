import { isAuthenticated, getCurrentUser } from './auth.js';

export async function requireAuth() {
  const authed = await isAuthenticated();
  if (!authed) {
    window.location.href = 'login.html';
    return null;
  }

  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    window.location.href = 'login.html';
    return null;
  }
}

export function isAdminRole(roleName) {
  return roleName === 'admin';
}
