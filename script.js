document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSplitText();
  initTyping();
  initReveal();
  initMobileMenu();
  initScrollProgress();
  initThemeToggle();
  initActiveNav();
  initExperienceAccordion();
  initProjectModal();
  initCertAccordion();
  initTilt();
  initMagnetic();
  initCounters();
});

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initParticles() {
  if (prefersReducedMotion()) return;
  if (!document.body) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles = [];
  const COUNT = 72;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r = Math.random() * 1.6 + 0.4;
      this.sp = Math.random() * 0.32 + 0.08;
      this.op = Math.random() * 0.45 + 0.12;
      this.dx = (Math.random() - 0.5) * 0.28;
      this.hue = Math.random() > 0.72 ? 215 : 158;
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

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    const MAX = 115;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
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

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  })();
}

function initSplitText() {
  const h1 = document.querySelector('#home h1');
  if (!h1 || prefersReducedMotion()) return;

  const text = h1.textContent.trim();
  h1.textContent = '';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'hero-char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.3 + i * 0.03}s`;
    h1.appendChild(span);
  });
}

function initTyping() {
  const eyebrow = document.querySelector('#home .text-emerald-400');
  if (!eyebrow || prefersReducedMotion()) return;

  const roles = ['ICT Business Analyst', 'Cloud Professional'];
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.style.cssText = 'display:inline-block;width:2px;height:0.85em;background:#34d399;margin-left:3px;vertical-align:middle;border-radius:1px;animation:blink 0.9s step-end infinite;';

  if (!document.getElementById('blink-kf')) {
    const s = document.createElement('style');
    s.id = 'blink-kf';
    s.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(s);
  }

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
    if (!deleting && ci === word.length) { delay = 2000; deleting = true; }
    if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % roles.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }

  setTimeout(tick, 750);
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (prefersReducedMotion()) {
    els.forEach(el => el.classList.add('show'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  els.forEach(el => obs.observe(el));
}

function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

function initScrollProgress() {
  const progress = document.getElementById('scrollProgress');
  if (!progress) return;

  const update = () => {
    const s = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = h > 0 ? `${(s / h) * 100}%` : '0%';
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

function initThemeToggle() {
  const themeBtn = document.getElementById('themeBtn');
  const root = document.documentElement;
  if (localStorage.getItem('theme') === 'light') root.classList.add('light');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
}

function initExperienceAccordion() {
  document.querySelectorAll('.exp-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const opening = target.classList.contains('hidden');
      target.classList.toggle('hidden', !opening);
      target.classList.toggle('show', opening);
      btn.setAttribute('aria-expanded', String(opening));
    });
  });
}

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const img = document.getElementById('modalImg');
  const title = document.getElementById('modalTitle');
  const text = document.getElementById('modalText');
  const link = document.getElementById('modalLink');

  if (!modal || !img || !title || !text || !link) return;

  document.querySelectorAll('.project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      img.src = btn.dataset.img || '';
      img.alt = btn.dataset.title || 'Project preview';
      img.style.display = btn.dataset.img ? 'block' : 'none';
      title.textContent = btn.dataset.title || '';
      text.textContent = btn.dataset.text || '';
      link.href = btn.dataset.link || '#';
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function initCertAccordion() {
  document.querySelectorAll('.cert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('.cert-chevron');
      if (!panel) return;

      const isOpen = !panel.classList.contains('hidden');

      document.querySelectorAll('.cert-content').forEach(p => {
        if (p !== panel) {
          p.classList.add('hidden');
          p.classList.remove('show');
        }
      });

      document.querySelectorAll('.cert-chevron').forEach(ic => {
        if (ic !== icon) ic.classList.remove('rotate-180');
      });

      panel.classList.toggle('hidden', isOpen);
      panel.classList.toggle('show', !isOpen);
      if (icon) icon.classList.toggle('rotate-180', !isOpen);
    });
  });
}

function initTilt() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      card.style.transform = `perspective(900px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

function initMagnetic() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * .28}px, ${(e.clientY - (r.top + r.height / 2)) * .28}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

function initCounters() {
  const els = document.querySelectorAll('.metric-number');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const match = el.textContent.trim().match(/^(\d+)(.*)/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2] || '';
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

  els.forEach(el => obs.observe(el));
}
