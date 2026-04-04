/* ============================================================
   DAMIAN AGUILERA — portfolio script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ──────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const scrollThreshold = 60;

  const updateNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > scrollThreshold);
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  // ── MOBILE MENU ─────────────────────────────────────────────
  const menuBtn   = document.getElementById('menuBtn');
  const navLinks  = document.getElementById('navLinks');

  // inject overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  const openMenu  = () => {
    menuBtn.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    menuBtn.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () =>
    navLinks.classList.contains('open') ? closeMenu() : openMenu()
  );
  overlay.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));


  // ── SCROLL REVEAL ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  // ── COUNTER ANIMATION ────────────────────────────────────────
  const counters = document.querySelectorAll('.trust__num[data-count]');
  let countersTriggered = false;

  const animateCounter = (el) => {
    const target    = parseInt(el.dataset.count, 10);
    const duration  = 1800;
    const start     = performance.now();
    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (countersTriggered) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countersTriggered = true;
          counters.forEach(animateCounter);
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  if (counters.length) counterObserver.observe(counters[0].closest('.hero__trust'));


  // ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));


  // ── CONTACT FORM ─────────────────────────────────────────────
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.disabled   = true;
      btn.innerHTML  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/><path d="M12 2a10 10 0 010 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg> Sending...';

      // Using Formspree — replace YOUR_FORM_ID with your actual ID
      // Or swap this out for EmailJS, Netlify Forms, etc.
      try {
        const formData  = new FormData(form);
        const data      = Object.fromEntries(formData.entries());

        // Simulate send (replace with real endpoint)
        await simulateSend(data);

        form.reset();
        formSuccess.classList.add('show');
        btn.innerHTML = originalText;
        btn.disabled  = false;

        setTimeout(() => formSuccess.classList.remove('show'), 6000);

      } catch (err) {
        btn.innerHTML = '⚠️ Error — try again';
        btn.disabled  = false;
        setTimeout(() => { btn.innerHTML = originalText; }, 3000);
        console.error('Form error:', err);
      }
    });
  }

  // placeholder for real form submission
  // replace with: fetch('https://formspree.io/f/YOUR_ID', {...})
  function simulateSend(data) {
    return new Promise((resolve) => {
      console.log('Form data:', data);
      setTimeout(resolve, 1200);
    });
  }


  // ── PACKAGE CARD HOVER GLOW ───────────────────────────────────
  document.querySelectorAll('.pkg-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y     = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });


  // ── SMOOTH SCROLL (fallback for older browsers) ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── TYPING HEADLINE EFFECT (hero sub-text) ────────────────────
  // Optional subtle blinking cursor on the last word of hero headline
  const highlight = document.querySelector('.hero__highlight');
  if (highlight) {
    highlight.style.position = 'relative';
  }


  // ── VALUE CARDS STAGGER ON HOVER ─────────────────────────────
  document.querySelectorAll('.value-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.04}s`;
  });


  // ── SERVICE CARDS MAGNETIC EFFECT ────────────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});