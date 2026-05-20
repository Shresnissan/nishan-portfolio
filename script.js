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
