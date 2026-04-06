/* ============================================================
   DAMIAN AGUILERA — script.js
   ============================================================ */

// ── ANIMATIONS ───────────────────────────────────────────────
function initAnimations() {
  document.querySelectorAll('.anim').forEach((el, i) => {
    el.classList.add('will-animate');
    setTimeout(() => el.classList.add('is-visible'), 80 + i * 70);
  });
  const scrollEls = document.querySelectorAll('.scroll-anim');
  scrollEls.forEach(el => el.classList.add('will-animate'));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  scrollEls.forEach(el => obs.observe(el));
}

// ── NAV ──────────────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── MOBILE MENU ──────────────────────────────────────────────
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
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

// ── COUNTERS ─────────────────────────────────────────────────
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
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver((entries) => {
    if (triggered) return;
    entries.forEach(e => { if (e.isIntersecting) { triggered = true; counters.forEach(animate); obs.disconnect(); } });
  }, { threshold: 0.5 });
  const wrap = counters[0].closest('.hero__trust');
  if (wrap) obs.observe(wrap);
}

// ── SMOOTH SCROLL ────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ── FORM ─────────────────────────────────────────────────────
// Replace YOUR_FORM_ID with your Formspree ID (formspree.io → free signup)
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
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) });
      if (res.ok) { form.reset(); btn.innerHTML = orig; btn.disabled = false; success.classList.add('show'); setTimeout(() => success.classList.remove('show'), 7000); }
      else throw new Error('error');
    } catch { btn.disabled = false; btn.innerHTML = '⚠️ Error — try again'; setTimeout(() => { btn.innerHTML = orig; }, 3500); }
  });
}

// ── TRANSLATIONS ─────────────────────────────────────────────
const T = {
  en: {
    'nav.results':'Results','nav.who':'For Who','nav.work':'Work','nav.packages':'Packages','nav.cta':'Get Clients Now',
    'urgency.text':'⚡ Only 3 client spots open this week — <strong>2 already taken</strong>',
    'hero.badge':'Guaranteed results or your money back',
    'hero.h1a':'I Build You a Page','hero.h1b':'That Gets You','hero.h1c':'Clients in','hero.h1d':'Less Than 7 Days.',
    'hero.sub':'No ads. No monthly fees. Just a professional website that converts visitors into paying customers — starting this week.',
    'hero.cta1':'I Want Clients Now','hero.cta2':'See Packages',
    'trust.projects':'Projects Delivered','trust.satisfaction':'Satisfaction Guaranteed','trust.days':'Avg. Delivery',
    'mock.t1':'+30 WhatsApp msgs/wk','mock.t2':'+15 bookings/week','mock.t3':'3x more visitors',
    'ba.overline':'The Reality','ba.h2':'Without a website<br><span>you\'re invisible.</span>',
    'ba.before':'❌ Right Now (Without a Website)','ba.after':'✅ After Working With Me',
    'ba.b1':'People Google you and find nothing','ba.b2':'You lose clients to competitors daily',
    'ba.b3':'You have to chase leads manually','ba.b4':'No credibility = no trust = no sale','ba.b5':'Your price looks lower than it is',
    'ba.a1':'Clients find YOU while you sleep','ba.a2':'WhatsApp messages coming in daily',
    'ba.a3':'Instant credibility & professional image','ba.a4':'You can charge what you\'re actually worth','ba.a5':'Your business works for you 24/7',
    'ba.btn':'Start Getting Clients — Free Quote',
    'proof.overline':'Real Results','proof.h2':'What happens when','proof.h2b':'businesses go online.',
    'pr1.result':'+15 bookings/week','pr1.biz':'Local Barbershop','pr1.desc':'"Before, people just walked past. Now they book online and mention the website. It paid for itself in week one."',
    'pr2.result':'+30 WhatsApp msgs/week','pr2.biz':'Mexican Restaurant','pr2.desc':'"We went from zero online presence to getting daily reservations through the site. Best investment we made."',
    'pr3.result':'3x more monthly visitors','pr3.biz':'Pet Shop','pr3.desc':'"Customers started finding us on Google for the first time. Our online sales now match our in-store sales."',
    'proof.best':'Most Common Result',
    'fw.overline':'Is This For You?','fw.h2':'I work with <span>the right people.</span>',
    'fw.yes.title':'✅ This is for you if...','fw.no.title':'❌ This is NOT for you if...',
    'fw.y1':'You run a local business or service','fw.y2':'You\'re a freelancer or entrepreneur',
    'fw.y3':'You want to sell online consistently','fw.y4':'You\'re serious about growing your income','fw.y5':'You value speed, results, and professionalism',
    'fw.n1':'You want a site "just to have one"','fw.n2':'You\'re not ready to invest in your business',
    'fw.n3':'You need 50 revisions for a $150 project','fw.n4':'You don\'t respond to messages or calls',
    'pf.overline':'Real Work, Real Results','pf.h2':'built & shipped','pf.sub':'Every project below is live. No templates, no shortcuts — built from scratch.',
    'pj.view':'View Live Site','pj.visit':'Visit site',
    'pj.restaurant':'Restaurant','pj.barber':'Barbershop','pj.landing':'Landing Page','pj.ecom':'E-commerce','pj.menu':'Digital Menu',
    'p1.desc':'Restaurant landing page — driving reservations and walk-ins since launch.',
    'p2.desc':'Bold barbershop site — walk-ins up, credibility established, WhatsApp bookings flowing.',
    'p3.desc':'High-conversion template — mobile-first, persuasive copy, built to convert.',
    'p4.desc':'Full e-commerce — product catalog and shopping experience for pet owners.',
    'p5.desc':'QR-ready digital menu — no printing costs, instant updates, premium experience.',
    'pj.cta.h3':'Your business<br>could be next.','pj.cta.p':'Every client here started with one message. Send yours now.','pj.cta.btn':'Get My Website',
    'pkg.overline':'Transparent Pricing','pkg.h2a':'Choose your','pkg.h2b':'growth level.',
    'pkg.sub':'No hidden fees. No surprises. Pay once, own it forever.',
    'pkg.from':'from','pkg.popular':'⭐ Best Results','pkg.bonus':'🎁 Bonus included:',
    'pkg.quote':'Quote on WhatsApp','pkg.talkwa':"Let's Talk on WhatsApp",
    'pk1.name':'Basic','pk1.tagline':'Your first step to being found online.','pk1.desc':'For freelancers and local services that need a professional online presence — fast.',
    'pk1.f1':'1 Landing Page','pk1.f2':'Mobile Responsive Design','pk1.f3':'WhatsApp CTA Button','pk1.f4':'Basic SEO Setup','pk1.f5':'Delivered in 3–5 days',
    'pk1.bonus':'WhatsApp Business Setup Guide',
    'pk2.name':'Standard','pk2.tagline':'More clients. More sales. More calls.','pk2.desc':'For businesses ready to be taken seriously online. This is what actually brings in clients.',
    'pk2.f1':'3–5 Sections Full Website','pk2.f2':'Conversion-Optimized Design','pk2.f3':'WhatsApp + Contact Form','pk2.f4':'Google-Ready SEO','pk2.f5':'Social Media Integration','pk2.f6':'Speed & Performance Optimized',
    'pk2.bonus':'Mini Sales Guide + Basic SEO Report',
    'pk3.name':'Premium','pk3.tagline':'A complete digital growth system.','pk3.desc':'Not just a website — a full strategy to dominate your market, built and executed for you.',
    'pk3.f1':'Everything in Standard','pk3.f2':'Conversion Rate Optimization','pk3.f3':'Professional Sales Copywriting','pk3.f4':'Competitor & Market Analysis','pk3.f5':'Lead Capture System','pk3.f6':'30-Day Priority Support',
    'pk3.bonus':'Digital Growth Strategy Session',
    'guarantee.title':'100% Satisfaction Guarantee','guarantee.desc':"If you don't love the initial design, I'll revise it until you do — or I'll refund you. Zero risk.",
    'extras.label':'Add-ons:','extras.domain':'🌐 Domain — $15–30/yr','extras.hosting':'🖥️ Hosting — $50–150/yr','extras.maint':'🔧 Maintenance — from $20/mo','extras.changes':'✏️ Extra Changes — $25–50/hr',
    'cta.h2a':'Every day without a website','cta.h2b':'you\'re losing clients.',
    'cta.p':'Your competitors are already online. Your future customers are already searching. Don\'t let them find someone else.',
    'cta.btn':'Quote on WhatsApp — It\'s Free','cta.email':'Send an Email Instead','cta.urgency':'⚡ Only 3 spots per week — don\'t wait.',
    'con.overline':"Let's Build Something",'con.h2a':'Ready to get','con.h2b':'more clients?',
    'con.p':'Send me a message. I respond in less than 24 hours with a plan — not a pitch.',
    'con.wa':'WhatsApp — Fastest Response','con.email':'Email',
    'form.name':'Your Name','form.email':'Email Address','form.business':'Business / Industry',
    'form.package':"I'm interested in...",'form.select':'Select a package',
    'form.o1':'Basic — $150–200 USD','form.o2':'Standard — $250–400 USD','form.o3':'Premium — $600–900 USD','form.o4':"Not sure — Let's talk",
    'form.message':'Tell me about your project','form.submit':'Send My Project Details',
    'form.note':'I reply within 24 hours. No spam, ever.','form.success':"Message sent! I'll be in touch within 24 hours.",
    'footer.copy':'© 2025 Damian Aguilera. All rights reserved.','footer.closing':'"If you\'re still without a website, you\'re losing clients every day."',
  },
  es: {
    'nav.results':'Resultados','nav.who':'¿Para quién?','nav.work':'Portafolio','nav.packages':'Paquetes','nav.cta':'Quiero Clientes Ya',
    'urgency.text':'⚡ Solo 3 espacios disponibles esta semana — <strong>2 ya tomados</strong>',
    'hero.badge':'Resultados garantizados o te devuelvo tu dinero',
    'hero.h1a':'Te hago una página','hero.h1b':'que te consigue','hero.h1c':'Clientes en','hero.h1d':'Menos de 7 Días.',
    'hero.sub':'Sin ads. Sin pagos mensuales. Solo un sitio profesional que convierte visitas en clientes — empezando esta semana.',
    'hero.cta1':'Quiero Clientes Ahora','hero.cta2':'Ver Paquetes',
    'trust.projects':'Proyectos Entregados','trust.satisfaction':'Satisfacción Garantizada','trust.days':'Entrega Promedio',
    'mock.t1':'+30 mensajes WhatsApp/sem','mock.t2':'+15 reservaciones/semana','mock.t3':'3x más visitantes',
    'ba.overline':'La Realidad','ba.h2':'Sin sitio web<br><span>eres invisible.</span>',
    'ba.before':'❌ Hoy (Sin Sitio Web)','ba.after':'✅ Después de Trabajar Conmigo',
    'ba.b1':'La gente te busca en Google y no te encuentra','ba.b2':'Pierdes clientes con la competencia cada día',
    'ba.b3':'Tienes que buscar clientes tú mismo','ba.b4':'Sin credibilidad = sin confianza = sin venta','ba.b5':'Tu precio parece más bajo de lo que es',
    'ba.a1':'Los clientes te encuentran mientras duermes','ba.a2':'Mensajes de WhatsApp llegando todos los días',
    'ba.a3':'Credibilidad e imagen profesional inmediata','ba.a4':'Puedes cobrar lo que realmente vales','ba.a5':'Tu negocio trabaja por ti las 24/7',
    'ba.btn':'Empezar a Conseguir Clientes — Cotización Gratis',
    'proof.overline':'Resultados Reales','proof.h2':'Lo que pasa cuando','proof.h2b':'los negocios entran en línea.',
    'pr1.result':'+15 reservaciones/semana','pr1.biz':'Barbería Local','pr1.desc':'"Antes la gente solo pasaba. Ahora reservan en línea y mencionan el sitio. Se pagó solo en la primera semana."',
    'pr2.result':'+30 mensajes WhatsApp/semana','pr2.biz':'Restaurante Mexicano','pr2.desc':'"Pasamos de cero presencia en línea a recibir reservaciones diarias por el sitio. La mejor inversión que hicimos."',
    'pr3.result':'3x más visitantes al mes','pr3.biz':'Pet Shop','pr3.desc':'"Los clientes empezaron a encontrarnos en Google por primera vez. Nuestras ventas en línea ahora igualan las presenciales."',
    'proof.best':'Resultado Más Común',
    'fw.overline':'¿Es Para Ti?','fw.h2':'Trabajo con <span>las personas correctas.</span>',
    'fw.yes.title':'✅ Esto es para ti si...','fw.no.title':'❌ Esto NO es para ti si...',
    'fw.y1':'Tienes un negocio local o servicio','fw.y2':'Eres freelancer o emprendedor',
    'fw.y3':'Quieres vender en línea de forma constante','fw.y4':'Estás serio en hacer crecer tus ingresos','fw.y5':'Valoras la velocidad, los resultados y el profesionalismo',
    'fw.n1':'Quieres una página "nada más para tenerla"','fw.n2':'No estás listo para invertir en tu negocio',
    'fw.n3':'Necesitas 50 revisiones para un proyecto de $150','fw.n4':'No contestas mensajes ni llamadas',
    'pf.overline':'Trabajo Real, Resultados Reales','pf.h2':'construidos y publicados','pf.sub':'Cada proyecto está en vivo. Sin templates, sin atajos — construido desde cero.',
    'pj.view':'Ver Sitio en Vivo','pj.visit':'Visitar sitio',
    'pj.restaurant':'Restaurante','pj.barber':'Barbería','pj.landing':'Landing Page','pj.ecom':'E-commerce','pj.menu':'Menú Digital',
    'p1.desc':'Landing page de restaurante — reservaciones y clientes desde el lanzamiento.',
    'p2.desc':'Sitio de barbería — más clientes, credibilidad establecida, reservas por WhatsApp.',
    'p3.desc':'Template de alta conversión — mobile-first, copy persuasivo, diseñado para convertir.',
    'p4.desc':'E-commerce completo — catálogo de productos y experiencia de compra para dueños de mascotas.',
    'p5.desc':'Menú digital listo para QR — sin costos de impresión, actualizaciones instantáneas.',
    'pj.cta.h3':'Tu negocio<br>podría ser el siguiente.','pj.cta.p':'Cada cliente aquí empezó con un mensaje. Envía el tuyo ahora.','pj.cta.btn':'Quiero Mi Sitio',
    'pkg.overline':'Precios Transparentes','pkg.h2a':'Elige tu','pkg.h2b':'nivel de crecimiento.',
    'pkg.sub':'Sin costos ocultos. Sin sorpresas. Pagas una vez, es tuyo para siempre.',
    'pkg.from':'desde','pkg.popular':'⭐ Mejores Resultados','pkg.bonus':'🎁 Bonus incluido:',
    'pkg.quote':'Cotizar en WhatsApp','pkg.talkwa':'Hablemos en WhatsApp',
    'pk1.name':'Básico','pk1.tagline':'Tu primer paso para ser encontrado en línea.','pk1.desc':'Para freelancers y servicios locales que necesitan presencia profesional en línea — rápido.',
    'pk1.f1':'1 Landing Page','pk1.f2':'Diseño Responsive','pk1.f3':'Botón CTA a WhatsApp','pk1.f4':'SEO Básico','pk1.f5':'Entrega en 3–5 días',
    'pk1.bonus':'Guía de Configuración WhatsApp Business',
    'pk2.name':'Estándar','pk2.tagline':'Más clientes. Más ventas. Más llamadas.','pk2.desc':'Para negocios listos para ser tomados en serio en línea. Esto es lo que realmente trae clientes.',
    'pk2.f1':'Sitio Completo 3–5 Secciones','pk2.f2':'Diseño Optimizado para Conversión','pk2.f3':'WhatsApp + Formulario de Contacto','pk2.f4':'SEO Listo para Google','pk2.f5':'Integración Redes Sociales','pk2.f6':'Optimización de Velocidad',
    'pk2.bonus':'Mini Guía de Ventas + Reporte SEO Básico',
    'pk3.name':'Premium','pk3.tagline':'Un sistema completo de crecimiento digital.','pk3.desc':'No solo un sitio web — una estrategia completa para dominar tu mercado, construida y ejecutada para ti.',
    'pk3.f1':'Todo lo del Estándar','pk3.f2':'Optimización de Tasa de Conversión','pk3.f3':'Copywriting de Ventas Profesional','pk3.f4':'Análisis de Competencia y Mercado','pk3.f5':'Sistema de Captura de Leads','pk3.f6':'Soporte Prioritario por 30 días',
    'pk3.bonus':'Sesión de Estrategia de Crecimiento Digital',
    'guarantee.title':'Garantía 100% Satisfacción','guarantee.desc':'Si no te encanta el diseño inicial, lo revisamos hasta que quede perfecto — o te devolvemos tu dinero. Cero riesgo.',
    'extras.label':'Add-ons:','extras.domain':'🌐 Dominio — $15–30/año','extras.hosting':'🖥️ Hosting — $50–150/año','extras.maint':'🔧 Mantenimiento — desde $20/mes','extras.changes':'✏️ Cambios extra — $25–50/hr',
    'cta.h2a':'Cada día sin sitio web','cta.h2b':'estás perdiendo clientes.',
    'cta.p':'Tu competencia ya está en línea. Tus futuros clientes ya están buscando. No dejes que encuentren a otro.',
    'cta.btn':'Cotizar en WhatsApp — Es Gratis','cta.email':'Enviar un Correo','cta.urgency':'⚡ Solo 3 espacios por semana — no esperes.',
    'con.overline':'Construyamos Algo','con.h2a':'¿Listo para conseguir','con.h2b':'más clientes?',
    'con.p':'Mándame un mensaje. Te respondo en menos de 24 horas con un plan — no un discurso de ventas.',
    'con.wa':'WhatsApp — Respuesta Más Rápida','con.email':'Correo Electrónico',
    'form.name':'Tu Nombre','form.email':'Correo Electrónico','form.business':'Negocio / Industria',
    'form.package':'Me interesa...','form.select':'Selecciona un paquete',
    'form.o1':'Básico — $150–200 USD','form.o2':'Estándar — $250–400 USD','form.o3':'Premium — $600–900 USD','form.o4':'No estoy seguro — Hablemos',
    'form.message':'Cuéntame sobre tu proyecto','form.submit':'Enviar Detalles del Proyecto',
    'form.note':'Respondo en menos de 24 hrs. Sin spam, nunca.','form.success':'¡Mensaje enviado! Me pongo en contacto en menos de 24 horas.',
    'footer.copy':'© 2025 Damian Aguilera. Todos los derechos reservados.','footer.closing':'"Si sigues sin página, estás perdiendo clientes todos los días."',
  }
};

const PLACEHOLDERS = {
  en: { fname:'John Smith', femail:'john@business.com', fbusiness:'e.g. HVAC company in Texas', fmessage:"What does your business do? What's your main goal?" },
  es: { fname:'Juan Pérez', femail:'juan@negocio.com',  fbusiness:'ej. Taller mecánico en Querétaro', fmessage:'¿A qué se dedica tu negocio? ¿Cuál es tu objetivo principal?' }
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
  Object.entries(ph).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.placeholder = val; });
  document.querySelectorAll('.lang-toggle__option').forEach(opt => opt.classList.toggle('lang-toggle__option--active', opt.dataset.lang === lang));
  document.documentElement.lang = lang;
  try { localStorage.setItem('da_lang', lang); } catch(e) {}
}

function initLang() {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => applyLang(currentLang === 'en' ? 'es' : 'en'));
  toggle.querySelectorAll('.lang-toggle__option').forEach(opt => opt.addEventListener('click', (e) => { e.stopPropagation(); applyLang(opt.dataset.lang); }));
  try { const s = localStorage.getItem('da_lang'); if (s === 'es' || s === 'en') applyLang(s); } catch(e) {}
}

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initNav();
  initMobileMenu();
  initCounters();
  initSmoothScroll();
  initForm();
  initLang();
});
