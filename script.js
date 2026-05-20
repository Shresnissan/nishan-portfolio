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

document.querySelectorAll('.exp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.classList.toggle('hidden');
    target.classList.toggle('show');
  });
});

const modal = document.getElementById('projectModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalLink = document.getElementById('modalLink');

document.querySelectorAll('.project-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modalImg.src = btn.dataset.img;
    modalImg.alt = btn.dataset.title;
    modalTitle.textContent = btn.dataset.title;
    modalText.textContent = btn.dataset.text;
    modalLink.href = btn.dataset.link;
    modal.classList.remove('hidden');
  });
});

function closeModal() {
  modal.classList.add('hidden');
}

if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
if (modalClose) modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
