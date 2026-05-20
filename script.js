const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${(s / h) * 100}%`;
});

const themeBtn = document.getElementById('themeBtn');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') root.classList.add('light');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}

// Experience accordion toggle
document.querySelectorAll('.exp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.classList.toggle('hidden');
    target.classList.toggle('show');
  });
});

// ── Project modal ────────────────────────────────────────────────────────────
const modal        = document.getElementById('projectModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose   = document.getElementById('modalClose');
const modalImg     = document.getElementById('modalImg');
const modalTitle   = document.getElementById('modalTitle');
const modalText    = document.getElementById('modalText');
const modalLink    = document.getElementById('modalLink');

document.querySelectorAll('.project-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modalImg.src       = btn.dataset.img;
    modalImg.alt       = btn.dataset.title;
    modalImg.style.display = 'block';
    modalTitle.textContent = btn.dataset.title;
    modalText.textContent  = btn.dataset.text;
    modalLink.href         = btn.dataset.link;
    modalLink.textContent  = 'Open PDF';
    modalLink.style.display = 'inline-flex';
    modal.classList.remove('hidden');
  });
});

function closeModal() {
  modal.classList.add('hidden');
}

if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
if (modalClose)    modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ── Certification accordion toggle ───────────────────────────────────────────
document.querySelectorAll('.cert-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const icon   = btn.querySelector('.cert-chevron');

    target.classList.toggle('hidden');
    target.classList.toggle('show');
    if (icon) icon.classList.toggle('rotate-180');
  });
  
});// ── ADD THESE LINES TO THE BOTTOM OF script.js ──

document.querySelectorAll('.cert-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target  = document.getElementById(btn.dataset.target);
    const chevron = btn.querySelector('.cert-chevron');

    const isOpen = !target.classList.contains('hidden');

    if (isOpen) {
      target.classList.add('hidden');
      target.classList.remove('show');
      chevron.classList.remove('open');
    } else {
      target.classList.remove('hidden');
      target.classList.add('show');
      chevron.classList.add('open');
    }
  });
});
