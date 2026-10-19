import { updatePassword } from './auth.js';

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3300);
}

const form = document.getElementById('resetPasswordForm');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (!password || password.length < 6) {
      showToast('Choose a password with at least 6 characters.', 'error');
      return;
    }

    try {
      await updatePassword(password);
      showToast('Password updated successfully.', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1400);
    } catch (error) {
      showToast(error.message || 'Could not update the password.', 'error');
    }
  });
}
