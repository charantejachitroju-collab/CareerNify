import { signIn, getCurrentUser } from './auth.js';

const form = document.getElementById('loginForm');
const welcomeMessage = document.getElementById('welcomeMessage');

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 2800);
}

async function initPage() {
  try {
    const user = await getCurrentUser();
    if (user) {
      welcomeMessage.textContent = `Welcome back, ${user.email}`;
      welcomeMessage.classList.remove('hidden');
    }
  } catch (error) {
    // No active session
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showToast('Please fill in both fields.', 'error');
      return;
    }

    try {
      const data = await signIn(email, password);
      if (data?.user) {
        showToast('Login successful. Redirecting...', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
      }
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.', 'error');
    }
  });
}

initPage();
