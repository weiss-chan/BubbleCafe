(() => {
  /*ТЕМА*/
  const root = document.documentElement;
  const themeBtn = document.querySelector('.theme-toggle');

  if (themeBtn) {
    const KEY = 'theme';
    const stored = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');

    applyTheme(initial);

    themeBtn.addEventListener('click', () => {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      themeBtn.setAttribute('aria-pressed', theme === 'dark');
      localStorage.setItem(KEY, theme);
    }
  }

  /*БУРГЕР-МЕНЮ*/
  const burger = document.querySelector('.burger');
  const panel = document.querySelector('.nav__panel');

  if (burger && panel) {
    burger.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      document.body.classList.toggle('menu-open', isOpen);
    });

    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    function closeMenu() {
      panel.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      document.body.classList.remove('menu-open');
    }
  }

  /*СЛАЙДЕР АФИШИ*/
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const prevBtn = slider.querySelector('.slider__btn--prev');
  const nextBtn = slider.querySelector('.slider__btn--next');
  const dotsContainer = document.querySelector('.slider__dots');
  const slides = Array.from(track.children);

  let currentIndex = 0;

  function getGap() {
    const raw = getComputedStyle(track).gap;
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function getStep() {
    if (slides.length < 2) return 0;
    return slides[0].getBoundingClientRect().width + getGap();
  }

  function getVisibleCount() {
    if (!slides.length) return 0;
    const step = getStep();
    if (!step) return slides.length;
    const trackWidth = track.getBoundingClientRect().width;
    const gap = getGap();
    return Math.max(1, Math.round((trackWidth + gap) / step));
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getVisibleCount());
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = getMaxIndex() + 1;
    if (total <= 1) return;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Слайд ${i + 1}`);
      if (i === currentIndex) dot.classList.add('is-active');
      dot.addEventListener('click', () => {
        currentIndex = i;
        update();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function update() {
    const step = getStep();
    track.style.transform = `translateX(${-currentIndex * step}px)`;

    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= getMaxIndex();

    renderDots();
  }

  function next() {
    currentIndex = Math.min(currentIndex + 1, getMaxIndex());
    update();
  }

  function prev() {
    currentIndex = Math.max(currentIndex - 1, 0);
    update();
  }

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    track.style.transform = 'translateX(0)';
    resizeTimer = setTimeout(() => {
      currentIndex = Math.min(currentIndex, getMaxIndex());
      update();
    }, 120);
  });

  update();
})();