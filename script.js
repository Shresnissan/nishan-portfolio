/* ═══════════════════════════════════════════════════════════════════
   NISHAN SHRESTHA — PORTFOLIO  |  script.js
   ═══════════════════════════════════════════════════════════════════ */

/* ── 1. CUSTOM CURSOR ─────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.createElement('div');  dot.id  = 'cursor-dot';
  const ring = document.createElement('div'); ring.id = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // ring lags behind with lerp
  (function lerpRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  // grow ring on hoverable elements
  const hoverTargets = 'a, button, .card, .tag, .cert-btn, .exp-btn, .icon-btn, .btn-primary, .btn-secondary, .cert-view-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovered');
  });
})();


/* ── 2. PARTICLE CANVAS ───────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 70;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r  = Math.random() * 1.5 + 0.4;
      this.sp = Math.random() * 0.35 + 0.1;
      this.op = Math.random() * 0.5 + 0.15;
      this.dx = (Math.random() - 0.5) * 0.3;
      // colour: mostly teal, some blue
      this.hue = Math.random() > 0.75 ? 210 : 158;
    }
    update() {
      this.y -= this.sp;
      this.x += this.dx;
      if (this.y < -5) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 78%, 60%, ${this.op})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // draw connecting lines between close particles
  function drawLines() {
    const MAX_DIST = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
          ctx.lineWidth   = 0.6;
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


/* ── 3. HERO SPLIT-TEXT ANIMATION ─────────────────────────────────── */
(function initSplitText() {
  const h1 = document.querySelector('#home h1');
  if (!h1) return;

  const text = h1.textContent;
  h1.textContent = '';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.classList.add('hero-char');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.35 + i * 0.032}s`;
    h1.appendChild(span);
  });
})();


/* ── 4. TYPING EFFECT — eyebrow label ─────────────────────────────── */
(function initTyping() {
  const eyebrow = document.querySelector('#home .text-emerald-400');
  if (!eyebrow) return;

  const roles = [
    'ICT Business Analyst',
    'Cloud Professional',
    'IT Problem Solver',
    'Process Automator',
    'Tech-Business Bridge'
  ];

  // inject blink keyframe once
  if (!document.getElementById('blink-kf')) {
    const s = document.createElement('style');
    s.id = 'blink-kf';
    s.textContent = `@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`;
    document.head.appendChild(s);
  }

  const cursor = document.createElement('span');
  cursor.style.cssText =
    'display:inline-block;width:2px;height:0.85em;background:#34d399;' +
    'margin-left:3px;vertical-align:middle;border-radius:1px;' +
    'animation:blink 0.9s step-end infinite;';

  const suffix  = ' • Cloud • IT Professional';
  let textNode  = document.createTextNode('');
  eyebrow.textContent = '';
  eyebrow.append(textNode, cursor);

  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[wi];
    ci = deleting ? ci - 1 : ci + 1;
    textNode.nodeValue = word.slice(0, ci) + suffix;

    let delay = deleting ? 40 : 75;
    if (!deleting && ci === word.length)  { delay = 2000; deleting = true; }
    if (deleting  && ci === 0)            { deleting = false; wi = (wi + 1) % roles.length; delay = 350; }
    setTimeout(tick, delay);
  }
  // start after hero chars finish animating
  setTimeout(tick, 800);
})();


/* ── 5. SCROLL REVEAL ─────────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); revealObs.unobserve(e.target); } });
}, { threshold: 0.10 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// stagger siblings inside grids
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


/* ── 9. ACTIVE NAV ON SCROLL ──────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
      );
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => activeObs.observe(s));


/* ── 10. EXPERIENCE ACCORDION ────────────────────────────────────── */
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
    modalImg.src            = btn.dataset.img;
    modalImg.alt            = btn.dataset.title;
    modalImg.style.display  = 'block';
    modalTitle.textContent  = btn.dataset.title;
    modalText.textContent   = btn.dataset.text;
    modalLink.href          = btn.dataset.link;
    modalLink.textContent   = 'Open PDF';
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


/* ── 12. CERTIFICATION ACCORDION ────────────────────────────────── */
document.querySelectorAll('.cert-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const icon   = btn.querySelector('.cert-chevron');
    if (!target) return;
    target.classList.toggle('hidden');
    target.classList.toggle('show');
    if (icon) icon.classList.toggle('rotate-180');
  });
});


/* ── 13. 3D CARD TILT ────────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = -dy * 7;
      const tiltY =  dx * 7;

      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
      card.style.boxShadow = `
        ${-tiltY * 2.5}px ${tiltX * 2.5}px 50px rgba(0,0,0,0.40),
        0 0 0 1px rgba(16,185,129,${0.08 + Math.abs(dx) * 0.12}),
        0 0 30px rgba(16,185,129,${0.04 + Math.abs(dx) * 0.06})
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.55s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      // remove inline transition after it settles
      setTimeout(() => { card.style.transition = ''; }, 560);
    });
  });
})();


/* ── 14. MAGNETIC BUTTONS ─────────────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.30;
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.30;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ── 15. COUNTER ANIMATION on metric numbers ─────────────────────── */
(function initCounters() {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      // parse leading number, keep trailing chars (e.g. "3+" → 3, "+")
      const match = raw.match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2] || '';
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 35);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.metric-number').forEach(el => counterObs.observe(el));
})();
