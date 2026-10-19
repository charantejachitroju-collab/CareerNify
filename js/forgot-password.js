import { resetPassword } from './auth.js';

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3200);
}

const form = document.getElementById('forgotPasswordForm');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) {
      showToast('Enter your email to continue.', 'error');
      return;
    }

    try {
      await resetPassword(email);
      showToast('Password reset email sent.', 'success');
      form.reset();
    } catch (error) {
      showToast(error.message || 'Unable to send reset email.', 'error');
    }
  });
}
