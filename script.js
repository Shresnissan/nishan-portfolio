/* ═══════════════════════════════════════════════════════════════════
   NISHAN SHRESTHA — script.js
   ═══════════════════════════════════════════════════════════════════ */

/* ── 1. PARTICLE CANVAS ────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  `;
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const isLight = () => document.documentElement.classList.contains('light');

  const PARTICLE_COUNT = 120;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x    = Math.random() * canvas.width;
      this.y    = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r    = Math.random() * 3.5 + 1.8;    // 1.8–5.3px — clearly visible
      this.sp   = Math.random() * 0.55 + 0.18;  // steady upward drift
      this.op   = Math.random() * 0.35 + 0.60;  // 0.60–0.95 — strong
      this.dx   = (Math.random() - 0.5) * 0.45;
      this.hue  = Math.random() > 0.68 ? 210 : 158; // teal or blue
      this.glow = Math.random() > 0.45; // ~55% get a glow ring
    }
    update() {
      this.y -= this.sp;
      this.x += this.dx;
      if (this.y < -8) this.reset(false);
    }
    draw() {
      const light = isLight();
      // Dark mode: bright teal/blue. Light mode: deep saturated tones on white.
      const l   = light ? 32 : 65;
      const sat = light ? 92 : 82;
      const op  = light ? this.op * 0.90 : this.op;

      // Glow halo
      if (this.glow) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, ${sat}%, ${l}%, ${op * 0.22})`;
        ctx.fill();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${sat}%, ${l}%, ${op})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawLines() {
    const MAX_DIST = 150;
    const light = isLight();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const ddx = particles[i].x - particles[j].x;
        const ddy = particles[i].y - particles[j].y;
        const d   = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * (light ? 0.55 : 0.40);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = light
            ? `rgba(5,120,85,${alpha})`
            : `rgba(52,211,153,${alpha})`;
          ctx.lineWidth = light ? 1.1 : 0.9;
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


/* ── 2. HERO SPLIT-TEXT — animates each WORD, keeps name on one line ── */
(function initSplitText() {
  const h1 = document.querySelector('#home h1');
  if (!h1) return;

  if (!document.getElementById('char-kf')) {
    const s = document.createElement('style');
    s.id = 'char-kf';
    s.textContent = `
      .hero-word {
        display: inline-block;
        opacity: 0;
        transform: translateY(32px);
        animation: wordReveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
      }
      @keyframes wordReveal {
        to { opacity:1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(s);
  }

  // Split by word, preserve spaces between them
  const words = h1.textContent.trim().split(/\s+/);
  h1.textContent = '';
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'hero-word';
    span.textContent = word;
    span.style.animationDelay = `${0.2 + i * 0.15}s`;
    h1.appendChild(span);
    // add a real space text node between words
    if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
  });
})();


/* ── 3. EYEBROW — static text matching your actual role/certs ──────── */
(function initEyebrow() {
  const eyebrow = document.querySelector('#home .text-emerald-400');
  if (!eyebrow) return;
  // Reflects actual portfolio & certs — BA core, IT-leaning
  eyebrow.textContent = 'ICT Business Analyst  •  Cloud & IT Infrastructure  •  Google & IBM Certified';
})();


/* ── 4. SCROLL REVEAL ─────────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// stagger siblings inside grids / stacked lists
document.querySelectorAll('.grid, .space-y-6, .space-y-4').forEach(container => {
  [...container.querySelectorAll(':scope > .reveal')].forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
});


/* ── 5. MOBILE MENU ───────────────────────────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'))
  );
}


/* ── 6. SCROLL PROGRESS ───────────────────────────────────────────── */
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${(s / h) * 100}%`;
}, { passive: true });


/* ── 7. THEME TOGGLE ──────────────────────────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
const root     = document.documentElement;
if (localStorage.getItem('theme') === 'light') root.classList.add('light');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}


/* ── 8. ACTIVE NAV ────────────────────────────────────────────────── */
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
}, { threshold: 0.30 });
sections.forEach(s => activeObs.observe(s));


/* ── 9. EXPERIENCE ACCORDION ─────────────────────────────────────── */
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


/* ── 10. PROJECT MODAL ────────────────────────────────────────────── */
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


/* ── 11. CERTIFICATION ACCORDION — FIXED ─────────────────────────── */
/*
  The HTML has mismatched data-target / id pairs on cert buttons.
  We fix this by pairing each .cert-btn directly with the very next
  sibling div that holds the content, ignoring the broken id lookup.
*/
document.querySelectorAll('.cert-btn').forEach(btn => {
  // The content panel is always the next sibling element of the button
  const panel = btn.nextElementSibling;
  const icon  = btn.querySelector('.cert-chevron');

  if (!panel) return;

  // Make sure panel starts hidden
  panel.classList.add('hidden');
  panel.classList.remove('show');

  btn.addEventListener('click', () => {
    const isOpen = !panel.classList.contains('hidden');

    // Close all other panels first (accordion behaviour)
    document.querySelectorAll('.cert-btn').forEach(otherBtn => {
      const otherPanel = otherBtn.nextElementSibling;
      const otherIcon  = otherBtn.querySelector('.cert-chevron');
      if (otherPanel && otherPanel !== panel) {
        otherPanel.classList.add('hidden');
        otherPanel.classList.remove('show');
        if (otherIcon) otherIcon.classList.remove('rotate-180');
      }
    });

    // Toggle this panel
    panel.classList.toggle('hidden', isOpen);
    panel.classList.toggle('show',  !isOpen);
    if (icon) icon.classList.toggle('rotate-180', !isOpen);
  });
});


/* ── 12. 3D CARD TILT ────────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const dx    = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy    = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
      const tiltX = -dy * 6;
      const tiltY =  dx * 6;
      card.style.transform  = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
      card.style.boxShadow  = `
        ${-tiltY * 2}px ${tiltX * 2}px 48px rgba(0,0,0,0.40),
        0 0 0 1px rgba(16,185,129,${0.07 + Math.abs(dx) * 0.12}),
        0 0 28px rgba(16,185,129,${0.03 + Math.abs(dx) * 0.05})
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.55s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      setTimeout(() => { card.style.transition = ''; }, 560);
    });
  });
})();


/* ── 13. MAGNETIC BUTTONS ─────────────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.28;
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();


/* ── 14. COUNTER ANIMATION ────────────────────────────────────────── */
(function initCounters() {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const raw   = el.textContent.trim();
      const match = raw.match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2] || '';
      let current  = 0;
      const step   = Math.ceil(target / 38);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 36);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.metric-number').forEach(el => counterObs.observe(el));
})();
