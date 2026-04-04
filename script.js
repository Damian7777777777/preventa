/* ============================================================
   DAMIAN AGUILERA — portfolio script
   ============================================================ */

/* spin keyframe for loading button */
const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleEl);

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
  const sections   = document.querySelectorAll('section[id]');
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


  // ── CONTACT FORM — Formspree (gratis, sin backend) ───────────
  //
  //  SETUP — solo 2 minutos:
  //  1. Ve a https://formspree.io  →  Sign Up gratis (con tu Gmail)
  //  2. Dashboard  →  "+ New Form"  →  ponle nombre ej: "Website Contact"
  //  3. Copia el Form ID que aparece  (ej: xkgwrbpz)
  //  4. Pégalo abajo en FORMSPREE_ID
  //
  //  ✅ Resultado: cada formulario te llega directo a tu email
  //  ✅ El cliente no necesita WhatsApp ni nada extra
  //  ✅ Gratis hasta 50 envíos/mes (más que suficiente para empezar)
  //
  const FORMSPREE_ID = 'xaqllbbo'; // <-- CAMBIA ESTO

  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn          = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      // ── Loading state ──────────────────────────────────────
      btn.disabled  = true;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          style="animation:spin 0.75s linear infinite;flex-shrink:0">
          <circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,0.25)" stroke-width="2.5"/>
          <path d="M12 3a9 9 0 019 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Sending…`;

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(form),
        });

        if (res.ok) {
          // ── Success ────────────────────────────────────────
          form.reset();
          btn.innerHTML = originalHTML;
          btn.disabled  = false;
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 7000);
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Server error ' + res.status);
        }

      } catch (err) {
        // ── Error state ────────────────────────────────────
        btn.disabled  = false;
        btn.innerHTML = '⚠️ Something went wrong — try again';
        console.error('Form error:', err);
        setTimeout(() => { btn.innerHTML = originalHTML; }, 3500);
      }
    });
  }


  // ── PACKAGE CARD HOVER GLOW ───────────────────────────────────
  document.querySelectorAll('.pkg-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
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


  // ── VALUE CARDS STAGGER ──────────────────────────────────────
  document.querySelectorAll('.value-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.04}s`;
  });


  // ── SERVICE CARDS ────────────────────────────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
