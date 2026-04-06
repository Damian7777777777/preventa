/* ============================================================
   DAMIAN AGUILERA — script.js
   ============================================================ */

// ── ANIMATIONS ────────────────────────────────────────────────
function initAnimations() {
  // Above-the-fold elements
  document.querySelectorAll('.anim').forEach((el, i) => {
    el.classList.add('will-animate');
    setTimeout(() => el.classList.add('is-visible'), 80 + i * 80);
  });
  // Scroll-triggered elements
  const scrollEls = document.querySelectorAll('.scroll-anim');
  scrollEls.forEach(el => el.classList.add('will-animate'));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  scrollEls.forEach(el => obs.observe(el));
}

// ── NAV ───────────────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 55);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── MOBILE MENU ───────────────────────────────────────────────
function initMobileMenu() {
  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!menuBtn) return;
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);
  const open  = () => {
    menuBtn.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    menuBtn.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  };
  menuBtn.addEventListener('click', () => navLinks.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

// ── COUNTERS ──────────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.trust__num[data-count]');
  if (!counters.length) return;
  let triggered = false;
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const start  = performance.now();
    const step   = (now) => {
      const p = Math.min((now - start) / 1800, 1);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.floor(e * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver((entries) => {
    if (triggered) return;
    entries.forEach(e => {
      if (e.isIntersecting) {
        triggered = true;
        counters.forEach(animate);
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const wrap = counters[0].closest('.hero__trust');
  if (wrap) obs.observe(wrap);
}

// ── SMOOTH SCROLL ─────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ── FORM ──────────────────────────────────────────────────────
// Replace YOUR_FORM_ID with your Formspree ID (formspree.io — free)
const FORMSPREE_ID = 'YOUR_FORM_ID';

function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('submitBtn');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="animation:spin .75s linear infinite;flex-shrink:0"><circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/><path d="M12 3a9 9 0 019 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Sending…`;
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        form.reset();
        btn.innerHTML = orig;
        btn.disabled = false;
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 7000);
      } else throw new Error('error');
    } catch {
      btn.disabled = false;
      btn.innerHTML = 'Error — try again';
      setTimeout(() => { btn.innerHTML = orig; }, 3500);
    }
  });
}

// ── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  en: {
    // NAV
    'nav.about':    'About',
    'nav.services': 'Services',
    'nav.work':     'Work',
    'nav.packages': 'Packages',
    'nav.cta':      "Let's Talk",

    // HERO
    'hero.badge': 'Available for new projects',
    'hero.h1a':   'Your Business',
    'hero.h1b':   'Deserves a',
    'hero.h1c':   'Digital Presence',
    'hero.h1d':   'That Wins.',
    'hero.intro': "I'm",
    'hero.role':  'Software Engineer & Digital Strategist',
    'hero.sub':   "I don't just build websites. I build <em>growth engines</em> for US businesses.",
    'hero.cta1':  'See My Work',
    'hero.cta2':  'Book a Free Call',

    // STATS
    'trust.projects':     'Projects Delivered',
    'trust.satisfaction': 'Client Satisfaction',
    'trust.growth':       'Avg. Traffic Growth',

    // ABOUT
    'about.overline': 'Who I Am',
    'about.h2a': 'Built different.',
    'about.h2b': 'Focused on your growth.',
    'about.p1':  "I'm a Software Engineer with a degree in Software Development & Management. I've spent years watching businesses lose money because their digital presence didn't match their real value. That's the problem I solve.",
    'about.p2':  'I deliver agency-level execution for US businesses — professional quality, direct communication, and results you can measure. No middlemen, no delays.',
    'about.btn': 'Work With Me',

    'vc.r.title': 'Results-First',
    'vc.r.desc':  'Every pixel has a purpose. I design for conversions, not just aesthetics.',
    'vc.f.title': 'Fast Delivery',
    'vc.f.desc':  'Landing pages in 3–5 days. Full projects in 2–4 weeks. Deadlines respected.',
    'vc.o.title': 'You Own It All',
    'vc.o.desc':  'Full code ownership. No lock-in. No hidden fees. Your site, your rules.',
    'vc.u.title': 'US Market Ready',
    'vc.u.desc':  'Built for American audiences — copy, UX, speed, and SEO tuned for US traffic.',

    // SERVICES
    'srv.overline': 'What I Do',
    'srv.h2a': 'Digital presence',
    'srv.h2b': 'engineered to convert.',
    'srv.sub':  'The difference between a website and a digital presence is the difference between existing and winning.',

    's1.title': 'Landing Pages',
    's1.desc':  'High-converting single pages built to turn visitors into customers. Perfect for campaigns, products, and local services.',
    's1.l1': 'Compelling copywriting structure',
    's1.l2': 'WhatsApp & social integration',
    's1.l3': 'SEO fundamentals built-in',

    's2.title': 'Business Websites',
    's2.desc':  'Multi-section sites that establish authority, build trust, and generate consistent leads for serious businesses.',
    's2.l1': '3–6 professional sections',
    's2.l2': 'Functional contact forms',
    's2.l3': 'Speed & performance optimized',

    's3.title': 'Full-Stack Web Apps',
    's3.desc':  'Complete solutions with databases, user authentication, APIs and custom dashboards for businesses ready to scale.',
    's3.l1': 'Node.js / PHP backends',
    's3.l2': 'CRM & lead management',
    's3.l3': 'Secure authentication systems',

    's4.title': 'Digital Strategy',
    's4.desc':  "Not sure what you need? I audit your current presence and build a roadmap to digital dominance. Then I execute it.",
    's4.l1': 'Competitor analysis',
    's4.l2': 'SEO & content strategy',
    's4.l3': 'Hosting & tech stack guidance',

    // PORTFOLIO
    'pf.overline': 'Real Work, Real Results',
    'pf.h2':  'built & shipped',
    'pf.sub': 'Every project below is live and built from scratch — no templates, no shortcuts.',
    'pf.all':  'All Projects',
    'pf.live': 'Live Sites',

    'pj.view': 'View Live Site',
    'pj.visit': 'Visit site',
    'pj.restaurant': 'Restaurant',
    'pj.barber':     'Barbershop',
    'pj.landing':    'Landing Page',
    'pj.local':      'Local Business',
    'pj.ecom':       'E-commerce',
    'pj.menu':       'Digital Menu',
    'pj.conversion': 'Conversion Page',

    'p1.desc': 'A vibrant restaurant landing page designed to drive foot traffic and reservations.',
    'p2.desc': 'A bold, modern site for a local barbershop built to attract walk-ins and establish credibility online.',
    'p3.desc': 'A high-conversion landing page showcasing modern design, persuasive copy, and mobile-first performance.',
    'p4.desc': 'A full e-commerce concept — product catalog and shopping experience designed for pet owners ready to buy.',
    'p5.desc': 'A QR-ready digital menu — no printing costs, instant updates, premium dining experience on any device.',

    'pj.cta.h3':  'Your project<br>could be next.',
    'pj.cta.p':   "Every business here started with one conversation. Let's have yours.",
    'pj.cta.btn': 'Start a Project',

    // PACKAGES
    'pkg.overline': 'Investment & Scope',
    'pkg.h2a': 'Choose your',
    'pkg.h2b': 'growth level.',
    'pkg.sub':     'No hidden fees. No surprises. One investment — yours forever.',
    'pkg.from':    'from',
    'pkg.popular': 'Best Results',
    'pkg.bonus':   'Included:',
    'pkg.quote':   'Get a Quote',
    'pkg.talkwa':  "Let's Talk",

    'pk1.name':    'Basic',
    'pk1.tagline': 'Your first step to being found online.',
    'pk1.desc':    'Ideal for independent professionals and local services that need a polished online presence — delivered fast.',
    'pk1.f1': '1 Landing Page',
    'pk1.f2': 'Mobile Responsive Design',
    'pk1.f3': 'WhatsApp CTA Button',
    'pk1.f4': 'Basic SEO Setup',
    'pk1.f5': 'Delivered in 3–5 days',
    'pk1.bonus': 'WhatsApp Business Setup Guide',

    'pk2.name':    'Standard',
    'pk2.tagline': 'More clients. More sales. More calls.',
    'pk2.desc':    'For businesses ready to establish a serious online presence. This is what actually moves the needle.',
    'pk2.f1': '3–5 Sections Full Website',
    'pk2.f2': 'Conversion-Optimized Design',
    'pk2.f3': 'WhatsApp + Contact Form',
    'pk2.f4': 'Google-Ready SEO',
    'pk2.f5': 'Social Media Integration',
    'pk2.f6': 'Speed & Performance Optimized',
    'pk2.bonus': 'Mini Sales Guide + Basic SEO Report',

    'pk3.name':    'Premium',
    'pk3.tagline': 'A complete digital growth system.',
    'pk3.desc':    'Not just a website — a full strategy to dominate your market, built and executed end-to-end.',
    'pk3.f1': 'Everything in Standard',
    'pk3.f2': 'Conversion Rate Optimization',
    'pk3.f3': 'Professional Sales Copywriting',
    'pk3.f4': 'Competitor & Market Analysis',
    'pk3.f5': 'Lead Capture System',
    'pk3.f6': '30-Day Priority Support',
    'pk3.bonus': 'Digital Growth Strategy Session',

    'extras.label':   'Add-ons available:',
    'extras.domain':  'Domain Registration — $15–30/yr',
    'extras.hosting': 'Hosting Setup — $50–150/yr',
    'extras.maint':   'Monthly Maintenance — from $20/mo',
    'extras.changes': 'Extra Revisions — $25–50/hr',

    // PROCESS
    'proc.overline': 'How It Works',
    'proc.h2a': 'From idea to live',
    'proc.h2b': 'in days, not months.',

    'pr1.title': 'Discovery Call',
    'pr1.desc':  'We talk about your business, goals, and what success looks like. 30 minutes that save months of wrong direction.',
    'pr2.title': 'Proposal & Strategy',
    'pr2.desc':  'You receive a clear proposal with timeline, tech stack, and exact deliverables. No vague estimates.',
    'pr3.title': 'Build & Review',
    'pr3.desc':  "You see progress, give feedback, and we iterate until it's exactly right. You're always in the loop.",
    'pr4.title': 'Launch & Grow',
    'pr4.desc':  "Your site goes live, SEO is configured, and the work doesn't stop. I stay as your growth partner.",

    // CTA BANNER
    'cta.h2a': 'Your competitors are',
    'cta.h2b': 'already online.',
    'cta.p':   "Every day without a professional digital presence is revenue left on the table. Let's change that — starting this week.",
    'cta.btn': 'Start the Conversation',

    // CONTACT
    'con.overline': "Let's Build Something",
    'con.h2a': 'Ready to',
    'con.h2b': 'dominate your market?',
    'con.p':   "Tell me about your business. I'll respond within 24 hours with a plan — not a pitch.",
    'con.wa':  'WhatsApp — Fastest Response',

    'form.name':     'Your Name',
    'form.email':    'Email Address',
    'form.business': 'Business / Industry',
    'form.package':  "I'm interested in...",
    'form.select':   'Select a package',
    'form.o1': 'Basic — $150 USD',
    'form.o2': 'Standard — $250 USD',
    'form.o3': 'Premium — $600 USD',
    'form.o5': "Not sure — Let's talk",
    'form.message': 'Tell me about your project',
    'form.submit':  'Send My Project Details',
    'form.note':    'I reply within 24 hours. No spam, ever.',
    'form.success': "Message sent! I'll be in touch within 24 hours.",

    // FOOTER
    'footer.copy': '© 2025 Damian Aguilera. All rights reserved.',
  },

  es: {
    // NAV
    'nav.about':    'Sobre Mí',
    'nav.services': 'Servicios',
    'nav.work':     'Portafolio',
    'nav.packages': 'Paquetes',
    'nav.cta':      'Hablemos',

    // HERO
    'hero.badge': 'Disponible para nuevos proyectos',
    'hero.h1a':   'Tu Negocio',
    'hero.h1b':   'Merece una',
    'hero.h1c':   'Presencia Digital',
    'hero.h1d':   'Que Gane.',
    'hero.intro': 'Soy',
    'hero.role':  'Ingeniero de Software y Estratega Digital',
    'hero.sub':   'No solo construyo sitios web. Construyo <em>motores de crecimiento</em> para negocios en EE.UU.',
    'hero.cta1':  'Ver Mi Trabajo',
    'hero.cta2':  'Llamada Gratuita',

    // STATS
    'trust.projects':     'Proyectos Entregados',
    'trust.satisfaction': 'Satisfacción del Cliente',
    'trust.growth':       'Crecimiento de Tráfico',

    // ABOUT
    'about.overline': 'Quién Soy',
    'about.h2a': 'Diferente al resto.',
    'about.h2b': 'Enfocado en tu crecimiento.',
    'about.p1':  'Soy Ingeniero de Software con carrera en Desarrollo y Gestión de Software. Años viendo cómo los negocios pierden dinero porque su presencia digital no refleja su valor real. Ese es el problema que resuelvo.',
    'about.p2':  'Entrego ejecución de nivel agencia para negocios en EE.UU. — calidad profesional, comunicación directa y resultados medibles. Sin intermediarios, sin retrasos.',
    'about.btn': 'Trabajar Juntos',

    'vc.r.title': 'Resultados Primero',
    'vc.r.desc':  'Cada píxel tiene un propósito. Diseño para conversiones, no solo estética.',
    'vc.f.title': 'Entrega Rápida',
    'vc.f.desc':  'Landing pages en 3–5 días. Proyectos completos en 2–4 semanas. Plazos respetados.',
    'vc.o.title': 'Todo es Tuyo',
    'vc.o.desc':  'Propiedad total del código. Sin ataduras. Sin cargos ocultos. Tu sitio, tus reglas.',
    'vc.u.title': 'Listo para EE.UU.',
    'vc.u.desc':  'Construido para audiencias americanas — copy, UX, velocidad y SEO optimizados para tráfico de EE.UU.',

    // SERVICES
    'srv.overline': 'Qué Hago',
    'srv.h2a': 'Presencia digital',
    'srv.h2b': 'diseñada para convertir.',
    'srv.sub':  'La diferencia entre un sitio web y una presencia digital es la diferencia entre existir y ganar.',

    's1.title': 'Landing Pages',
    's1.desc':  'Páginas de alta conversión para convertir visitantes en clientes. Perfectas para campañas, productos y servicios locales.',
    's1.l1': 'Estructura de copy persuasiva',
    's1.l2': 'Integración de WhatsApp y redes sociales',
    's1.l3': 'Fundamentos de SEO integrados',

    's2.title': 'Sitios de Negocio',
    's2.desc':  'Sitios multisección que establecen autoridad, generan confianza y producen clientes potenciales de manera constante.',
    's2.l1': '3–6 secciones profesionales',
    's2.l2': 'Formularios de contacto funcionales',
    's2.l3': 'Velocidad y rendimiento optimizados',

    's3.title': 'Aplicaciones Web Full-Stack',
    's3.desc':  'Soluciones completas con bases de datos, autenticación de usuarios, APIs y dashboards personalizados para escalar.',
    's3.l1': 'Backends en Node.js / PHP',
    's3.l2': 'CRM y gestión de leads',
    's3.l3': 'Sistemas de autenticación seguros',

    's4.title': 'Estrategia Digital',
    's4.desc':  '¿No sabes qué necesitas? Audito tu presencia actual y construyo una hoja de ruta para dominar tu mercado. Luego lo ejecuto.',
    's4.l1': 'Análisis de la competencia',
    's4.l2': 'Estrategia de SEO y contenido',
    's4.l3': 'Guía de hosting y stack tecnológico',

    // PORTFOLIO
    'pf.overline': 'Trabajo Real, Resultados Reales',
    'pf.h2':  'construidos y publicados',
    'pf.sub': 'Cada proyecto está en vivo y construido desde cero — sin plantillas, sin atajos.',
    'pf.all':  'Todos los Proyectos',
    'pf.live': 'Sitios en Vivo',

    'pj.view':  'Ver Sitio en Vivo',
    'pj.visit': 'Visitar sitio',
    'pj.restaurant': 'Restaurante',
    'pj.barber':     'Barbería',
    'pj.landing':    'Landing Page',
    'pj.local':      'Negocio Local',
    'pj.ecom':       'E-commerce',
    'pj.menu':       'Menú Digital',
    'pj.conversion': 'Página de Conversión',

    'p1.desc': 'Landing page de restaurante diseñada para generar visitas y reservaciones desde el lanzamiento.',
    'p2.desc': 'Sitio moderno para barbería local — más clientes, credibilidad establecida, reservas por WhatsApp.',
    'p3.desc': 'Landing page de alta conversión con diseño moderno, copy persuasivo y rendimiento mobile-first.',
    'p4.desc': 'E-commerce completo — catálogo de productos y experiencia de compra para dueños de mascotas.',
    'p5.desc': 'Menú digital listo para QR — sin costos de impresión, actualizaciones instantáneas, experiencia premium.',

    'pj.cta.h3':  'Tu proyecto<br>podría ser el siguiente.',
    'pj.cta.p':   'Cada negocio aquí empezó con una conversación. Tengamos la tuya.',
    'pj.cta.btn': 'Iniciar un Proyecto',

    // PACKAGES
    'pkg.overline': 'Inversión y Alcance',
    'pkg.h2a': 'Elige tu',
    'pkg.h2b': 'nivel de crecimiento.',
    'pkg.sub':     'Sin cargos ocultos. Sin sorpresas. Una inversión — tuya para siempre.',
    'pkg.from':    'desde',
    'pkg.popular': 'Mejores Resultados',
    'pkg.bonus':   'Incluido:',
    'pkg.quote':   'Solicitar Cotización',
    'pkg.talkwa':  'Hablemos',

    'pk1.name':    'Básico',
    'pk1.tagline': 'Tu primer paso para ser encontrado en línea.',
    'pk1.desc':    'Ideal para profesionales independientes y servicios locales que necesitan presencia profesional en línea — entregada rápido.',
    'pk1.f1': '1 Landing Page',
    'pk1.f2': 'Diseño Responsive',
    'pk1.f3': 'Botón de Llamada a WhatsApp',
    'pk1.f4': 'Configuración de SEO Básico',
    'pk1.f5': 'Entrega en 3–5 días',
    'pk1.bonus': 'Guía de Configuración de WhatsApp Business',

    'pk2.name':    'Estándar',
    'pk2.tagline': 'Más clientes. Más ventas. Más llamadas.',
    'pk2.desc':    'Para negocios listos para establecer una presencia en línea seria. Esto es lo que realmente mueve la aguja.',
    'pk2.f1': 'Sitio Web Completo 3–5 Secciones',
    'pk2.f2': 'Diseño Optimizado para Conversión',
    'pk2.f3': 'WhatsApp + Formulario de Contacto',
    'pk2.f4': 'SEO Listo para Google',
    'pk2.f5': 'Integración con Redes Sociales',
    'pk2.f6': 'Velocidad y Rendimiento Optimizados',
    'pk2.bonus': 'Mini Guía de Ventas + Reporte SEO Básico',

    'pk3.name':    'Premium',
    'pk3.tagline': 'Un sistema de crecimiento digital completo.',
    'pk3.desc':    'No solo un sitio web — una estrategia completa para dominar tu mercado, construida y ejecutada de principio a fin.',
    'pk3.f1': 'Todo lo del Estándar',
    'pk3.f2': 'Optimización de Tasa de Conversión',
    'pk3.f3': 'Copywriting de Ventas Profesional',
    'pk3.f4': 'Análisis de Competencia y Mercado',
    'pk3.f5': 'Sistema de Captura de Leads',
    'pk3.f6': 'Soporte Prioritario por 30 Días',
    'pk3.bonus': 'Sesión de Estrategia de Crecimiento Digital',

    'extras.label':   'Servicios adicionales:',
    'extras.domain':  'Registro de Dominio — $15–30/año',
    'extras.hosting': 'Configuración de Hosting — $50–150/año',
    'extras.maint':   'Mantenimiento Mensual — desde $20/mes',
    'extras.changes': 'Revisiones Adicionales — $25–50/hr',

    // PROCESS
    'proc.overline': 'Cómo Funciona',
    'proc.h2a': 'De la idea al lanzamiento',
    'proc.h2b': 'en días, no meses.',

    'pr1.title': 'Llamada de Descubrimiento',
    'pr1.desc':  'Hablamos de tu negocio, objetivos y qué significa el éxito. 30 minutos que ahorran meses de dirección equivocada.',
    'pr2.title': 'Propuesta y Estrategia',
    'pr2.desc':  'Recibes una propuesta clara con cronograma, stack tecnológico y entregables exactos. Sin estimaciones vagas.',
    'pr3.title': 'Construcción y Revisión',
    'pr3.desc':  'Ves el progreso, das retroalimentación e iteramos hasta que quede perfecto. Siempre estás informado.',
    'pr4.title': 'Lanzamiento y Crecimiento',
    'pr4.desc':  'Tu sitio sale en vivo, el SEO está configurado y el trabajo no se detiene. Me quedo como tu socio de crecimiento.',

    // CTA BANNER
    'cta.h2a': 'Tu competencia ya está',
    'cta.h2b': 'en línea.',
    'cta.p':   'Cada día sin presencia digital profesional es dinero que se queda sobre la mesa. Cambiemos eso — empezando esta semana.',
    'cta.btn': 'Iniciar la Conversación',

    // CONTACT
    'con.overline': 'Construyamos Algo',
    'con.h2a': 'Listo para',
    'con.h2b': 'dominar tu mercado?',
    'con.p':   'Cuéntame sobre tu negocio. Respondo en menos de 24 horas con un plan — no con un discurso de ventas.',
    'con.wa':  'WhatsApp — Respuesta más rápida',

    'form.name':     'Tu Nombre',
    'form.email':    'Correo Electrónico',
    'form.business': 'Negocio / Industria',
    'form.package':  'Me interesa...',
    'form.select':   'Selecciona un paquete',
    'form.o1': 'Básico — $150 USD',
    'form.o2': 'Estándar — $250 USD',
    'form.o3': 'Premium — $600 USD',
    'form.o5': 'No estoy seguro — Hablemos',
    'form.message': 'Cuéntame sobre tu proyecto',
    'form.submit':  'Enviar Detalles del Proyecto',
    'form.note':    'Respondo en menos de 24 hrs. Sin spam, nunca.',
    'form.success': '¡Mensaje enviado! Me pongo en contacto en menos de 24 horas.',

    // FOOTER
    'footer.copy': '© 2025 Damian Aguilera. Todos los derechos reservados.',
  }
};

const PLACEHOLDERS = {
  en: {
    fname:     'John Smith',
    femail:    'john@business.com',
    fbusiness: 'e.g. HVAC company in Texas',
    fmessage:  "What does your business do? What's your main goal?"
  },
  es: {
    fname:     'Juan Pérez',
    femail:    'juan@negocio.com',
    fbusiness: 'ej. Taller mecánico en Querétaro',
    fmessage:  '¿A qué se dedica tu negocio? ¿Cuál es tu objetivo principal?'
  }
};

let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  const t = T[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  const ph = PLACEHOLDERS[lang];
  Object.entries(ph).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = val;
  });
  document.querySelectorAll('.lang-toggle__option').forEach(opt =>
    opt.classList.toggle('lang-toggle__option--active', opt.dataset.lang === lang)
  );
  document.documentElement.lang = lang;
  try { localStorage.setItem('da_lang', lang); } catch(e) {}
}

function initLang() {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => applyLang(currentLang === 'en' ? 'es' : 'en'));
  toggle.querySelectorAll('.lang-toggle__option').forEach(opt =>
    opt.addEventListener('click', (e) => { e.stopPropagation(); applyLang(opt.dataset.lang); })
  );
  try {
    const saved = localStorage.getItem('da_lang');
    if (saved === 'es' || saved === 'en') applyLang(saved);
  } catch(e) {}
}

// ── BOOT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initNav();
  initMobileMenu();
  initCounters();
  initSmoothScroll();
  initForm();
  initLang();
});
