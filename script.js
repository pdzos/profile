/**
 * PIYUSH Profile Portfolio - Clean Modern Application Logic
 * Pure Vanilla JavaScript & Modern Architecture
 */

// ==========================================
// Fixed Content Data
// ==========================================
const PROFILE_DATA = {
  name: 'PIYUSH',
  handle: '@cyber_piyush',
  profession: 'Full-Stack Software Engineer & Audio Architect',
  location: 'Neo Tokyo / Remote Worldwide',
  bio: 'Passionate software developer building high-performance web applications, interactive audio synthesizers, and elegant digital experiences with clean architecture.',
  avatarUrl: 'assets/images/default-avatar.svg',
  coverUrl: 'assets/images/default-cover.svg'
};

const SKILLS_DATA = [
  { id: 's1', name: 'JavaScript (ES6+) & Modern Web APIs', pct: 98, cat: 'Frontend' },
  { id: 's2', name: 'Web Audio API & Synthesizers', pct: 94, cat: 'Audio' },
  { id: 's3', name: 'IndexedDB & Offline-First Storage', pct: 92, cat: 'Architecture' },
  { id: 's4', name: 'HTML5 Canvas & Spectrum Visualizers', pct: 90, cat: 'Frontend' },
  { id: 's5', name: 'Modern CSS3 & Glassmorphism UI', pct: 96, cat: 'Frontend' },
  { id: 's6', name: 'Android Kotlin & Python Backend', pct: 88, cat: 'Mobile & AI' }
];

const PROJECTS_DATA = [
  {
    id: 'p1',
    title: 'JARVIS Assistant (Android & PC)',
    desc: 'An intelligent digital companion built with Kotlin, Python, Google Gemini Live, and Vosk offline wake-word engine for low-latency voice interactions.',
    tags: 'Kotlin, Python, Gemini Live, Vosk Engine',
    demo: '#',
    github: 'https://github.com/pdzos',
    image: 'assets/images/default-cover.svg'
  },
  {
    id: 'p2',
    title: 'Interactive Audio Synthesizer',
    desc: 'Hardware-accelerated Web Audio frequency visualizer with real-time spectrum analysis, rotating vinyl artwork, and local audio file playback.',
    tags: 'Web Audio API, Canvas 2D, Pure Vanilla JS',
    demo: 'music.html',
    github: 'https://github.com/pdzos/profile',
    image: 'assets/images/default-album.svg'
  },
  {
    id: 'p3',
    title: 'Modern Developer Suite',
    desc: 'High-performance offline-first portfolio dashboard engineered with pure HTML5, CSS3, IndexedDB persistence, and zero third-party framework overhead.',
    tags: 'HTML5, CSS3, IndexedDB, LocalStorage',
    demo: 'index.html',
    github: 'https://github.com/pdzos/profile',
    image: 'assets/images/default-cover.svg'
  }
];

const GALLERY_DATA = [
  { id: 'g1', title: 'JARVIS Core Architecture', image: 'assets/images/default-cover.svg' },
  { id: 'g2', title: 'Web Audio Spectrum Studio', image: 'assets/images/default-album.svg' },
  { id: 'g3', title: 'Developer Workspace Interface', image: 'assets/images/default-avatar.svg' },
  { id: 'g4', title: 'Neural Flow Telemetry', image: 'assets/images/default-cover.svg' }
];

const SOCIALS_DATA = [
  { id: 'github', name: 'GitHub', url: 'https://github.com/pdzos', icon: '🐙' },
  { id: 'telegram', name: 'Telegram', url: 'https://telegram.org', icon: '✈' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', icon: '▶' },
  { id: 'instagram', name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
  { id: 'discord', name: 'Discord', url: 'https://discord.com', icon: '💬' },
  { id: 'x', name: 'X (Twitter)', url: 'https://x.com', icon: '✖' }
];

// ==========================================
// Application Core
// ==========================================
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.renderSkills();
    this.renderProjects();
    this.renderGallery();
    this.renderSocials();
    this.renderMusicSection();
    this.bindNavigation();
    this.bindMiniPlayer();
  }

  renderSkills() {
    const fullGrid = document.getElementById('full-skills-grid');
    const homePreview = document.getElementById('home-skills-preview');

    const html = SKILLS_DATA.map(s => `
      <div class="skill-card">
        <div class="skill-info">
          <span class="skill-name">${s.name}</span>
          <span class="skill-pct">${s.pct}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${s.pct}%;"></div>
        </div>
      </div>
    `).join('');

    if (fullGrid) fullGrid.innerHTML = html;
    if (homePreview) {
      homePreview.innerHTML = SKILLS_DATA.slice(0, 4).map(s => `
        <div class="skill-card">
          <div class="skill-info">
            <span class="skill-name">${s.name}</span>
            <span class="skill-pct">${s.pct}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" style="width: ${s.pct}%;"></div>
          </div>
        </div>
      `).join('');
    }
  }

  renderProjects() {
    const fullGrid = document.getElementById('full-projects-grid');
    const homePreview = document.getElementById('home-featured-projects');

    const createCard = (p) => `
      <div class="project-card">
        <img src="${p.image}" alt="${p.title}" class="project-thumb">
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">
            ${p.tags.split(',').map(tag => `<span class="project-tag">${tag.trim()}</span>`).join('')}
          </div>
          <div class="project-footer">
            ${p.demo && p.demo !== '#' ? `<a href="${p.demo}" class="btn btn-sm btn-primary">Live Demo</a>` : ''}
            ${p.github ? `<a href="${p.github}" target="_blank" class="btn btn-sm btn-secondary">Source Code</a>` : ''}
          </div>
        </div>
      </div>
    `;

    if (fullGrid) fullGrid.innerHTML = PROJECTS_DATA.map(createCard).join('');
    if (homePreview) homePreview.innerHTML = PROJECTS_DATA.slice(0, 2).map(createCard).join('');
  }

  renderGallery() {
    const grid = document.getElementById('full-gallery-grid');
    if (!grid) return;

    grid.innerHTML = GALLERY_DATA.map(g => `
      <div class="gallery-item" data-url="${g.image}">
        <img src="${g.image}" alt="${g.title}">
        <div class="gallery-caption-overlay">${g.title}</div>
      </div>
    `).join('');

    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img-element');
    const closeBtn = document.getElementById('lightbox-close-btn');

    grid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        if (lightbox && lightboxImg) {
          lightboxImg.src = url;
          lightbox.classList.add('active');
        }
      });
    });

    if (closeBtn && lightbox) {
      closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
      });
    }
  }

  renderSocials() {
    const fullGrid = document.getElementById('full-socials-grid');
    const homeList = document.getElementById('home-socials-list');

    const html = SOCIALS_DATA.map(s => `
      <a href="${s.url}" target="_blank" class="social-card">
        <div class="social-icon">${s.icon}</div>
        <div>
          <div style="font-weight:600; font-size:1.05rem;">${s.name}</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">${s.url.replace('https://', '')}</div>
        </div>
      </a>
    `).join('');

    if (fullGrid) fullGrid.innerHTML = html;
    if (homeList) {
      homeList.innerHTML = SOCIALS_DATA.slice(0, 3).map(s => `
        <a href="${s.url}" target="_blank" class="btn btn-sm btn-secondary" style="justify-content:flex-start; gap:0.8rem; width:100%;">
          <span>${s.icon}</span>
          <span>${s.name}</span>
        </a>
      `).join('');
    }
  }

  renderMusicSection() {
    const container = document.getElementById('section-music-playlist');
    if (!container || !window.cyberMusic) return;

    container.innerHTML = window.cyberMusic.playlist.map((track, idx) => `
      <div class="card" style="display:flex; align-items:center; justify-content:space-between; padding:0.9rem 1.2rem; cursor:pointer;" data-idx="${idx}">
        <div style="display:flex; align-items:center; gap:1rem;">
          <img src="${track.cover || 'assets/images/default-album.svg'}" alt="Cover" style="width:42px; height:42px; border-radius:6px; object-fit:cover;">
          <div>
            <div style="font-weight:600; font-size:0.95rem;">${track.title}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${track.artist}</div>
          </div>
        </div>
        <button class="btn btn-sm ${idx === window.cyberMusic.currentIndex && window.cyberMusic.isPlaying ? 'btn-primary' : 'btn-secondary'}">
          ${idx === window.cyberMusic.currentIndex && window.cyberMusic.isPlaying ? 'Playing' : 'Play'}
        </button>
      </div>
    `).join('');

    container.querySelectorAll('[data-idx]').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.getAttribute('data-idx'), 10);
        window.cyberMusic.loadTrack(idx, true);
        this.renderMusicSection();
      });
    });
  }

  // ==========================================
  // Navigation
  // ==========================================
  bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('.section-block');
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');

    const switchSection = (targetId) => {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === targetId);
      });
      sections.forEach(sec => {
        sec.classList.toggle('active', sec.id === `section-${targetId}`);
      });
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-section');
        if (target) switchSection(target);
      });
    });

    document.querySelectorAll('[data-navigate], [data-section-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-navigate') || btn.getAttribute('data-section-trigger');
        if (target) switchSection(target);
      });
    });

    if (menuToggle && mobileDrawer) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('open');
      });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.style.background = 'rgba(9, 13, 22, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      } else {
        navbar.style.background = 'rgba(9, 13, 22, 0.85)';
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // ==========================================
  // Mini Player Controls
  // ==========================================
  bindMiniPlayer() {
    if (!window.cyberMusic) return;

    const playBtn = document.getElementById('mini-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        window.cyberMusic.toggle();
        this.renderMusicSection();
      });
    }

    const prevBtn = document.getElementById('mini-prev-btn');
    const nextBtn = document.getElementById('mini-next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => window.cyberMusic.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => window.cyberMusic.next());

    const scrub = document.getElementById('mini-scrub');
    if (scrub) {
      scrub.addEventListener('input', (e) => {
        const dur = window.cyberMusic.audio.duration;
        if (dur) {
          const seekTo = (e.target.value / 100) * dur;
          window.cyberMusic.seek(seekTo);
        }
      });
    }

    const vol = document.getElementById('mini-volume');
    if (vol) {
      vol.value = window.cyberMusic.volume;
      vol.addEventListener('input', (e) => {
        window.cyberMusic.setVolume(parseFloat(e.target.value));
      });
    }

    const homePlayBtn = document.getElementById('home-play-toggle-btn');
    if (homePlayBtn) {
      homePlayBtn.addEventListener('click', () => {
        window.cyberMusic.toggle();
      });
    }
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});
