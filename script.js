/**
 * Neon Cyber Profile - Main Application Logic
 * Pure Vanilla JavaScript & LocalStorage / IndexedDB Integration
 */

// ==========================================
// Default State Data
// ==========================================
const DEFAULT_PROFILE = {
  name: 'Alex Vance',
  handle: '@cyber_alex',
  profession: 'Cyber Systems Architect',
  location: 'Neo Tokyo / Sector 7',
  bio: 'Building next-generation holographic interfaces and web audio systems. Cyberpunk enthusiast & full-stack architect.',
  avatarUrl: 'assets/images/default-avatar.svg',
  coverUrl: 'assets/images/default-cover.svg'
};

const DEFAULT_SKILLS = [
  { id: 's1', name: 'Vanilla JavaScript (ES6+)', pct: 98, cat: 'Frontend' },
  { id: 's2', name: 'Web Audio API & Synthesizers', pct: 92, cat: 'Cyber' },
  { id: 's3', name: 'IndexedDB & Offline Engines', pct: 90, cat: 'Backend' },
  { id: 's4', name: 'HTML5 Canvas & Visualizers', pct: 88, cat: 'Frontend' },
  { id: 's5', name: 'CSS3 Neon Glassmorphism', pct: 96, cat: 'Frontend' },
  { id: 's6', name: 'Cyberpunk Security Protocols', pct: 84, cat: 'Cyber' }
];

const DEFAULT_PROJECTS = [
  {
    id: 'p1',
    title: 'Neon Matrix Audio Visualizer',
    desc: 'Hardware-accelerated Web Audio spectrum visualizer with real-time frequency analysis and holographic vinyl rotation.',
    tags: 'Vanilla JS, Web Audio API, Canvas 2D',
    demo: 'music.html',
    github: 'https://github.com',
    image: 'assets/images/default-cover.svg'
  },
  {
    id: 'p2',
    title: 'Cyberpunk OS Dashboard',
    desc: 'Offline-first personal dashboard with zero-backend IndexedDB persistence and scanline CRT overlays.',
    tags: 'HTML5, CSS Grid, LocalStorage, IndexedDB',
    demo: '#',
    github: 'https://github.com',
    image: 'assets/images/default-album.svg'
  },
  {
    id: 'p3',
    title: 'Quantum Crypt Node HUD',
    desc: 'Futuristic telemetry interface with glowing reactive charts, dynamic HUD gauges and sound synthesizer feedback.',
    tags: 'JavaScript, CSS Animations, SVG HUD',
    demo: '#',
    github: 'https://github.com',
    image: 'assets/images/default-cover.svg'
  }
];

const DEFAULT_SOCIALS = [
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', icon: '▶' },
  { id: 'instagram', name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
  { id: 'telegram', name: 'Telegram', url: 'https://telegram.org', icon: '✈' },
  { id: 'github', name: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { id: 'discord', name: 'Discord', url: 'https://discord.com', icon: '💬' },
  { id: 'x', name: 'X (Twitter)', url: 'https://x.com', icon: '✖' }
];

// ==========================================
// Application Core
// ==========================================
class CyberApp {
  constructor() {
    this.profile = this.loadData('neon_profile', DEFAULT_PROFILE);
    this.skills = this.loadData('neon_skills', DEFAULT_SKILLS);
    this.projects = this.loadData('neon_projects', DEFAULT_PROJECTS);
    this.socials = this.loadData('neon_socials', DEFAULT_SOCIALS);
    this.theme = localStorage.getItem('neon_theme') || 'cyan';
    this.scanlines = localStorage.getItem('neon_scanlines') !== 'false';
    this.animations = localStorage.getItem('neon_animations') !== 'false';

    this.init();
  }

  loadData(key, fallback) {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch (e) {
      return fallback;
    }
  }

  saveData(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  async init() {
    this.applyTheme(this.theme);
    this.applyPreferences();
    await this.loadCustomAssets();
    this.renderAll();
    this.bindNavigation();
    this.bindModals();
    this.bindForms();
    this.bindMiniPlayer();
    this.bindSettings();
  }

  // Load custom avatar and cover images stored in IndexedDB
  async loadCustomAssets() {
    if (!window.cyberDB) return;
    try {
      const avatarBlob = await window.cyberDB.getAsset('custom_avatar');
      if (avatarBlob) {
        this.profile.avatarUrl = URL.createObjectURL(avatarBlob);
      }
      const coverBlob = await window.cyberDB.getAsset('custom_cover');
      if (coverBlob) {
        this.profile.coverUrl = URL.createObjectURL(coverBlob);
      }
    } catch (err) {
      console.warn('Custom assets load notice:', err);
    }
  }

  // ==========================================
  // Render Systems
  // ==========================================
  renderAll() {
    this.renderProfile();
    this.renderStats();
    this.renderSkills();
    this.renderProjects();
    this.renderGallery();
    this.renderSocials();
    this.renderMusicSection();
  }

  renderProfile() {
    // Hero profile elements
    const heroName = document.getElementById('hero-name');
    const heroHandle = document.getElementById('hero-handle');
    const heroBio = document.getElementById('hero-bio');
    const heroAvatar = document.getElementById('hero-avatar');
    const heroCover = document.getElementById('hero-cover');

    if (heroName) heroName.textContent = this.profile.name;
    if (heroHandle) heroHandle.textContent = this.profile.handle;
    if (heroBio) heroBio.textContent = this.profile.bio;
    if (heroAvatar) heroAvatar.src = this.profile.avatarUrl;
    if (heroCover) heroCover.src = this.profile.coverUrl;

    // Sidebar quick user info
    const sideName = document.getElementById('sidebar-name');
    const sideHandle = document.getElementById('sidebar-handle');
    const sideAvatar = document.getElementById('sidebar-avatar');

    if (sideName) sideName.textContent = this.profile.name;
    if (sideHandle) sideHandle.textContent = this.profile.handle;
    if (sideAvatar) sideAvatar.src = this.profile.avatarUrl;

    // Profile page details
    const pName = document.getElementById('profile-view-name');
    const pHandle = document.getElementById('profile-view-handle');
    const pProf = document.getElementById('profile-view-profession');
    const pLoc = document.getElementById('profile-view-location');
    const pBio = document.getElementById('profile-view-bio');

    if (pName) pName.textContent = this.profile.name;
    if (pHandle) pHandle.textContent = this.profile.handle;
    if (pProf) pProf.textContent = this.profile.profession;
    if (pLoc) pLoc.textContent = this.profile.location;
    if (pBio) pBio.textContent = this.profile.bio;
  }

  renderStats() {
    const statProj = document.getElementById('stat-projects-count');
    const statSkills = document.getElementById('stat-skills-count');
    const statMusic = document.getElementById('stat-music-count');

    if (statProj) statProj.textContent = this.projects.length;
    if (statSkills) statSkills.textContent = this.skills.length;
    if (statMusic && window.cyberMusic) statMusic.textContent = window.cyberMusic.playlist.length;

    // Update nav badges
    const bSkills = document.getElementById('nav-skills-badge');
    const bProj = document.getElementById('nav-projects-badge');
    if (bSkills) bSkills.textContent = this.skills.length;
    if (bProj) bProj.textContent = this.projects.length;
  }

  renderSkills() {
    const fullGrid = document.getElementById('full-skills-grid');
    const homePreview = document.getElementById('home-skills-preview');

    const createSkillHTML = (s, isFull = false) => `
      <div class="cyber-card skill-card">
        <div class="skill-header">
          <div class="skill-info-left">
            <div class="skill-icon-box">⚡</div>
            <div class="skill-name">${s.name}</div>
          </div>
          <div class="skill-pct">${s.pct}%</div>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${s.pct}%;"></div>
        </div>
        ${isFull ? `
          <div class="skill-card-actions">
            <button class="cyber-btn btn-sm btn-ghost edit-skill-btn" data-id="${s.id}">EDIT</button>
            <button class="cyber-btn btn-sm btn-pink del-skill-btn" data-id="${s.id}">DELETE</button>
          </div>
        ` : ''}
      </div>
    `;

    if (fullGrid) {
      fullGrid.innerHTML = this.skills.map(s => createSkillHTML(s, true)).join('');
      // Bind Edit & Delete buttons
      fullGrid.querySelectorAll('.edit-skill-btn').forEach(btn => {
        btn.addEventListener('click', () => this.openEditSkill(btn.getAttribute('data-id')));
      });
      fullGrid.querySelectorAll('.del-skill-btn').forEach(btn => {
        btn.addEventListener('click', () => this.deleteSkill(btn.getAttribute('data-id')));
      });
    }

    if (homePreview) {
      homePreview.innerHTML = this.skills.slice(0, 4).map(s => createSkillHTML(s, false)).join('');
    }
  }

  renderProjects() {
    const fullGrid = document.getElementById('full-projects-grid');
    const homePreview = document.getElementById('home-featured-projects');

    const createProjectHTML = (p, isFull = false) => `
      <div class="cyber-card project-card">
        <div class="project-thumb-wrap">
          <img src="${p.image || 'assets/images/default-cover.svg'}" alt="${p.title}" class="project-thumb-img">
        </div>
        <div class="project-body">
          <h3 class="project-title text-gradient">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">
            ${(p.tags || '').split(',').map(tag => `<span class="project-tag">${tag.trim()}</span>`).join('')}
          </div>
          <div class="project-footer">
            <div class="project-links">
              ${p.demo ? `<a href="${p.demo}" class="cyber-btn btn-sm" target="_blank">DEMO</a>` : ''}
              ${p.github ? `<a href="${p.github}" class="cyber-btn btn-sm btn-ghost" target="_blank">CODE</a>` : ''}
            </div>
            ${isFull ? `
              <div style="display:flex; gap:6px;">
                <button class="cyber-btn btn-sm btn-ghost edit-proj-btn" data-id="${p.id}">EDIT</button>
                <button class="cyber-btn btn-sm btn-pink del-proj-btn" data-id="${p.id}">DEL</button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    if (fullGrid) {
      fullGrid.innerHTML = this.projects.map(p => createProjectHTML(p, true)).join('');
      fullGrid.querySelectorAll('.edit-proj-btn').forEach(btn => {
        btn.addEventListener('click', () => this.openEditProject(btn.getAttribute('data-id')));
      });
      fullGrid.querySelectorAll('.del-proj-btn').forEach(btn => {
        btn.addEventListener('click', () => this.deleteProject(btn.getAttribute('data-id')));
      });
    }

    if (homePreview) {
      homePreview.innerHTML = this.projects.slice(0, 2).map(p => createProjectHTML(p, false)).join('');
    }
  }

  async renderGallery() {
    const grid = document.getElementById('full-gallery-grid');
    const badge = document.getElementById('nav-gallery-badge');
    const stat = document.getElementById('stat-gallery-count');
    if (!grid || !window.cyberDB) return;

    try {
      const photos = await window.cyberDB.getAllGalleryImages();
      if (badge) badge.textContent = photos.length;
      if (stat) stat.textContent = photos.length;

      if (photos.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding: 40px; color: var(--text-muted);">
            <p>No holographic photos uploaded yet.</p>
            <p style="font-size:0.85rem; margin-top:8px;">Click "UPLOAD PHOTO" to store high-res images directly in IndexedDB.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = photos.map(photo => {
        const url = URL.createObjectURL(photo.blob);
        return `
          <div class="gallery-item" data-url="${url}" data-title="${photo.title}">
            <img src="${url}" alt="${photo.title}">
            <button class="gallery-delete-btn" data-id="${photo.id}" title="Delete Photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
            <div class="gallery-overlay">
              <span class="gallery-caption">${photo.title}</span>
            </div>
          </div>
        `;
      }).join('');

      // Bind Gallery Click for Lightbox & Delete
      grid.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.gallery-delete-btn')) {
            e.stopPropagation();
            const id = e.target.closest('.gallery-delete-btn').getAttribute('data-id');
            if (confirm('Delete this photo from IndexedDB?')) {
              this.deleteGalleryPhoto(id);
            }
            return;
          }
          const url = item.getAttribute('data-url');
          const title = item.getAttribute('data-title');
          this.openLightbox(url, title);
        });
      });
    } catch (e) {
      console.error('Gallery render error:', e);
    }
  }

  renderSocials() {
    const fullGrid = document.getElementById('full-socials-grid');
    const homeList = document.getElementById('home-socials-list');

    const html = this.socials.map(s => `
      <a href="${s.url}" target="_blank" class="cyber-card social-card">
        <div class="social-icon">${s.icon}</div>
        <div class="social-meta">
          <div class="social-name">${s.name}</div>
          <div class="social-url">${s.url}</div>
        </div>
      </a>
    `).join('');

    if (fullGrid) fullGrid.innerHTML = html;
    if (homeList) {
      homeList.innerHTML = this.socials.slice(0, 3).map(s => `
        <a href="${s.url}" target="_blank" class="cyber-btn btn-sm btn-ghost" style="justify-content:flex-start; gap:12px;">
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
      <div class="playlist-track-row ${idx === window.cyberMusic.currentIndex ? 'active' : ''}" data-idx="${idx}">
        <img class="track-row-art" src="${track.cover || 'assets/images/default-album.svg'}" alt="Cover">
        <div class="track-row-info">
          <div class="track-row-title">${track.title}</div>
          <div class="track-row-artist">${track.artist}</div>
        </div>
        <button class="cyber-btn btn-sm ${idx === window.cyberMusic.currentIndex && window.cyberMusic.isPlaying ? 'btn-pink' : ''}">
          ${idx === window.cyberMusic.currentIndex && window.cyberMusic.isPlaying ? 'PLAYING' : 'PLAY'}
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.playlist-track-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.getAttribute('data-idx'), 10);
        window.cyberMusic.loadTrack(idx, true);
        this.renderMusicSection();
      });
    });
  }

  // ==========================================
  // Navigation & SPA Section Switcher
  // ==========================================
  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.cyber-section');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');

    const switchSection = (targetId) => {
      navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-section') === targetId);
      });
      sections.forEach(sec => {
        sec.classList.toggle('active', sec.id === `section-${targetId}`);
      });
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-section');
        switchSection(target);
      });
    });

    // In-page navigation triggers
    document.querySelectorAll('[data-navigate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-navigate');
        switchSection(target);
      });
    });

    // Mobile Hamburger
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  // ==========================================
  // Modals & Forms Handlers
  // ==========================================
  bindModals() {
    // Universal close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
      });
    });

    // Lightbox close
    const lightbox = document.getElementById('gallery-lightbox');
    const closeLightbox = document.getElementById('lightbox-close-btn');
    if (closeLightbox) {
      closeLightbox.addEventListener('click', () => lightbox.classList.remove('active'));
    }
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
      });
    }

    // Open Edit Profile
    const openProf = () => {
      document.getElementById('input-prof-name').value = this.profile.name;
      document.getElementById('input-prof-handle').value = this.profile.handle;
      document.getElementById('input-prof-profession').value = this.profile.profession;
      document.getElementById('input-prof-location').value = this.profile.location;
      document.getElementById('input-prof-bio').value = this.profile.bio;
      document.getElementById('modal-edit-profile').classList.add('active');
    };

    const homeEditBtn = document.getElementById('home-edit-btn');
    const profEditBtn = document.getElementById('btn-open-edit-profile');
    if (homeEditBtn) homeEditBtn.addEventListener('click', openProf);
    if (profEditBtn) profEditBtn.addEventListener('click', openProf);

    // Open Add Skill
    const addSkillBtn = document.getElementById('btn-add-skill');
    if (addSkillBtn) {
      addSkillBtn.addEventListener('click', () => {
        document.getElementById('input-skill-id').value = '';
        document.getElementById('modal-skill-title').textContent = 'ADD CAPABILITY';
        document.getElementById('form-skill').reset();
        document.getElementById('modal-skill').classList.add('active');
      });
    }

    // Open Add Project
    const addProjBtn = document.getElementById('btn-add-project');
    if (addProjBtn) {
      addProjBtn.addEventListener('click', () => {
        document.getElementById('input-proj-id').value = '';
        document.getElementById('modal-project-title').textContent = 'ADD CYBER PROJECT';
        document.getElementById('form-project').reset();
        document.getElementById('modal-project').classList.add('active');
      });
    }

    // Open Upload Gallery Photo
    const uploadPhotoBtn = document.getElementById('btn-upload-photo');
    if (uploadPhotoBtn) {
      uploadPhotoBtn.addEventListener('click', () => {
        document.getElementById('form-gallery').reset();
        document.getElementById('modal-gallery').classList.add('active');
      });
    }

    // Open Socials Modal
    const editSocialsBtn = document.getElementById('btn-edit-socials');
    if (editSocialsBtn) {
      editSocialsBtn.addEventListener('click', () => {
        this.socials.forEach(s => {
          const inp = document.getElementById(`soc-${s.id}`);
          if (inp) inp.value = s.url;
        });
        document.getElementById('modal-socials').classList.add('active');
      });
    }

    // Section music upload redirect or trigger
    const musicAddBtn = document.getElementById('section-music-add-btn');
    if (musicAddBtn) {
      musicAddBtn.addEventListener('click', () => {
        window.location.href = 'music.html';
      });
    }
  }

  bindForms() {
    // 1. Profile Form Submit
    const formProf = document.getElementById('form-edit-profile');
    if (formProf) {
      formProf.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.profile.name = document.getElementById('input-prof-name').value;
        this.profile.handle = document.getElementById('input-prof-handle').value;
        this.profile.profession = document.getElementById('input-prof-profession').value;
        this.profile.location = document.getElementById('input-prof-location').value;
        this.profile.bio = document.getElementById('input-prof-bio').value;

        // Avatar file upload
        const avatarFile = document.getElementById('input-prof-avatar-file').files[0];
        if (avatarFile && window.cyberDB) {
          await window.cyberDB.saveAsset('custom_avatar', avatarFile);
          this.profile.avatarUrl = URL.createObjectURL(avatarFile);
        }

        // Cover file upload
        const coverFile = document.getElementById('input-prof-cover-file').files[0];
        if (coverFile && window.cyberDB) {
          await window.cyberDB.saveAsset('custom_cover', coverFile);
          this.profile.coverUrl = URL.createObjectURL(coverFile);
        }

        this.saveData('neon_profile', this.profile);
        this.renderProfile();
        document.getElementById('modal-edit-profile').classList.remove('active');
        this.showToast('Profile credentials successfully updated');
      });
    }

    // 2. Skill Form Submit
    const formSkill = document.getElementById('form-skill');
    if (formSkill) {
      formSkill.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('input-skill-id').value;
        const name = document.getElementById('input-skill-name').value;
        const pct = parseInt(document.getElementById('input-skill-pct').value, 10);
        const cat = document.getElementById('input-skill-cat').value;

        if (id) {
          const skill = this.skills.find(s => s.id === id);
          if (skill) {
            skill.name = name;
            skill.pct = pct;
            skill.cat = cat;
          }
        } else {
          this.skills.push({ id: 's_' + Date.now(), name, pct, cat });
        }

        this.saveData('neon_skills', this.skills);
        this.renderSkills();
        this.renderStats();
        document.getElementById('modal-skill').classList.remove('active');
        this.showToast('Skill committed to matrix');
      });
    }

    // 3. Project Form Submit
    const formProj = document.getElementById('form-project');
    if (formProj) {
      formProj.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('input-proj-id').value;
        const title = document.getElementById('input-proj-title').value;
        const desc = document.getElementById('input-proj-desc').value;
        const tags = document.getElementById('input-proj-tags').value;
        const demo = document.getElementById('input-proj-demo').value;
        const github = document.getElementById('input-proj-github').value;

        let imgUrl = 'assets/images/default-cover.svg';
        const imgFile = document.getElementById('input-proj-img-file').files[0];
        if (imgFile && window.cyberDB) {
          const rec = await window.cyberDB.saveGalleryImage('proj_' + Date.now(), imgFile, { title });
          imgUrl = URL.createObjectURL(rec.blob);
        }

        if (id) {
          const p = this.projects.find(proj => proj.id === id);
          if (p) {
            p.title = title;
            p.desc = desc;
            p.tags = tags;
            p.demo = demo;
            p.github = github;
            if (imgFile) p.image = imgUrl;
          }
        } else {
          this.projects.push({
            id: 'p_' + Date.now(),
            title,
            desc,
            tags,
            demo,
            github,
            image: imgUrl
          });
        }

        this.saveData('neon_projects', this.projects);
        this.renderProjects();
        this.renderStats();
        document.getElementById('modal-project').classList.remove('active');
        this.showToast('Project archived and published');
      });
    }

    // 4. Gallery Form Submit
    const formGal = document.getElementById('form-gallery');
    if (formGal) {
      formGal.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = document.getElementById('input-gallery-file').files[0];
        if (!file || !window.cyberDB) return;

        const title = document.getElementById('input-gallery-title').value || 'Cyber Capture';
        await window.cyberDB.saveGalleryImage('photo_' + Date.now(), file, { title });
        await this.renderGallery();
        document.getElementById('modal-gallery').classList.remove('active');
        this.showToast('Holographic photo stored in IndexedDB');
      });
    }

    // 5. Socials Form Submit
    const formSoc = document.getElementById('form-socials');
    if (formSoc) {
      formSoc.addEventListener('submit', (e) => {
        e.preventDefault();
        this.socials.forEach(s => {
          const inp = document.getElementById(`soc-${s.id}`);
          if (inp) s.url = inp.value;
        });
        this.saveData('neon_socials', this.socials);
        this.renderSocials();
        document.getElementById('modal-socials').classList.remove('active');
        this.showToast('Social nodes recalibrated');
      });
    }
  }

  // ==========================================
  // CRUD Actions
  // ==========================================
  openEditSkill(id) {
    const skill = this.skills.find(s => s.id === id);
    if (!skill) return;
    document.getElementById('input-skill-id').value = skill.id;
    document.getElementById('input-skill-name').value = skill.name;
    document.getElementById('input-skill-pct').value = skill.pct;
    document.getElementById('input-skill-cat').value = skill.cat;
    document.getElementById('modal-skill-title').textContent = 'EDIT CAPABILITY';
    document.getElementById('modal-skill').classList.add('active');
  }

  deleteSkill(id) {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    this.skills = this.skills.filter(s => s.id !== id);
    this.saveData('neon_skills', this.skills);
    this.renderSkills();
    this.renderStats();
    this.showToast('Skill deleted');
  }

  openEditProject(id) {
    const proj = this.projects.find(p => p.id === id);
    if (!proj) return;
    document.getElementById('input-proj-id').value = proj.id;
    document.getElementById('input-proj-title').value = proj.title;
    document.getElementById('input-proj-desc').value = proj.desc;
    document.getElementById('input-proj-tags').value = proj.tags;
    document.getElementById('input-proj-demo').value = proj.demo;
    document.getElementById('input-proj-github').value = proj.github;
    document.getElementById('modal-project-title').textContent = 'EDIT PROJECT';
    document.getElementById('modal-project').classList.add('active');
  }

  deleteProject(id) {
    if (!confirm('Are you sure you want to remove this project?')) return;
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveData('neon_projects', this.projects);
    this.renderProjects();
    this.renderStats();
    this.showToast('Project deleted');
  }

  async deleteGalleryPhoto(id) {
    if (!window.cyberDB) return;
    await window.cyberDB.deleteGalleryImage(id);
    await this.renderGallery();
    this.showToast('Photo erased from IndexedDB');
  }

  openLightbox(url, title) {
    const lightbox = document.getElementById('gallery-lightbox');
    const img = document.getElementById('lightbox-img-element');
    const cap = document.getElementById('lightbox-caption-text');
    if (img) img.src = url;
    if (cap) cap.textContent = title;
    if (lightbox) lightbox.classList.add('active');
  }

  // ==========================================
  // Mini Player Controls & Dashboard Sync
  // ==========================================
  bindMiniPlayer() {
    if (!window.cyberMusic) return;

    // Mini Play button
    const playBtn = document.getElementById('mini-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        window.cyberMusic.toggle();
        this.renderMusicSection();
      });
    }

    // Mini Prev & Next
    const prevBtn = document.getElementById('mini-prev-btn');
    const nextBtn = document.getElementById('mini-next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => window.cyberMusic.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => window.cyberMusic.next());

    // Mini Scrub
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

    // Mini Volume
    const vol = document.getElementById('mini-volume');
    if (vol) {
      vol.value = window.cyberMusic.volume;
      vol.addEventListener('input', (e) => {
        window.cyberMusic.setVolume(parseFloat(e.target.value));
      });
    }

    // Home widget play button
    const homePlayBtn = document.getElementById('home-play-toggle-btn');
    if (homePlayBtn) {
      homePlayBtn.addEventListener('click', () => {
        window.cyberMusic.toggle();
      });
    }
  }

  // ==========================================
  // Settings & Theme Engine
  // ==========================================
  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem('neon_theme', theme);

    const root = document.documentElement;
    const themes = {
      cyan: {
        primary: '#00f3ff',
        secondary: '#ff007f',
        glow: 'rgba(0, 243, 255, 0.45)',
        glowSec: 'rgba(255, 0, 127, 0.35)'
      },
      pink: {
        primary: '#ff007f',
        secondary: '#9d00ff',
        glow: 'rgba(255, 0, 127, 0.45)',
        glowSec: 'rgba(157, 0, 255, 0.35)'
      },
      purple: {
        primary: '#9d00ff',
        secondary: '#00f3ff',
        glow: 'rgba(157, 0, 255, 0.45)',
        glowSec: 'rgba(0, 243, 255, 0.35)'
      },
      green: {
        primary: '#00ff66',
        secondary: '#00f3ff',
        glow: 'rgba(0, 255, 102, 0.45)',
        glowSec: 'rgba(0, 243, 255, 0.35)'
      },
      yellow: {
        primary: '#ffe600',
        secondary: '#ff007f',
        glow: 'rgba(255, 230, 0, 0.45)',
        glowSec: 'rgba(255, 0, 127, 0.35)'
      }
    };

    const t = themes[theme] || themes.cyan;
    root.style.setProperty('--accent-primary', t.primary);
    root.style.setProperty('--accent-secondary', t.secondary);
    root.style.setProperty('--accent-glow', t.glow);
    root.style.setProperty('--accent-glow-secondary', t.glowSec);

    // Update active button state
    document.querySelectorAll('.palette-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
  }

  applyPreferences() {
    const scanlines = document.getElementById('scanlines-layer');
    if (scanlines) {
      scanlines.style.display = this.scanlines ? 'block' : 'none';
    }

    const checkScan = document.getElementById('setting-scanlines');
    if (checkScan) checkScan.checked = this.scanlines;

    const checkAnim = document.getElementById('setting-animations');
    if (checkAnim) checkAnim.checked = this.animations;

    if (!this.animations) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }

  bindSettings() {
    // Palette buttons
    document.querySelectorAll('.palette-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        this.applyTheme(theme);
        this.showToast(`Theme calibrated: ${theme.toUpperCase()}`);
      });
    });

    // Scanlines switch
    const checkScan = document.getElementById('setting-scanlines');
    if (checkScan) {
      checkScan.addEventListener('change', (e) => {
        this.scanlines = e.target.checked;
        localStorage.setItem('neon_scanlines', this.scanlines.toString());
        this.applyPreferences();
      });
    }

    // Animations switch
    const checkAnim = document.getElementById('setting-animations');
    if (checkAnim) {
      checkAnim.addEventListener('change', (e) => {
        this.animations = e.target.checked;
        localStorage.setItem('neon_animations', this.animations.toString());
        this.applyPreferences();
      });
    }

    // Export Data JSON
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const backup = {
          version: '2.0',
          timestamp: new Date().toISOString(),
          profile: this.profile,
          skills: this.skills,
          projects: this.projects,
          socials: this.socials,
          playlist: window.cyberMusic ? window.cyberMusic.playlist : []
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cyber_profile_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Profile configuration exported as JSON');
      });
    }

    // Import Data JSON
    const importInput = document.getElementById('import-json-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.profile) this.profile = data.profile;
            if (data.skills) this.skills = data.skills;
            if (data.projects) this.projects = data.projects;
            if (data.socials) this.socials = data.socials;

            this.saveData('neon_profile', this.profile);
            this.saveData('neon_skills', this.skills);
            this.saveData('neon_projects', this.projects);
            this.saveData('neon_socials', this.socials);

            if (data.playlist && window.cyberMusic) {
              window.cyberMusic.playlist = data.playlist;
              window.cyberMusic.savePlaylist();
            }

            this.renderAll();
            this.showToast('Profile data restored successfully!');
          } catch (err) {
            alert('Invalid backup JSON file.');
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset All Data
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        const confirmed = confirm('WARNING: Are you sure you want to reset all profile data, local songs, and gallery images? This cannot be undone.');
        if (!confirmed) return;

        localStorage.clear();
        if (window.cyberDB) {
          await window.cyberDB.clearAll();
        }
        window.location.reload();
      });
    }
  }

  // Toast System
  showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'cyber-toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-primary)">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.cyberApp = new CyberApp();
});
