/* ==============================================
   ERI — 2026 Premium Interactions
   Canvas particles, kinetic typography, GSAP scroll
   ============================================== */

// ---- Supabase ----
const SUPABASE_URL = 'https://oliaowomacdkwgmbdnhb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OlLcofeNEZpeyv57dJWkAg_zMsRcHte';
let supabase = null;
function initSupabase() {
  if (window.supabase && SUPABASE_KEY !== 'YOUR_ANON_KEY_HERE') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
}
async function saveSignup(table, data) {
  if (supabase) {
    const { error } = await supabase.from(table).insert([data]);
    if (error) console.warn('Supabase error, saving locally:', error);
    else return;
  }
  const key = 'eri_' + table;
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  data.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  data.created_at = new Date().toISOString();
  list.push(data);
  localStorage.setItem(key, JSON.stringify(list));
}

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  const dismissPreloader = () => {
    if (preloader) preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initHeroAnimations();
  };
  window.addEventListener('load', () => setTimeout(dismissPreloader, 600));
  setTimeout(dismissPreloader, 3000);

  // ---- Canvas Particle System ----
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], mouse = { x: -1000, y: -1000 };

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.violet = Math.random() > 0.55;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          this.x -= dx / dist * force;
          this.y -= dy / dist * force;
        }
        if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.violet) {
          ctx.fillStyle = `rgba(255,0,110,${this.opacity * 0.55})`;
        } else {
          ctx.fillStyle = `rgba(198,168,78,${this.opacity * 0.5})`;
        }
        ctx.fill();
      }
    }

    const count = Math.min(Math.floor(w * h / 7000), 140);
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const opacity = (1 - dist / 90) * 0.07;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,0,110,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ---- Cursor handled via CSS gold arrow ----

  // ---- Navbar ----
  const nav = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 50);
    let cur = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 160) cur = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });
  navLinks.forEach(l => l.addEventListener('click', () => {
    toggle.classList.remove('active');
    menu.classList.remove('open');
  }));

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
  });

  // ---- Scroll Progress ----
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    if (bar) bar.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
  }, { passive: true });

  // ---- Back to Top ----
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', scrollY > 600);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Rotating 3D wireframe globe ----
  function initGlobe() {
    const gc = document.getElementById('globeCanvas');
    if (!gc || window.innerWidth < 960) return;
    const SIZE = 560;
    gc.width = SIZE; gc.height = SIZE;
    const ctx = gc.getContext('2d');
    const cx = SIZE / 2, cy = SIZE / 2, R = 210;
    let rotY = 0;
    const TILT = 0.22;
    let mRX = 0, mRY = 0, tMRX = 0, tMRY = 0;

    document.addEventListener('mousemove', e => {
      tMRX = (e.clientY / window.innerHeight - 0.5) * 0.3;
      tMRY = (e.clientX / window.innerWidth - 0.5) * 0.2;
    }, { passive: true });

    function proj(x, y, z) {
      const cY = Math.cos(rotY + mRY), sY = Math.sin(rotY + mRY);
      const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
      const cX = Math.cos(TILT + mRX), sX = Math.sin(TILT + mRX);
      return { x: x1, y: y * cX - z1 * sX, z: y * sX + z1 * cX };
    }

    const S = 90, lats = [-75,-60,-45,-30,-15,0,15,30,45,60,75].map(d => d*Math.PI/180);
    const lons = Array.from({length:12},(_,i)=>i*30*Math.PI/180);
    const DOTS = [[.6,1.2],[-.3,.5],[.2,2.8],[-.5,4.2],[.4,5.5],[-.1,3.3],[.7,.9],[-.6,2.],[.3,4.7],[-.4,1.8],[.5,3.6],[-.2,.2]];

    function drawLats() {
      lats.forEach(lat => {
        const yr = R*Math.sin(lat), r = R*Math.cos(lat);
        ctx.beginPath();
        for (let i=0;i<=S;i++) { const th=(i/S)*Math.PI*2, p=proj(r*Math.cos(th),yr,r*Math.sin(th)); i===0?ctx.moveTo(cx+p.x,cy+p.y):ctx.lineTo(cx+p.x,cy+p.y); }
        ctx.strokeStyle='rgba(198,168,78,0.08)'; ctx.lineWidth=.6; ctx.stroke();
      });
    }
    function drawLons() {
      lons.forEach(lon => {
        ctx.beginPath();
        for (let i=0;i<=S;i++) { const phi=(i/S)*Math.PI-Math.PI/2, p=proj(R*Math.cos(phi)*Math.cos(lon),R*Math.sin(phi),R*Math.cos(phi)*Math.sin(lon)); i===0?ctx.moveTo(cx+p.x,cy+p.y):ctx.lineTo(cx+p.x,cy+p.y); }
        ctx.strokeStyle='rgba(124,58,237,0.1)'; ctx.lineWidth=.6; ctx.stroke();
      });
    }
    function drawEquator() {
      ctx.beginPath();
      for (let i=0;i<=S*2;i++) { const th=(i/(S*2))*Math.PI*2, p=proj(R*Math.cos(th),0,R*Math.sin(th)); i===0?ctx.moveTo(cx+p.x,cy+p.y):ctx.lineTo(cx+p.x,cy+p.y); }
      ctx.strokeStyle='rgba(198,168,78,0.18)'; ctx.lineWidth=1.4; ctx.stroke();
    }
    function drawDots() {
      DOTS.forEach(([phi,theta]) => {
        const p = proj(R*Math.cos(phi)*Math.cos(theta),R*Math.sin(phi),R*Math.cos(phi)*Math.sin(theta));
        if (p.z < 15) {
          const b = Math.max(0, 1-(p.z+R)/(2*R));
          ctx.beginPath(); ctx.arc(cx+p.x,cy+p.y,2.5,0,Math.PI*2);
          ctx.fillStyle=`rgba(198,168,78,${.5+b*.5})`; ctx.fill();
          ctx.beginPath(); ctx.arc(cx+p.x,cy+p.y,6,0,Math.PI*2);
          ctx.fillStyle=`rgba(198,168,78,${.06+b*.06})`; ctx.fill();
        }
      });
    }
    function drawGlow() {
      const g = ctx.createRadialGradient(cx,cy,R*.8,cx,cy,R*1.15);
      g.addColorStop(0,'rgba(124,58,237,0)');
      g.addColorStop(.6,'rgba(124,58,237,0.055)');
      g.addColorStop(1,'rgba(124,58,237,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R*1.15,0,Math.PI*2); ctx.fill();
    }

    (function render() {
      ctx.clearRect(0,0,SIZE,SIZE);
      mRX += (tMRX-mRX)*.03; mRY += (tMRY-mRY)*.03;
      drawGlow(); drawLons(); drawLats(); drawEquator(); drawDots();
      rotY += .004;
      requestAnimationFrame(render);
    })();

    setTimeout(() => { gc.style.opacity = '1'; }, 900);
  }

  // ---- GSAP Animations ----
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // === HERO PARALLAX — multiple layers at different speeds ===
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.fromTo(heroContent,
        { y: 0, opacity: 1 },
        { y: 140, opacity: 0, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } }
      );
    }
    const orbV = document.querySelector('.hero-orb--violet');
    const orbG = document.querySelector('.hero-orb--gold');
    if (orbV) gsap.to(orbV, { y: -260, x: 60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2.5 } });
    if (orbG) gsap.to(orbG, { y: -160, x: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });

    // === SECTION HEADERS — text clip-path wipe reveal ===
    document.querySelectorAll('[data-animate="header"]').forEach(el => {
      const tag   = el.querySelector('.section-tag');
      const title = el.querySelector('.section-title');
      const rule  = el.querySelector('.section-rule');
      const desc  = el.querySelector('.section-desc');

      if (tag)   gsap.set(tag,   { opacity: 0, x: -28 });
      if (title) gsap.set(title, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });
      if (rule)  gsap.set(rule,  { scaleX: 0, transformOrigin: 'left', opacity: 1 });
      if (desc)  gsap.set(desc,  { opacity: 0, y: 18 });

      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' } });
      if (tag)   tl.to(tag,   { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' });
      if (title) tl.to(title, { clipPath: 'inset(0 0% 0 0)', duration: 1.05, ease: 'power4.inOut' }, '-=0.3');
      if (rule)  tl.to(rule,  { scaleX: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5');
      if (desc)  tl.to(desc,  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    });

    // === STATS COUNTER — numbers count up from zero ===
    document.querySelectorAll('.stat-block').forEach((block, i) => {
      const numEl = block.querySelector('.stat-num');
      if (!numEl) return;
      const rawText   = numEl.textContent.trim();
      const match     = rawText.match(/\d+/);
      if (!match) return;
      const targetNum = parseInt(match[0]);
      const emEl      = numEl.querySelector('em');
      const preText   = rawText.slice(0, rawText.indexOf(match[0]));
      const postNoEm  = rawText.slice(rawText.indexOf(match[0]) + match[0].length).replace(emEl ? emEl.textContent : '', '');

      gsap.set(block, { opacity: 0, y: 50, scale: 0.85 });
      ScrollTrigger.create({
        trigger: block, start: 'top 87%',
        onEnter: () => {
          gsap.to(block, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)', delay: i * 0.1 });
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetNum, duration: 2.2, ease: 'power2.out', delay: i * 0.1 + 0.15,
            onUpdate() {
              const v = Math.round(obj.val);
              if (emEl) numEl.childNodes[0].textContent = preText + v;
              else numEl.textContent = preText + v + postNoEm;
            },
            onComplete() { if (!emEl) numEl.textContent = rawText; }
          });
        }
      });
    });

    // === BENTO / STORY CARDS — fly in from alternating positions with rotation ===
    const flyDirs = [
      { x: -160, y: 0,   r: -9 },
      { x:    0, y: 100, r:  0 },
      { x:  160, y: 0,   r:  9 },
      { x: -110, y: 60,  r: -5 },
      { x:  110, y: 60,  r:  5 },
      { x:    0, y: -80, r:  0 }
    ];
    document.querySelectorAll('[data-animate="card"]').forEach((el, i) => {
      const d = flyDirs[i % flyDirs.length];
      gsap.set(el, { x: d.x, y: d.y + 60, opacity: 0, rotation: d.r, scale: 0.8 });
      ScrollTrigger.create({
        trigger: el, start: 'top 90%',
        onEnter: () => gsap.to(el, { x: 0, y: 0, opacity: 1, rotation: 0, scale: 1, duration: 1.15, ease: 'power4.out', delay: (i % 3) * 0.1 })
      });
    });

    // === PULL QUOTE — bottom-up wipe ===
    const pq = document.querySelector('.pull-quote');
    if (pq) {
      gsap.set(pq, { clipPath: 'inset(0 0 100% 0)', opacity: 1 });
      const bq   = pq.querySelector('blockquote');
      const cite = pq.querySelector('cite');
      if (bq)   gsap.set(bq,   { opacity: 0, y: 32 });
      if (cite) gsap.set(cite, { opacity: 0 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: pq, start: 'top 82%' } });
      tl.to(pq, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out' });
      if (bq)   tl.to(bq,   { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.55');
      if (cite) tl.to(cite, { opacity: 1, duration: 0.6 }, '-=0.3');
    }

    // === STATS STRIP reveal ===
    const ss = document.querySelector('.stats-strip');
    if (ss) {
      gsap.set(ss, { opacity: 0 });
      ScrollTrigger.create({ trigger: ss, start: 'top 88%', onEnter: () => gsap.to(ss, { opacity: 1, duration: 0.3 }) });
    }

    // === FADE elements ===
    document.querySelectorAll('[data-animate="fade"]').forEach(el => {
      if (el.classList.contains('pull-quote') || el.classList.contains('stats-strip') || el.classList.contains('resource-hero')) return;
      gsap.fromTo(el, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // === EVENTS CARDS — deep slide-up with scale ===
    document.querySelectorAll('[data-animate="slide-up"]').forEach((el, i) => {
      gsap.set(el, { y: 110, opacity: 0, scale: 0.92 });
      ScrollTrigger.create({
        trigger: el, start: 'top 88%',
        onEnter: () => gsap.to(el, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power4.out', delay: i * 0.13 })
      });
    });

    // === SLIDE-LEFT elements ===
    document.querySelectorAll('[data-animate="slide-left"]').forEach((el, i) => {
      gsap.fromTo(el, { x: 110, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1.05, ease: 'power4.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // === TEAM CARDS — spring in with slight rotation ===
    document.querySelectorAll('.team-card').forEach((el, i) => {
      gsap.set(el, { y: 90, opacity: 0, scale: 0.82, rotation: i % 2 === 0 ? -5 : 5 });
      ScrollTrigger.create({
        trigger: el, start: 'top 88%',
        onEnter: () => gsap.to(el, { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.6)', delay: i * 0.15 })
      });
    });

    // === BLOG CARDS — 3D perspective flip ===
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) gsap.set(blogGrid, { perspective: 1000 });
    document.querySelectorAll('.blog-card').forEach((el, i) => {
      gsap.set(el, { y: 90, opacity: 0, rotateX: 25, transformOrigin: 'top center' });
      ScrollTrigger.create({
        trigger: el, start: 'top 88%',
        onEnter: () => gsap.to(el, { y: 0, opacity: 1, rotateX: 0, duration: 1.1, ease: 'power4.out', delay: i * 0.15 })
      });
    });

    // === COMPETITION TIMELINE — draws itself line by line ===
    const compTimeline = document.querySelector('.comp-timeline');
    if (compTimeline) {
      const dots     = compTimeline.querySelectorAll('.comp-tl-dot');
      const lines    = compTimeline.querySelectorAll('.comp-tl-line');
      const contents = compTimeline.querySelectorAll('.comp-tl-content');
      gsap.set(lines,    { scaleY: 0, transformOrigin: 'top' });
      gsap.set(dots,     { scale: 0 });
      gsap.set(contents, { opacity: 0, x: -24 });
      ScrollTrigger.create({
        trigger: compTimeline, start: 'top 75%',
        onEnter: () => {
          dots.forEach((d, i) => gsap.to(d, { scale: 1, backgroundColor: '#C6A84E', borderColor: '#C6A84E', boxShadow: '0 0 24px rgba(198,168,78,0.45)', duration: 0.55, delay: i * 0.42, ease: 'back.out(1.7)' }));
          lines.forEach((l, i) => gsap.to(l, { scaleY: 1, backgroundColor: 'rgba(198,168,78,0.3)', duration: 0.5, delay: i * 0.42 + 0.25, ease: 'power3.out' }));
          contents.forEach((t, i) => gsap.to(t, { opacity: 1, x: 0, duration: 0.65, delay: i * 0.42 + 0.12, ease: 'power3.out' }));
        }
      });
    }

    // === JOIN CTA ===
    const jc = document.querySelector('.join-cta');
    if (jc) {
      gsap.set(jc, { y: 60, opacity: 0, scale: 0.96 });
      ScrollTrigger.create({ trigger: jc, start: 'top 85%', onEnter: () => gsap.to(jc, { y: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'power4.out' }) });
    }

    // === RESOURCE HERO — scale reveal ===
    const rh = document.querySelector('.resource-hero');
    if (rh) {
      gsap.set(rh, { scale: 0.9, opacity: 0 });
      ScrollTrigger.create({ trigger: rh, start: 'top 80%', onEnter: () => gsap.to(rh, { scale: 1, opacity: 1, duration: 1.2, ease: 'power4.out' }) });
    }
  }

  // ---- Hero — words scatter then assemble ----
  function initHeroAnimations() {
    const words   = document.querySelectorAll('.hero-word');
    const sub     = document.getElementById('heroSub');
    const actions = document.getElementById('heroActions');
    const scroll  = document.querySelector('.hero-scroll');

    if (typeof gsap !== 'undefined') {
      // Split each hero-word into individual .hero-char spans
      const chars = [];
      words.forEach(word => {
        const text = word.textContent;
        word.innerHTML = '';
        word.setAttribute('aria-label', text);
        [...text].forEach(ch => {
          const span = document.createElement('span');
          span.className = 'hero-char';
          span.textContent = ch;
          word.appendChild(span);
          chars.push(span);
        });
      });

      chars.forEach(c => {
        gsap.set(c, {
          opacity: 0,
          y: gsap.utils.random(-70, 70),
          x: gsap.utils.random(-25, 25),
          rotateX: gsap.utils.random(-110, 110),
          rotateY: gsap.utils.random(-35, 35),
          scale: 0.25,
          transformOrigin: '50% 50% -12px'
        });
      });

      if (sub)     gsap.set(sub,     { opacity: 0, y: 36 });
      if (actions) gsap.set(actions, { opacity: 0, y: 24 });
      if (scroll)  gsap.set(scroll,  { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.15 });

      chars.forEach((c, i) => {
        tl.to(c, {
          opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, scale: 1,
          duration: 0.65, ease: 'back.out(2.4)'
        }, 0.05 + i * 0.022);
      });

      if (sub)     tl.to(sub,     { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
      if (actions) tl.to(actions, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
      if (scroll)  tl.to(scroll,  { opacity: 1, duration: 0.9 }, '-=0.3');

    } else {
      [sub, actions, scroll].filter(Boolean).forEach(el => {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      words.forEach(w => { w.style.opacity = '1'; w.style.transform = 'none'; });
    }

    initGSAP();
  }

  // ---- Card Tilt — GSAP 3D with elastic spring ----
  if (matchMedia('(pointer:fine)').matches && typeof gsap !== 'undefined') {
    document.querySelectorAll('.bento-card, .event-card, .team-card, .blog-card, .comp-info-card').forEach(c => {
      c.style.willChange = 'transform';
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(c, {
          rotationX: y * -14, rotationY: x * 14,
          y: -12, scale: 1.03,
          duration: 0.35, ease: 'power2.out',
          transformPerspective: 900, overwrite: true
        });
      });
      c.addEventListener('mouseleave', () => {
        gsap.to(c, {
          rotationX: 0, rotationY: 0, y: 0, scale: 1,
          duration: 1.1, ease: 'elastic.out(1, 0.5)', overwrite: true
        });
      });
    });
  }

  // ---- Magnetic Buttons — GSAP elastic snap-back ----
  if (matchMedia('(pointer:fine)').matches && typeof gsap !== 'undefined') {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(btn, { x: x * 0.42, y: y * 0.42, duration: 0.3, ease: 'power2.out', overwrite: true });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1.2, 0.4)', overwrite: true });
      });
    });
  }

  // ---- Tutoring Form ----
  const tForm = document.getElementById('bookingForm');
  if (tForm) {
    tForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = tForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...'; btn.disabled = true; btn.style.opacity = '.7';

      await saveSignup('tutoring_signups', {
        name:    document.getElementById('tutorName').value,
        email:   document.getElementById('tutorEmail').value,
        subject: document.getElementById('tutorSubject').value,
        message: document.getElementById('tutorMsg').value,
      });

      btn.textContent = 'Request Sent!';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      btn.style.color = '#fff'; btn.style.opacity = '1';
      setTimeout(() => {
        btn.textContent = 'Request a Session';
        btn.style.background = ''; btn.style.color = '';
        btn.disabled = false; tForm.reset();
      }, 2500);
    });
  }
});
