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
  const FORMSPREE_ID = 'YOUR_FORM_ID'; // <-- CAMBIA ESTO

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


// ── PORTFOLIO FILTER ─────────────────────────────────────────
const filterBtns = document.querySelectorAll('.pf-btn');
const pjCards    = document.querySelectorAll('.pj-card[data-type]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // update active button
    filterBtns.forEach(b => b.classList.remove('pf-btn--active'));
    btn.classList.add('pf-btn--active');

    // show/hide cards
    pjCards.forEach(card => {
      const type = card.dataset.type;
      const show = filter === 'all' || type === filter || card.classList.contains('pj-card--cta');
      card.classList.toggle('pf-hidden', !show);

      // re-trigger reveal animation
      if (show) {
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          setTimeout(() => card.classList.add('visible'), 50);
        });
      }
    });
  });
});


// ── LANGUAGE TOGGLE ──────────────────────────────────────────
const translations = {
  en: {
    'nav.about':      'About',
    'nav.services':   'Services',
    'nav.work':       'Work',
    'nav.packages':   'Packages',
    'nav.cta':        "Let's Talk",
    // Hero
    'hero.badge':  'Available for new projects',
    'hero.h1a':    'Your Business',
    'hero.h1b':    'Deserves a',
    'hero.h1c':    'Digital Presence',
    'hero.h1d':    'That Wins.',
    'hero.role':   'Software Engineer & Digital Strategist',
    'hero.sub':    "I don't just build websites. I build <em>growth engines</em> for US businesses.",
    'hero.cta1':   'See My Work',
    'hero.cta2':   'Book a Free Call',
    // Trust
    'trust.projects':     'Projects Delivered',
    'trust.satisfaction': 'Client Satisfaction',
    'trust.growth':       'Avg. Traffic Growth',
    // About
    'about.overline': 'Who I Am',
    'about.h2a':  'Not a freelancer.',
    'about.h2b':  'A partner in your growth.',
    'about.p1':   "I'm a Software Engineer with a degree in Software Development & Management. I've spent years watching businesses lose money because their digital presence didn't match their real value. That's the problem I fix.",
    'about.p2':   'Serving clients across the United States with agency-level execution — which means you get American-quality work at a fraction of agency cost.',
    'about.btn':  'Work With Me',
    // Value cards
    'vc.r.title': 'Results-First',
    'vc.r.desc':  'Every pixel has a purpose. I design for conversions, not just aesthetics.',
    'vc.f.title': 'Fast Delivery',
    'vc.f.desc':  'Landing pages in 3–5 days. Full projects in 2–4 weeks. Deadlines respected.',
    'vc.o.title': 'You Own It All',
    'vc.o.desc':  'Full code ownership. No lock-in. No hidden fees. Your site, your rules.',
    'vc.u.title': 'US Market Ready',
    'vc.u.desc':  'Built for American audiences — copy, UX, speed, and SEO tuned for US traffic.',
    // Services
    'srv.overline': 'What I Do',
    'srv.h2a':  'digital presence',
    'srv.h2b':  'not just a website.',
    'srv.sub':  'The difference between a website and a digital presence is the difference between existing and winning.',
    // Portfolio
    'pf.overline': 'Real Work, Real Results',
    'pf.h2':   'built & shipped',
    'pf.sub':  'Every project below is live and built from scratch — no templates, no shortcuts.',
    'pf.all':  'All Projects',
    'pf.live': 'Live Sites',
    // Packages
    'pkg.overline': 'Transparent Pricing',
    'pkg.h2':  'growth level',
    'pkg.sub': 'Every package is a complete solution. No upsells mid-project. No surprises.',
    // Process
    'proc.overline': 'How It Works',
    'proc.h2a': 'idea to live',
    'proc.h2b': 'in days, not months.',
    // CTA Banner
    'cta.h2a': 'Your competitors are',
    'cta.h2b': 'already online.',
    'cta.p':   "Every day without a professional digital presence is revenue left on the table. Let's change that — starting this week.",
    'cta.btn': 'Start For Free',
    // Contact
    'con.overline': "Let's Build Something",
    'con.h2a': 'Ready to',
    'con.h2b': 'dominate your market?',
    'con.p':   "Tell me about your business. I'll respond within 24 hours with a plan — not a pitch.",
    // Form labels
    'form.name':     'Your Name',
    'form.email':    'Email Address',
    'form.business': 'Business / Industry',
    'form.package':  "I'm interested in...",
    'form.message':  'Tell me about your project',
    'form.submit':   'Send My Project Details',
    'form.note':     'I reply within 24 hours. No spam, ever.',
    'form.success':  "Message sent! I'll be in touch within 24 hours.",
    // Footer
    'footer.copy': '© 2025 Damian Aguilera. All rights reserved.',
  },

  es: {
    'nav.about':    'Sobre mí',
    'nav.services': 'Servicios',
    'nav.work':     'Portafolio',
    'nav.packages': 'Paquetes',
    'nav.cta':      'Hablemos',
    // Hero
    'hero.badge':  'Disponible para nuevos proyectos',
    'hero.h1a':    'Tu Negocio',
    'hero.h1b':    'Merece una',
    'hero.h1c':    'Presencia Digital',
    'hero.h1d':    'Que Gane.',
    'hero.role':   'Ingeniero de Software & Estratega Digital',
    'hero.sub':    'No solo construyo sitios web. Construyo <em>motores de crecimiento</em> para negocios.',
    'hero.cta1':   'Ver Mi Trabajo',
    'hero.cta2':   'Agendar Llamada Gratis',
    // Trust
    'trust.projects':     'Proyectos Entregados',
    'trust.satisfaction': 'Clientes Satisfechos',
    'trust.growth':       'Crecimiento Promedio',
    // About
    'about.overline': 'Quién Soy',
    'about.h2a':  'No soy freelancer.',
    'about.h2b':  'Soy tu socio de crecimiento.',
    'about.p1':   'Soy Ingeniero en Desarrollo y Gestión de Software. He visto durante años cómo los negocios pierden dinero porque su presencia digital no refleja su valor real. Ese es el problema que yo resuelvo.',
    'about.p2':   'Atiendo clientes en todo Estados Unidos con ejecución de nivel agencia — lo que significa que obtienes trabajo de calidad americana a una fracción del costo.',
    'about.btn':  'Trabajar Conmigo',
    // Value cards
    'vc.r.title': 'Resultados Primero',
    'vc.r.desc':  'Cada pixel tiene un propósito. Diseño para convertir, no solo para verse bien.',
    'vc.f.title': 'Entrega Rápida',
    'vc.f.desc':  'Landing pages en 3–5 días. Proyectos completos en 2–4 semanas. Siempre a tiempo.',
    'vc.o.title': 'Todo es Tuyo',
    'vc.o.desc':  'Código completo en tus manos. Sin dependencias. Sin costos ocultos. Tu sitio, tus reglas.',
    'vc.u.title': 'Listo para el Mercado',
    'vc.u.desc':  'Construido para audiencias americanas — copy, UX, velocidad y SEO optimizados para ese mercado.',
    // Services
    'srv.overline': 'Lo que Hago',
    'srv.h2a':  'presencia digital',
    'srv.h2b':  'no solo una página web.',
    'srv.sub':  'La diferencia entre un sitio web y una presencia digital es la diferencia entre existir y ganar.',
    // Portfolio
    'pf.overline': 'Trabajo Real, Resultados Reales',
    'pf.h2':   'construidos y publicados',
    'pf.sub':  'Cada proyecto es real, en vivo y construido desde cero — sin templates, sin atajos.',
    'pf.all':  'Todos',
    'pf.live': 'Sitios en Vivo',
    // Packages
    'pkg.overline': 'Precios Transparentes',
    'pkg.h2':  'nivel de crecimiento',
    'pkg.sub': 'Cada paquete es una solución completa. Sin sorpresas ni costos extra a mitad del proyecto.',
    // Process
    'proc.overline': 'Cómo Funciona',
    'proc.h2a': 'de idea a en vivo',
    'proc.h2b': 'en días, no en meses.',
    // CTA Banner
    'cta.h2a': 'Tu competencia ya',
    'cta.h2b': 'está en línea.',
    'cta.p':   'Cada día sin una presencia digital profesional es dinero que se va. Cambiemos eso — empezando esta semana.',
    'cta.btn': 'Empieza Gratis',
    // Contact
    'con.overline': 'Construyamos Algo',
    'con.h2a': '¿Listo para',
    'con.h2b': 'dominar tu mercado?',
    'con.p':   'Cuéntame sobre tu negocio. Te respondo en menos de 24 horas con un plan — no un discurso de ventas.',
    // Form labels
    'form.name':     'Tu Nombre',
    'form.email':    'Correo Electrónico',
    'form.business': 'Negocio / Industria',
    'form.package':  'Me interesa...',
    'form.message':  'Cuéntame sobre tu proyecto',
    'form.submit':   'Enviar Detalles del Proyecto',
    'form.note':     'Respondo en menos de 24 hrs. Sin spam, nunca.',
    'form.success':  '¡Mensaje enviado! Me pongo en contacto en menos de 24 horas.',
    // Footer
    'footer.copy': '© 2025 Damian Aguilera. Todos los derechos reservados.',
  }
};

// Form placeholders per lang
const formPlaceholders = {
  en: {
    name:     'John Smith',
    email:    'john@business.com',
    business: 'e.g. HVAC company in Texas',
    message:  "What does your business do? What's your main goal?",
  },
  es: {
    name:     'Juan Pérez',
    email:    'juan@negocio.com',
    business: 'ej. Taller mecánico en Querétaro',
    message:  '¿A qué se dedica tu negocio? ¿Cuál es tu objetivo principal?',
  }
};

// Package select options per lang
const pkgOptions = {
  en: [
    ['', 'Select a package'],
    ['starter',      'Starter — Landing Page ($190+)'],
    ['professional', 'Professional — Business Site ($290+)'],
    ['business',     'Business — With Backend ($590+)'],
    ['premium',      'Premium — Full-Stack ($1,199+)'],
    ['unsure',       "Not sure — Let's talk"],
  ],
  es: [
    ['', 'Selecciona un paquete'],
    ['starter',      'Starter — Landing Page ($190+)'],
    ['professional', 'Profesional — Sitio de Negocio ($290+)'],
    ['business',     'Business — Con Backend ($590+)'],
    ['premium',      'Premium — Full-Stack ($1,199+)'],
    ['unsure',       'No estoy seguro — Hablemos'],
  ]
};

let currentLang = 'en';

function applyLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Translate all data-i18n elements (innerHTML for those with HTML tags)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Form labels
  const labelMap = {
    name: 'form.name', email: 'form.email',
    business: 'form.business', package: 'form.package', message: 'form.message'
  };
  Object.entries(labelMap).forEach(([id, key]) => {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label && t[key]) label.textContent = t[key];
  });

  // Form placeholders
  const ph = formPlaceholders[lang];
  ['name','email','business','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el && ph[id]) el.placeholder = ph[id];
  });

  // Package select options
  const select = document.getElementById('package');
  if (select) {
    const current = select.value;
    select.innerHTML = pkgOptions[lang]
      .map(([val, label]) => `<option value="${val}">${label}</option>`)
      .join('');
    select.value = current;
  }

  // Submit button text (inside the button, before the SVG)
  const submitBtn = document.querySelector('#contactForm button[type="submit"]');
  if (submitBtn && t['form.submit']) {
    const svg = submitBtn.querySelector('svg');
    submitBtn.textContent = t['form.submit'] + ' ';
    if (svg) submitBtn.appendChild(svg);
  }

  // Form note & success
  const note = document.querySelector('.form__note');
  if (note && t['form.note']) note.textContent = t['form.note'];
  const success = document.getElementById('formSuccess');
  if (success && t['form.success']) {
    const svg = success.querySelector('svg');
    success.textContent = t['form.success'];
    if (svg) success.prepend(svg);
  }

  // Update toggle active state
  document.querySelectorAll('.lang-toggle__option').forEach(opt => {
    opt.classList.toggle('lang-toggle__option--active', opt.dataset.lang === lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Persist choice
  try { localStorage.setItem('da_lang', lang); } catch(e) {}
}

// Wire up the toggle
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'es' : 'en');
  });
  // Also allow clicking individual options
  langToggle.querySelectorAll('.lang-toggle__option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      applyLanguage(opt.dataset.lang);
    });
  });
}

// Load saved preference
try {
  const saved = localStorage.getItem('da_lang');
  if (saved && (saved === 'es' || saved === 'en')) applyLanguage(saved);
} catch(e) {}
