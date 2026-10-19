import { signUp } from './auth.js';

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 2800);
}

const form = document.getElementById('registerForm');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!fullName || !email || !password) {
      showToast('Please complete all fields.', 'error');
      return;
    }

    try {
      await signUp(email, password, {
        full_name: fullName,
        career_goal: 'Full-Stack Developer'
      });
      showToast('Registration sent. Check your email to confirm.', 'success');
      form.reset();
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
    }
  });
}
