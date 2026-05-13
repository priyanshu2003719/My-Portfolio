/* ========================================
   PRIYANSHU SAHOO — PORTFOLIO SCRIPT
   ======================================== */

/* ── HERO CANVAS PARTICLE ANIMATION ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset()); });
})();

/* ── TYPEWRITER EFFECT ── */
(function () {
  const roles = [
    'Aspiring Data Analyst',
    'Python Developer',
    'AI & ML Engineer',
    'Web Developer'
  ];
  const el = document.getElementById('typewriter');
  if (!el) return;
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    if (deleting) {
      el.textContent = current.substring(0, ci--);
      if (ci < 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 500); return; }
      setTimeout(type, 50);
    } else {
      el.textContent = current.substring(0, ci++);
      if (ci > current.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 85);
    }
  }
  setTimeout(type, 800);
})();

/* ── NAVBAR SCROLL + ACTIVE HIGHLIGHT ── */
const navbar = document.getElementById('navbar');
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // sticky style
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);

  // back-to-top
  const btn = document.getElementById('backTop');
  if (btn) btn.classList.toggle('visible', scrollY > 400);

  // active nav
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    a.style.color = href === '#' + current ? 'var(--cyan)' : '';
  });
});

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

if (hamburger && navLinksEl) {
  hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  // close on link click
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

/* ── DARK / LIGHT TOGGLE ── */
let isLight = false;
const darkBtn = document.getElementById('darkToggle');
if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    isLight = !isLight;
    document.body.classList.toggle('light', isLight);
    darkBtn.innerHTML = isLight
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
  });
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── BACK TO TOP ── */
const backTop = document.getElementById('backTop');
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── PROJECT FILTER TABS ── */
const projTabs  = document.querySelectorAll('.proj-tab');

projTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    projTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      }
    });
  });
});

/* ── ADD PROJECT MODAL ── */
const addProjBtn  = document.getElementById('addProjBtn');
const addProjModal= document.getElementById('addProjModal');
const modalClose  = document.getElementById('modalClose');
const submitProj  = document.getElementById('submitProj');
const projectGrid = document.getElementById('projectGrid');

const catLabels = {
  powerbi: 'Power BI', data: 'Data Analysis', database: 'Database',
  web: 'Web Dev', python: 'Python', other: 'Other'
};

/* Build a card DOM element from a saved project data object */
function buildProjectCard(proj) {
  let techHtml = '';
  if (proj.tech) {
    techHtml = '<div class="proj-tech">' +
      proj.tech.split(',').map(t => `<span>${t.trim()}</span>`).join('') +
      '</div>';
  }

  let datasetHtml = '';
  if (proj.dataset) {
    datasetHtml = `<div class="proj-datasets"><span class="ds-label">Dataset:</span>`;
    if (proj.dsLink) {
      datasetHtml += `<a href="${proj.dsLink}" target="_blank">${proj.dataset}</a>`;
    } else {
      datasetHtml += `<span>${proj.dataset}</span>`;
    }
    datasetHtml += `</div>`;
  }

  let toolHtml = proj.tool
    ? `<span class="exp-tool"><i class="fas fa-code"></i> ${proj.tool}</span>`
    : '';

  let linkHtml = '';
  if (proj.link) {
    const isGH = proj.link.includes('github.com');
    linkHtml = `<a href="${proj.link}" target="_blank" class="btn btn-sm mt">
      <i class="${isGH ? 'fab fa-github' : 'fas fa-external-link-alt'}"></i>
      ${isGH ? 'GitHub' : 'View'}
    </a>`;
  }

  const card = document.createElement('div');
  card.className = 'proj-card';
  card.dataset.cat = proj.cat;
  card.innerHTML = `
    <div class="proj-cat-badge">${catLabels[proj.cat] || 'Other'}</div>
    <h3>${proj.name}</h3>
    <p>${proj.desc}</p>
    ${datasetHtml}
    ${techHtml}
    <div class="proj-links">
      ${toolHtml}
      ${linkHtml}
    </div>`;
  return card;
}

/* Apply the currently-active filter to every card in the grid */
function applyActiveFilter() {
  const activeTab = document.querySelector('.proj-tab.active');
  const filter = activeTab ? activeTab.dataset.filter : 'all';
  document.querySelectorAll('.proj-card').forEach(c => {
    const show = filter === 'all' || c.dataset.cat === filter;
    c.style.display = show ? '' : 'none';
  });
}

/* Load saved projects from localStorage and render them on page load */
function loadSavedProjects() {
  const saved = JSON.parse(localStorage.getItem('userProjects') || '[]');
  saved.forEach(proj => {
    const card = buildProjectCard(proj);
    projectGrid.appendChild(card);
  });
  applyActiveFilter();
}

if (projectGrid) loadSavedProjects();

if (addProjBtn && addProjModal) {
  addProjBtn.addEventListener('click', () => addProjModal.classList.add('open'));
  modalClose.addEventListener('click', () => addProjModal.classList.remove('open'));
  addProjModal.addEventListener('click', (e) => {
    if (e.target === addProjModal) addProjModal.classList.remove('open');
  });
}

if (submitProj) {
  submitProj.addEventListener('click', () => {
    const name    = document.getElementById('newProjName').value.trim();
    const cat     = document.getElementById('newProjCat').value;
    const desc    = document.getElementById('newProjDesc').value.trim();
    const dataset = document.getElementById('newProjDataset').value.trim();
    const dsLink  = document.getElementById('newProjDatasetLink').value.trim();
    const link    = document.getElementById('newProjLink').value.trim();
    const tool    = document.getElementById('newProjTool').value.trim();
    const tech    = document.getElementById('newProjTech').value.trim();

    if (!name || !desc) { alert('Please fill in Project Name and Description.'); return; }

    const proj = { name, cat, desc, dataset, dsLink, link, tool, tech };

    /* Save to localStorage so it survives page refresh */
    const saved = JSON.parse(localStorage.getItem('userProjects') || '[]');
    saved.push(proj);
    localStorage.setItem('userProjects', JSON.stringify(saved));

    /* Build and append the card */
    const card = buildProjectCard(proj);
    card.style.animation = 'fadeInUp 0.5s ease forwards';
    projectGrid.appendChild(card);

    /* Reset form fields */
    ['newProjName','newProjDesc','newProjDataset','newProjDatasetLink',
     'newProjLink','newProjTool','newProjTech'].forEach(id => {
      document.getElementById(id).value = '';
    });
    addProjModal.classList.remove('open');

    /* Apply the current filter — hides the new card if it doesn't belong */
    applyActiveFilter();
  });
}

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = contactForm.querySelector('input[type=text]').value.trim();
    const email = contactForm.querySelector('input[type=email]').value.trim();
    const msg   = contactForm.querySelector('textarea').value.trim();
    if (!name || !email || !msg) { alert('Please fill in all fields.'); return; }
    const mailto = `mailto:sahoopriyanshu889@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nFrom: ' + email)}`;
    window.location.href = mailto;
  });
}

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});