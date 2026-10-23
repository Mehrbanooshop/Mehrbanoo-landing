(function () {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('#site-nav');

  if (menuToggle && siteNav) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'باز کردن منو');
      siteNav.classList.remove('is-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'باز کردن منو' : 'بستن منو');
      siteNav.classList.toggle('is-open', !isOpen);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear().toLocaleString('fa-IR');

  const copyStatus = document.querySelector('.copy-status');
  const fallbackCopy = (text) => {
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    input.remove();
    return copied;
  };

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          copied = true;
        } else {
          copied = fallbackCopy(value);
        }
      } catch (_) {
        copied = fallbackCopy(value);
      }
      if (copyStatus) {
        copyStatus.textContent = copied ? 'با موفقیت کپی شد: ' + value : 'کپی خودکار انجام نشد؛ لطفاً متن را انتخاب و کپی کنید: ' + value;
      }
      const originalLabel = button.textContent;
      button.textContent = copied ? 'کپی شد' : 'دوباره تلاش کنید';
      window.setTimeout(() => { button.textContent = originalLabel; }, 1800);
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = (index % 4) * 55 + 'ms';
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
