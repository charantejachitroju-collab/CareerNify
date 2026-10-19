document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navItems.forEach((item) => {
    const href = item.dataset.href || item.getAttribute('href');
    if (href === currentPath) {
      item.classList.add('active');
    }
  });

  const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('mobile-open');
    });
  }
});
