/* ═══════════════════════════════════════════════════════════════════
   NISHAN SHRESTHA — PORTFOLIO  |  script.js


/* ── 2. PARTICLE CANVAS — fixed, behind everything, scrolls with page ── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  // Critical: fixed position so it stays visible while scrolling
  canvas.style.cssText = [
    'position:fixed',
    'inset:0',
    'width:100%',
    'height:100%',
    'z-index:0',
    'pointer-events:none',
    'opacity:0.55',
  ].join(';');
  // Insert as FIRST child of body so everything else layers on top
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 72;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r  = Math.random() * 1.6 + 0.4;
      this.sp = Math.random() * 0.32 + 0.08;
      this.op = Math.random() * 0.45 + 0.12;
      this.dx = (Math.random() - 0.5) * 0.28;
      this.hue = Math.random() > 0.72 ? 215 : 158; // blue or teal
    }
    update() {
      this.y -= this.sp;
      this.x += this.dx;
      if (this.y < -6) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},75%,62%,${this.op})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    const MAX = 115;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(52,211,153,${(1 - d / MAX) * 0.17})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ── 3. HERO SPLIT-TEXT ───────────────────────────────────────────── */
(function initSplitText() {
  const h1 = document.querySelector('#home h1');
  if (!h1) return;
  const text = h1.textContent;
  h1.textContent = '';
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.classList.add('hero-char');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.3 + i * 0.030}s`;
    h1.appendChild(span);
  });
})();


/* ── 4. TYPING EFFECT ─────────────────────────────────────────────── */
(function initTyping() {
  const eyebrow = document.querySelector('#home .text-emerald-400');
  if (!eyebrow) return;
  const roles = ['ICT Business Analyst','Cloud Professional'];
  if (!document.getElementById('blink-kf')) {
    const s = document.createElement('style'); s.id = 'blink-kf';
    s.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(s);
  }
  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:2px;height:0.85em;background:#34d399;margin-left:3px;vertical-align:middle;border-radius:1px;animation:blink 0.9s step-end infinite;';
  const suffix = ' • Cloud • IT Professional';
  const textNode = document.createTextNode('');
  eyebrow.textContent = '';
  eyebrow.append(textNode, cursor);
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = roles[wi];
    ci = deleting ? ci - 1 : ci + 1;
    textNode.nodeValue = word.slice(0, ci) + suffix;
    let delay = deleting ? 40 : 72;
    if (!deleting && ci === word.length)  { delay = 2000; deleting = true; }
    if (deleting  && ci === 0)            { deleting = false; wi = (wi + 1) % roles.length; delay = 350; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 750);
})();


/* ── 5. SCROLL REVEAL ─────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); revealObs.unobserve(e.target); } });
}, { threshold: 0.10 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// stagger siblings
document.querySelectorAll('.grid, .space-y-6').forEach(container => {
  [...container.querySelectorAll(':scope > .reveal')].forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.09}s`;
  });
});


/* ── 6. MOBILE MENU ───────────────────────────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'))
  );
}


/* ── 7. SCROLL PROGRESS BAR ───────────────────────────────────────── */
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${(s / h) * 100}%`;
}, { passive: true });


/* ── 8. THEME TOGGLE ──────────────────────────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
const root     = document.documentElement;
if (localStorage.getItem('theme') === 'light') root.classList.add('light');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}


/* ── 9. ACTIVE NAV ────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting)
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.35 });
sections.forEach(s => activeObs.observe(s));


/* ── 10. EXPERIENCE ACCORDION ─────────────────────────────────────── */
document.querySelectorAll('.exp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const opening = target.classList.contains('hidden');
    target.classList.toggle('hidden', !opening);
    target.classList.toggle('show',    opening);
    btn.dataset.open = String(opening);
  });
});


/* ── 11. PROJECT MODAL ────────────────────────────────────────────── */
const modal         = document.getElementById('projectModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose    = document.getElementById('modalClose');
const modalImg      = document.getElementById('modalImg');
const modalTitle    = document.getElementById('modalTitle');
const modalText     = document.getElementById('modalText');
const modalLink     = document.getElementById('modalLink');

document.querySelectorAll('.project-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!modal) return;
    modalImg.src = btn.dataset.img; modalImg.alt = btn.dataset.title;
    modalImg.style.display = 'block';
    modalTitle.textContent = btn.dataset.title;
    modalText.textContent  = btn.dataset.text;
    modalLink.href         = btn.dataset.link;
    modalLink.textContent  = 'Open PDF';
    modalLink.style.display = 'inline-flex';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
if (modalClose)    modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ── 12. CERTIFICATION ACCORDION — fixed ID matching ─────────────── */
// Each cert-btn now uses data-target matching the ACTUAL id of its sibling panel.
// The HTML cert section should use this pattern:
//   <button class="cert-btn" data-target="cert-panel-N">
//   <div id="cert-panel-N" class="cert-content hidden">
// The JS below is ID-agnostic — it just reads data-target and toggles that element.
document.querySelectorAll('.cert-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const panel    = document.getElementById(targetId);
    const icon     = btn.querySelector('.cert-chevron');
    if (!panel) {
      console.warn('[Cert accordion] No element found with id:', targetId);
      return;
    }
    const isOpen = !panel.classList.contains('hidden');
    // Close all other panels first (accordion behaviour)
    document.querySelectorAll('.cert-content').forEach(p => {
      if (p !== panel) {
        p.classList.add('hidden');
        p.classList.remove('show');
      }
    });
    document.querySelectorAll('.cert-chevron').forEach(ic => {
      if (ic !== icon) ic.classList.remove('rotate-180');
    });
    // Toggle this panel
    panel.classList.toggle('hidden', isOpen);
    panel.classList.toggle('show',  !isOpen);
    if (icon) icon.classList.toggle('rotate-180', !isOpen);
  });
});


/* ── 13. 3D CARD TILT ─────────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const dx    = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy    = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
      card.style.transform  = `perspective(900px) rotateX(${-dy*7}deg) rotateY(${dx*7}deg) translateZ(6px)`;
      card.style.boxShadow  = `${-dx*8}px ${dy*8}px 50px rgba(0,0,0,.40), 0 0 0 1px rgba(16,185,129,${.07+Math.abs(dx)*.10}), 0 0 28px rgba(16,185,129,${.04+Math.abs(dx)*.05})`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1),box-shadow .55s ease';
      card.style.transform = card.style.boxShadow = '';
      setTimeout(() => { card.style.transition = ''; }, 560);
    });
  });
})();


/* ── 14. MAGNETIC BUTTONS ─────────────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*.28}px,${(e.clientY-(r.top+r.height/2))*.28}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();


/* ── 15. COUNTER ANIMATION ────────────────────────────────────────── */
(function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const match = el.textContent.trim().match(/^(\d+)(.*)/);
      if (!match) return;
      const target = parseInt(match[1], 10), suffix = match[2] || '';
      let cur = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(timer);
      }, 35);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.metric-number').forEach(el => obs.observe(el));
})();
