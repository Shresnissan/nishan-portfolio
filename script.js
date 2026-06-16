/* ═══════════════════════════════════════════════════════════════════
   NISHAN SHRESTHA — PORTFOLIO SCRIPT
   Enhanced with 3D tilt, magnetic buttons, orbs, active nav
   ═══════════════════════════════════════════════════════════════════ */

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Mobile menu ───────────────────────────────────────────────────────────────
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// ── Scroll progress bar ───────────────────────────────────────────────────────
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${(s / h) * 100}%`;
}, { passive: true });

// ── Theme toggle ──────────────────────────────────────────────────────────────
const themeBtn  = document.getElementById('themeBtn');
const root      = document.documentElement;
if (localStorage.getItem('theme') === 'light') root.classList.add('light');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}

// ── Experience accordion ──────────────────────────────────────────────────────
document.querySelectorAll('.exp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const isOpen = !target.classList.contains('hidden');
    target.classList.toggle('hidden', isOpen);
    target.classList.toggle('show', !isOpen);
    btn.dataset.open = String(!isOpen);
  });
});

// ── Project modal ─────────────────────────────────────────────────────────────
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

// ── Certification accordion ───────────────────────────────────────────────────
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

// ── Active nav highlight on scroll ────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── 3D Card Tilt ──────────────────────────────────────────────────────────────
function initTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.style.perspective = '800px';

    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = -dy * 6;   // degrees — keep subtle
      const tiltY  =  dx * 6;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      card.style.boxShadow = `
        ${-tiltY * 2}px ${tiltX * 2}px 40px rgba(0,0,0,0.35),
        0 0 30px rgba(16,185,129,${0.05 + Math.abs(dx) * 0.08})
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });
}
initTilt();

// ── Magnetic Buttons ──────────────────────────────────────────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.28;
      const dy   = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
initMagneticButtons();

// ── Hero floating orbs injection ──────────────────────────────────────────────
function injectOrbs() {
  const hero = document.querySelector('#home');
  if (!hero) return;
  hero.style.position = 'relative';
  hero.style.overflow = 'hidden';

  ['hero-orb-1', 'hero-orb-2'].forEach(cls => {
    const orb = document.createElement('div');
    orb.className = `hero-orb ${cls}`;
    hero.prepend(orb);
  });
}
injectOrbs();

// ── Typing effect on hero tagline ─────────────────────────────────────────────
function initTypingCursor() {
  // Find the ICT Business Analyst eyebrow line
  const eyebrow = document.querySelector('#home .text-emerald-400');
  if (!eyebrow) return;

  const words = ['ICT Business Analyst', 'Cloud Professional', 'IT Specialist', 'Problem Solver'];
  let wi = 0, ci = 0, deleting = false;

  eyebrow.textContent = '';
  const cursor = document.createElement('span');
  cursor.style.cssText = `
    display: inline-block; width: 2px; height: 0.9em;
    background: #34d399; margin-left: 3px;
    vertical-align: middle; border-radius: 1px;
    animation: blink 0.85s step-end infinite;
  `;
  // inject blink keyframes once
  if (!document.getElementById('blink-style')) {
    const s = document.createElement('style');
    s.id = 'blink-style';
    s.textContent = `@keyframes blink { 50% { opacity: 0; } }`;
    document.head.appendChild(s);
  }

  const suffix = ' • Cloud • IT Professional';
  let textNode = document.createTextNode('');
  eyebrow.appendChild(textNode);
  eyebrow.appendChild(cursor);

  function tick() {
    const word = words[wi];
    if (deleting) {
      ci--;
    } else {
      ci++;
    }

    textNode.nodeValue = word.slice(0, ci) + suffix;

    let delay = deleting ? 45 : 85;

    if (!deleting && ci === word.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }
  tick();
}
// Wait for fonts/layout
window.addEventListener('load', initTypingCursor);

// ── Stagger reveal groups ─────────────────────────────────────────────────────
// Add incremental delay to sibling .reveal elements inside grids
document.querySelectorAll('.grid, .space-y-6').forEach(container => {
  const children = [...container.querySelectorAll(':scope > .reveal')];
  children.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
});
