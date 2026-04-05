/* ============================================================
   DAMIAN AGUILERA — script.js
   ============================================================ */

// ── ANIMATIONS ───────────────────────────────────────────────
// Strategy: mark elements with will-animate FIRST (sets opacity:0),
// then immediately trigger the transition to is-visible.
// If JS never runs, elements stay visible (no opacity:0 in default CSS).

function initAnimations() {
  // Hero elements animate on load
  document.querySelectorAll('.anim').forEach((el, i) => {
    el.classList.add('will-animate');
    setTimeout(() => el.classList.add('is-visible'), 100 + i * 60);
  });

  // Scroll elements animate when entering viewport
  const scrollEls = document.querySelectorAll('.scroll-anim');
  scrollEls.forEach(el => el.classList.add('will-animate'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  scrollEls.forEach(el => observer.observe(el));
}

// ── NAV SCROLL ───────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// ── MOBILE MENU ──────────────────────────────────────────────
function initMobileMenu() {
  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!menuBtn) return;

  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  const open  = () => { menuBtn.classList.add('open'); navLinks.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; };
  const close = () => { menuBtn.classList.remove('open'); navLinks.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; };

  menuBtn.addEventListener('click', () => navLinks.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

// ── COUNTER ANIMATION ────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.trust__num[data-count]');
  if (!counters.length) return;

  let triggered = false;
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const start  = performance.now();
    const step   = (now) => {
      const p    = Math.min((now - start) / 1800, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.floor(ease * target);
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

// ── SMOOTH SCROLL ────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ── PORTFOLIO FILTER ─────────────────────────────────────────
function initPortfolioFilter() {
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.pj-card[data-type]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => b.classList.remove('pf-btn--active'));
      btn.classList.add('pf-btn--active');
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.type === filter || card.classList.contains('pj-card--cta');
        card.classList.toggle('pf-hidden', !show);
      });
    });
  });
}

// ── CONTACT FORM ─────────────────────────────────────────────
// Setup: formspree.io → sign up free → new form → paste your ID below
const FORMSPREE_ID = 'YOUR_FORM_ID'; // <-- replace this

function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalHTML = btn.innerHTML;
    btn.disabled  = true;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="animation:spin .75s linear infinite;flex-shrink:0"><circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/><path d="M12 3a9 9 0 019 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Sending…`;

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) {
        form.reset();
        btn.innerHTML = originalHTML;
        btn.disabled  = false;
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 7000);
      } else throw new Error('Server error');
    } catch {
      btn.disabled  = false;
      btn.innerHTML = '⚠️ Something went wrong — try again';
      setTimeout(() => { btn.innerHTML = originalHTML; }, 3500);
    }
  });
}

// ── LANGUAGE SYSTEM ──────────────────────────────────────────
const T = {
  en: {
    'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work',
    'nav.packages': 'Packages', 'nav.cta': "Let's Talk",
    'hero.badge': 'Available for new projects',
    'hero.h1a': 'Your Business', 'hero.h1b': 'Deserves a',
    'hero.h1c': 'Digital Presence', 'hero.h1d': 'That Wins.',
    'hero.role': 'Software Engineer & Digital Strategist',
    'hero.sub': "I don't just build websites. I build <em>growth engines</em> for US businesses.",
    'hero.cta1': 'See My Work', 'hero.cta2': 'Book a Free Call',
    'trust.projects': 'Projects Delivered', 'trust.satisfaction': 'Client Satisfaction', 'trust.growth': 'Avg. Traffic Growth',
    'about.overline': 'Who I Am',
    'about.h2a': 'Not a freelancer.', 'about.h2b': 'A partner in your growth.',
    'about.p1': "I'm a Software Engineer with a degree in Software Development & Management. I've spent years watching businesses lose money because their digital presence didn't match their real value. That's the problem I fix.",
    'about.p2': 'Serving clients across the United States with agency-level execution — which means you get American-quality work at a fraction of agency cost.',
    'about.btn': 'Work With Me',
    'vc.r.title': 'Results-First', 'vc.r.desc': 'Every pixel has a purpose. I design for conversions, not just aesthetics.',
    'vc.f.title': 'Fast Delivery', 'vc.f.desc': 'Landing pages in 3–5 days. Full projects in 2–4 weeks. Deadlines respected.',
    'vc.o.title': 'You Own It All', 'vc.o.desc': 'Full code ownership. No lock-in. No hidden fees. Your site, your rules.',
    'vc.u.title': 'US Market Ready', 'vc.u.desc': 'Built for American audiences — copy, UX, speed, and SEO tuned for US traffic.',
    'srv.overline': 'What I Do', 'srv.h2a': 'digital presence', 'srv.h2b': 'not just a website.',
    'srv.sub': 'The difference between a website and a digital presence is the difference between existing and winning.',
    's1.title':'Landing Pages','s1.desc':'High-converting single pages built to turn visitors into customers. Perfect for campaigns, products, and local services.','s1.l1':'Compelling copywriting structure','s1.l2':'WhatsApp & social integration','s1.l3':'SEO fundamentals built-in',
    's2.title':'Business Websites','s2.desc':'Multi-section sites that establish authority, build trust, and generate consistent leads for serious businesses.','s2.l1':'3–6 professional sections','s2.l2':'Functional contact forms','s2.l3':'Speed & performance optimized',
    's3.title':'Full-Stack Web Apps','s3.desc':'Complete solutions with databases, user authentication, APIs and custom dashboards for businesses ready to scale.','s3.l1':'Node.js / PHP backends','s3.l2':'CRM & lead management','s3.l3':'Secure authentication systems',
    's4.title':'Digital Strategy','s4.desc':"Not sure what you need? I audit your current presence and create a roadmap to digital dominance. Then I execute it.",'s4.l1':'Competitor analysis','s4.l2':'SEO & content strategy','s4.l3':'Hosting & tech stack guidance',
    'pf.overline': 'Real Work, Real Results', 'pf.h2': 'built & shipped',
    'pf.sub': 'Every project below is live and built from scratch — no templates, no shortcuts.',
    'pf.all': 'All Projects', 'pf.live': 'Live Sites',
    'pj.view': 'View Live Site', 'pj.visit': 'Visit site',
    'pj.restaurant': 'Restaurant', 'pj.landing': 'Landing Page', 'pj.barber': 'Barbershop',
    'pj.local': 'Local Business', 'pj.conversion': 'Conversion Page', 'pj.ecom': 'E-commerce', 'pj.menu': 'Digital Menu',
    'p1.desc': 'A vibrant restaurant landing page designed to drive foot traffic and reservations.',
    'p2.desc': 'A bold, modern site for a local barbershop built to attract walk-ins and establish credibility online.',
    'p3.desc': 'A high-conversion landing page showcasing modern design, persuasive copy structure, and mobile-first performance.',
    'p4.desc': 'A full e-commerce concept — product catalog and shopping experience designed for pet owners ready to buy.',
    'p5.desc': 'A QR-ready digital menu — no printing costs, instant updates, premium dining experience on any device.',
    'pj.cta.h3': 'Your project<br>could be next.', 'pj.cta.p': "Every business here started with one conversation. Let's have yours.", 'pj.cta.btn': 'Start a Project',
    'pkg.overline': 'Transparent Pricing', 'pkg.h2': 'growth level',
    'pkg.sub': 'Every package is a complete solution. No upsells mid-project. No surprises.',
    'pkg.from': 'from', 'pkg.start': 'Get Started', 'pkg.talk': "Let's Talk", 'pkg.popular': 'Most Popular',
    'pk1.name':'Starter','pk1.desc':'Perfect for freelancers, local services, and solopreneurs who need a professional first step online.','pk1.f1':'1 Landing Page','pk1.f2':'Mobile Responsive Design','pk1.f3':'WhatsApp / Instagram CTA','pk1.f4':'Contact Form','pk1.f5':'Basic SEO Setup','pk1.f6':'Delivered in 3–5 days',
    'pk2.name':'Professional','pk2.desc':'For established businesses that want to look credible, rank on Google, and convert real leads.','pk2.f1':'3–6 Page Sections','pk2.f2':'Functional Email Forms','pk2.f3':'Social Media Integration','pk2.f4':'Scroll Animations','pk2.f5':'Speed Optimization','pk2.f6':'Domain + Hosting Setup',
    'pk3.name':'Business','pk3.desc':'Full digital infrastructure. Backend, database, lead management — built to scale with your business.','pk3.f1':'Everything in Professional','pk3.f2':'Node.js / PHP Backend','pk3.f3':'Lead & Contact Database','pk3.f4':'Simple Admin Panel','pk3.f5':'CRM Integration','pk3.f6':'Security & VPS Setup',
    'pk4.name':'Premium','pk4.desc':'Agency-level execution. Custom design, full-stack development, and long-term partnership for companies that want to dominate.','pk4.f1':'Custom UI/UX Design','pk4.f2':'Full-Stack Development','pk4.f3':'User Authentication & API','pk4.f4':'Professional Deployment','pk4.f5':'Monthly Maintenance','pk4.f6':'Priority Support',
    'extras.label':'Add-ons available:','extras.domain':'🌐 Domain Registration — $15–30/yr','extras.hosting':'🖥️ Hosting Setup — $50–150/yr','extras.maint':'🔧 Monthly Maintenance — from $20/mo','extras.changes':'✏️ Extra Changes — $25–50/hr',
    'proc.overline': 'How It Works', 'proc.h2a': 'idea to live', 'proc.h2b': 'in days, not months.',
    'pr1.title':'Free Discovery Call','pr1.desc':'We talk about your business, goals, and what success looks like. 30 minutes that save months of wrong direction.',
    'pr2.title':'Proposal & Strategy','pr2.desc':'I send a clear proposal with timeline, tech stack, and exact deliverables. No vague estimates.',
    'pr3.title':'Build & Review','pr3.desc':"You see progress, give feedback, and we iterate until it's exactly right. You're always in the loop.",
    'pr4.title':'Launch & Grow','pr4.desc':"Your site goes live, SEO is set, and I don't disappear. I'm your partner for what comes next.",
    'cta.h2a': 'Your competitors are', 'cta.h2b': 'already online.',
    'cta.p': "Every day without a professional digital presence is revenue left on the table. Let's change that — starting this week.",
    'cta.btn': 'Start For Free',
    'con.overline': "Let's Build Something", 'con.h2a': 'Ready to', 'con.h2b': 'dominate your market?',
    'con.p': "Tell me about your business. I'll respond within 24 hours with a plan — not a pitch.",
    'con.wa': 'WhatsApp Me',
    'form.name':'Your Name','form.email':'Email Address','form.business':'Business / Industry',
    'form.package':"I'm interested in...",'form.select':'Select a package',
    'form.o1':'Starter — Landing Page ($190+)','form.o2':'Professional — Business Site ($290+)',
    'form.o3':'Business — With Backend ($590+)','form.o4':'Premium — Full-Stack ($1,199+)',
    'form.o5':"Not sure — Let's talk",
    'form.message':'Tell me about your project',
    'form.submit':'Send My Project Details','form.note':'I reply within 24 hours. No spam, ever.',
    'form.success':"Message sent! I'll be in touch within 24 hours.",
    'footer.copy': '© 2025 Damian Aguilera. All rights reserved.',
  },
  es: {
    'nav.about': 'Sobre mí', 'nav.services': 'Servicios', 'nav.work': 'Portafolio',
    'nav.packages': 'Paquetes', 'nav.cta': 'Hablemos',
    'hero.badge': 'Disponible para nuevos proyectos',
    'hero.h1a': 'Tu Negocio', 'hero.h1b': 'Merece una',
    'hero.h1c': 'Presencia Digital', 'hero.h1d': 'Que Gane.',
    'hero.role': 'Ingeniero de Software & Estratega Digital',
    'hero.sub': 'No solo construyo sitios web. Construyo <em>motores de crecimiento</em> para negocios.',
    'hero.cta1': 'Ver Mi Trabajo', 'hero.cta2': 'Agendar Llamada Gratis',
    'trust.projects': 'Proyectos Entregados', 'trust.satisfaction': 'Clientes Satisfechos', 'trust.growth': 'Crecimiento Promedio',
    'about.overline': 'Quién Soy',
    'about.h2a': 'No soy freelancer.', 'about.h2b': 'Soy tu socio de crecimiento.',
    'about.p1': 'Soy Ingeniero en Desarrollo y Gestión de Software. He visto durante años cómo los negocios pierden dinero porque su presencia digital no refleja su valor real. Ese es el problema que yo resuelvo.',
    'about.p2': 'Atiendo clientes en todo Estados Unidos con ejecución de nivel agencia — obtienes trabajo de calidad americana a una fracción del costo.',
    'about.btn': 'Trabajar Conmigo',
    'vc.r.title': 'Resultados Primero', 'vc.r.desc': 'Cada pixel tiene un propósito. Diseño para convertir, no solo para verse bien.',
    'vc.f.title': 'Entrega Rápida', 'vc.f.desc': 'Landing pages en 3–5 días. Proyectos completos en 2–4 semanas. Siempre a tiempo.',
    'vc.o.title': 'Todo es Tuyo', 'vc.o.desc': 'Código completo en tus manos. Sin dependencias. Sin costos ocultos. Tu sitio, tus reglas.',
    'vc.u.title': 'Listo para el Mercado', 'vc.u.desc': 'Construido para audiencias americanas — copy, UX, velocidad y SEO optimizados.',
    'srv.overline': 'Lo que Hago', 'srv.h2a': 'presencia digital', 'srv.h2b': 'no solo una página web.',
    'srv.sub': 'La diferencia entre un sitio web y una presencia digital es la diferencia entre existir y ganar.',
    's1.title':'Landing Pages','s1.desc':'Páginas de alta conversión para transformar visitantes en clientes. Perfectas para campañas y servicios locales.','s1.l1':'Estructura de copy persuasivo','s1.l2':'Integración con WhatsApp y redes','s1.l3':'SEO fundamental incluido',
    's2.title':'Sitios de Negocio','s2.desc':'Sitios multi-sección que establecen autoridad, generan confianza y captan leads de forma constante.','s2.l1':'3–6 secciones profesionales','s2.l2':'Formularios de contacto funcionales','s2.l3':'Optimización de velocidad',
    's3.title':'Aplicaciones Web','s3.desc':'Soluciones completas con base de datos, autenticación y dashboards para negocios listos para escalar.','s3.l1':'Backend Node.js / PHP','s3.l2':'Gestión de leads y CRM','s3.l3':'Sistemas de autenticación seguros',
    's4.title':'Estrategia Digital','s4.desc':'¿No sabes qué necesitas? Audito tu presencia actual y creo un plan para dominar digitalmente. Y lo ejecuto.','s4.l1':'Análisis de competencia','s4.l2':'Estrategia SEO y contenido','s4.l3':'Asesoría de hosting y tecnología',
    'pf.overline': 'Trabajo Real, Resultados Reales', 'pf.h2': 'construidos y publicados',
    'pf.sub': 'Cada proyecto es real, en vivo y construido desde cero — sin templates, sin atajos.',
    'pf.all': 'Todos', 'pf.live': 'Sitios en Vivo',
    'pj.view': 'Ver Sitio en Vivo', 'pj.visit': 'Visitar sitio',
    'pj.restaurant': 'Restaurante', 'pj.landing': 'Landing Page', 'pj.barber': 'Barbería',
    'pj.local': 'Negocio Local', 'pj.conversion': 'Página de Conversión', 'pj.ecom': 'E-commerce', 'pj.menu': 'Menú Digital',
    'p1.desc': 'Landing page para restaurante diseñada para atraer clientes y reservaciones.',
    'p2.desc': 'Sitio moderno para barbería local que atrae clientes presenciales y establece presencia digital.',
    'p3.desc': 'Template de alta conversión con diseño moderno, estructura de copy persuasivo y rendimiento mobile-first.',
    'p4.desc': 'Concepto de e-commerce completo — catálogo de productos y experiencia de compra para dueños de mascotas.',
    'p5.desc': 'Menú digital listo para QR — sin costos de impresión, actualizaciones instantáneas, experiencia premium en cualquier dispositivo.',
    'pj.cta.h3': 'Tu proyecto<br>podría ser el siguiente.', 'pj.cta.p': 'Cada negocio aquí empezó con una conversación. Tengamos la tuya.', 'pj.cta.btn': 'Iniciar Proyecto',
    'pkg.overline': 'Precios Transparentes', 'pkg.h2': 'nivel de crecimiento',
    'pkg.sub': 'Cada paquete es una solución completa. Sin sorpresas ni costos extra a mitad del proyecto.',
    'pkg.from': 'desde', 'pkg.start': 'Comenzar', 'pkg.talk': 'Hablemos', 'pkg.popular': 'Más Popular',
    'pk1.name':'Starter','pk1.desc':'Perfecto para freelancers, servicios locales y solopreneurs que necesitan un primer paso profesional en línea.','pk1.f1':'1 Landing Page','pk1.f2':'Diseño Responsive','pk1.f3':'CTA a WhatsApp / Instagram','pk1.f4':'Formulario de Contacto','pk1.f5':'SEO Básico','pk1.f6':'Entrega en 3–5 días',
    'pk2.name':'Profesional','pk2.desc':'Para negocios establecidos que quieren verse creíbles, aparecer en Google y convertir leads reales.','pk2.f1':'3–6 Secciones','pk2.f2':'Formularios Funcionales','pk2.f3':'Integración Redes Sociales','pk2.f4':'Animaciones de Scroll','pk2.f5':'Optimización de Velocidad','pk2.f6':'Dominio + Hosting Incluido',
    'pk3.name':'Business','pk3.desc':'Infraestructura digital completa. Backend, base de datos, gestión de leads — construida para escalar.','pk3.f1':'Todo lo del Profesional','pk3.f2':'Backend Node.js / PHP','pk3.f3':'Base de Datos de Leads','pk3.f4':'Panel Administrativo','pk3.f5':'Integración CRM','pk3.f6':'Seguridad y VPS',
    'pk4.name':'Premium','pk4.desc':'Ejecución de nivel agencia. Diseño custom, desarrollo full-stack y alianza a largo plazo para empresas que quieren dominar.','pk4.f1':'Diseño UI/UX Custom','pk4.f2':'Desarrollo Full-Stack','pk4.f3':'Autenticación y API','pk4.f4':'Despliegue Profesional','pk4.f5':'Mantenimiento Mensual','pk4.f6':'Soporte Prioritario',
    'extras.label':'Add-ons disponibles:','extras.domain':'🌐 Dominio — $15–30/año','extras.hosting':'🖥️ Hosting — $50–150/año','extras.maint':'🔧 Mantenimiento — desde $20/mes','extras.changes':'✏️ Cambios extra — $25–50/hr',
    'proc.overline': 'Cómo Funciona', 'proc.h2a': 'de idea a en vivo', 'proc.h2b': 'en días, no en meses.',
    'pr1.title':'Llamada de Descubrimiento Gratis','pr1.desc':'Hablamos de tu negocio, objetivos y qué significa el éxito para ti. 30 minutos que ahorran meses de dirección equivocada.',
    'pr2.title':'Propuesta y Estrategia','pr2.desc':'Te envío una propuesta clara con timeline, stack tecnológico y entregables exactos. Sin estimados vagos.',
    'pr3.title':'Construcción y Revisión','pr3.desc':'Ves el progreso, das retroalimentación e iteramos hasta que quede perfecto. Siempre estás en el loop.',
    'pr4.title':'Lanzamiento y Crecimiento','pr4.desc':'Tu sitio sale en vivo, el SEO está configurado y no desaparezco. Soy tu socio para lo que sigue.',
    'cta.h2a': 'Tu competencia ya', 'cta.h2b': 'está en línea.',
    'cta.p': 'Cada día sin presencia digital profesional es dinero que se va. Cambiemos eso — empezando esta semana.',
    'cta.btn': 'Empieza Gratis',
    'con.overline': 'Construyamos Algo', 'con.h2a': '¿Listo para', 'con.h2b': 'dominar tu mercado?',
    'con.p': 'Cuéntame sobre tu negocio. Te respondo en menos de 24 horas con un plan — no un discurso de ventas.',
    'con.wa': 'Escríbeme por WhatsApp',
    'form.name':'Tu Nombre','form.email':'Correo Electrónico','form.business':'Negocio / Industria',
    'form.package':'Me interesa...','form.select':'Selecciona un paquete',
    'form.o1':'Starter — Landing Page ($190+)','form.o2':'Profesional — Sitio de Negocio ($290+)',
    'form.o3':'Business — Con Backend ($590+)','form.o4':'Premium — Full-Stack ($1,199+)',
    'form.o5':'No estoy seguro — Hablemos',
    'form.message':'Cuéntame sobre tu proyecto',
    'form.submit':'Enviar Detalles del Proyecto','form.note':'Respondo en menos de 24 hrs. Sin spam, nunca.',
    'form.success':'¡Mensaje enviado! Me pongo en contacto en menos de 24 horas.',
    'footer.copy': '© 2025 Damian Aguilera. Todos los derechos reservados.',
  }
};

const PLACEHOLDERS = {
  en: { fname:'John Smith', femail:'john@business.com', fbusiness:'e.g. HVAC company in Texas', fmessage:"What does your business do? What's your main goal?" },
  es: { fname:'Juan Pérez', femail:'juan@negocio.com',  fbusiness:'ej. Taller en Querétaro',    fmessage:'¿A qué se dedica tu negocio? ¿Cuál es tu objetivo principal?' }
};

let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  const t = T[lang];

  // Translate all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Placeholders
  const ph = PLACEHOLDERS[lang];
  Object.entries(ph).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = val;
  });

  // Toggle active state
  document.querySelectorAll('.lang-toggle__option').forEach(opt => {
    opt.classList.toggle('lang-toggle__option--active', opt.dataset.lang === lang);
  });

  document.documentElement.lang = lang;
  try { localStorage.setItem('da_lang', lang); } catch(e) {}
}

function initLang() {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => applyLang(currentLang === 'en' ? 'es' : 'en'));

  toggle.querySelectorAll('.lang-toggle__option').forEach(opt => {
    opt.addEventListener('click', (e) => { e.stopPropagation(); applyLang(opt.dataset.lang); });
  });

  // Restore saved preference
  try {
    const saved = localStorage.getItem('da_lang');
    if (saved === 'es' || saved === 'en') applyLang(saved);
  } catch(e) {}
}

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initNav();
  initMobileMenu();
  initCounters();
  initSmoothScroll();
  initPortfolioFilter();
  initForm();
  initLang();
});
