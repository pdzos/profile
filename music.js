/**
 * Neon Cyber Audio Engine & Visualizer
 * Shared between main dashboard mini-player and dedicated full-screen music player.
 */

const DEFAULT_STARTER_TRACK = {
  id: 'starter_track_01',
  title: 'Neon Cyber Dream',
  artist: 'SynthWave Matrix',
  duration: 12,
  src: 'assets/audio/neon-cyber-dream.wav',
  cover: 'assets/images/default-album.svg',
  isIndexedDB: false,
  isFavorite: true
};

class CyberMusicManager {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.crossOrigin = 'anonymous';

    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.dataArray = null;
    this.isAudioContextReady = false;

    // State
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.repeatMode = 'all'; // 'none', 'one', 'all'
    this.volume = 0.8;
    this.currentTrackUrl = null;

    // Load persisted state
    this.loadState();
    this.bindAudioEvents();
  }

  loadState() {
    const savedPlaylist = localStorage.getItem('neon_music_playlist');
    if (savedPlaylist) {
      try {
        this.playlist = JSON.parse(savedPlaylist);
      } catch (e) {
        this.playlist = [DEFAULT_STARTER_TRACK];
      }
    }
    if (!this.playlist || this.playlist.length === 0) {
      this.playlist = [DEFAULT_STARTER_TRACK];
      this.savePlaylist();
    }

    const savedIndex = parseInt(localStorage.getItem('neon_music_current_index') || '0', 10);
    this.currentIndex = (savedIndex >= 0 && savedIndex < this.playlist.length) ? savedIndex : 0;

    const savedVol = parseFloat(localStorage.getItem('neon_music_volume') || '0.8');
    this.volume = isNaN(savedVol) ? 0.8 : savedVol;
    this.audio.volume = this.volume;

    this.isShuffle = localStorage.getItem('neon_music_shuffle') === 'true';
    this.repeatMode = localStorage.getItem('neon_music_repeat') || 'all';
  }

  savePlaylist() {
    localStorage.setItem('neon_music_playlist', JSON.stringify(this.playlist));
    localStorage.setItem('neon_music_current_index', this.currentIndex.toString());
    localStorage.setItem('neon_music_volume', this.volume.toString());
    localStorage.setItem('neon_music_shuffle', this.isShuffle.toString());
    localStorage.setItem('neon_music_repeat', this.repeatMode);
  }

  async setupAudioContext() {
    if (this.isAudioContextReady) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;

      this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.isAudioContextReady = true;
    } catch (e) {
      console.warn('Web Audio API setup notice:', e);
    }
  }

  getCurrentTrack() {
    if (this.playlist.length === 0) return null;
    return this.playlist[this.currentIndex] || this.playlist[0];
  }

  async loadTrack(index, autoplay = false) {
    if (index < 0 || index >= this.playlist.length) return;
    this.currentIndex = index;
    const track = this.playlist[index];

    // Revoke previous object URL if blob
    if (this.currentTrackUrl && this.currentTrackUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.currentTrackUrl);
    }

    if (track.isIndexedDB && window.cyberDB) {
      try {
        const audioRecord = await window.cyberDB.getAudio(track.id);
        if (audioRecord && audioRecord.blob) {
          this.currentTrackUrl = URL.createObjectURL(audioRecord.blob);
          this.audio.src = this.currentTrackUrl;
        } else {
          this.audio.src = track.src || DEFAULT_STARTER_TRACK.src;
        }
      } catch (err) {
        console.error('Failed to load track from IndexedDB:', err);
        this.audio.src = track.src || DEFAULT_STARTER_TRACK.src;
      }
    } else {
      this.audio.src = track.src;
    }

    this.savePlaylist();
    this.updateAllUI();

    if (autoplay) {
      this.play();
    }
  }

  async play() {
    if (!this.audio.src || this.audio.src === window.location.href) {
      await this.loadTrack(this.currentIndex, false);
    }

    if (!this.isAudioContextReady) {
      await this.setupAudioContext();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.updateAllUI();
    } catch (err) {
      console.warn('Playback error / User interaction needed:', err);
      this.isPlaying = false;
      this.updateAllUI();
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateAllUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next() {
    if (this.playlist.length === 0) return;
    if (this.isShuffle) {
      let randIndex = Math.floor(Math.random() * this.playlist.length);
      if (randIndex === this.currentIndex && this.playlist.length > 1) {
        randIndex = (randIndex + 1) % this.playlist.length;
      }
      this.loadTrack(randIndex, true);
    } else {
      let nextIndex = this.currentIndex + 1;
      if (nextIndex >= this.playlist.length) {
        nextIndex = (this.repeatMode === 'none') ? -1 : 0;
      }
      if (nextIndex !== -1) {
        this.loadTrack(nextIndex, true);
      } else {
        this.pause();
      }
    }
  }

  prev() {
    if (this.playlist.length === 0) return;
    if (this.audio.currentTime > 3) {
      this.seek(0);
      return;
    }
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.playlist.length - 1;
    }
    this.loadTrack(prevIndex, true);
  }

  seek(seconds) {
    if (isNaN(seconds)) return;
    this.audio.currentTime = seconds;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audio.volume = this.volume;
    localStorage.setItem('neon_music_volume', this.volume.toString());
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    localStorage.setItem('neon_music_shuffle', this.isShuffle.toString());
    this.updateAllUI();
  }

  toggleRepeat() {
    const modes = ['all', 'one', 'none'];
    const nextIdx = (modes.indexOf(this.repeatMode) + 1) % modes.length;
    this.repeatMode = modes[nextIdx];
    localStorage.setItem('neon_music_repeat', this.repeatMode);
    this.updateAllUI();
  }

  toggleFavorite(trackId) {
    const track = this.playlist.find(t => t.id === trackId);
    if (track) {
      track.isFavorite = !track.isFavorite;
      this.savePlaylist();
      this.updateAllUI();
    }
  }

  async addTrack(file, title, artist, coverBlob = null) {
    const trackId = 'song_' + Date.now();
    let coverUrl = 'assets/images/default-album.svg';

    if (coverBlob) {
      coverUrl = URL.createObjectURL(coverBlob);
    }

    // Save audio file to IndexedDB
    if (window.cyberDB) {
      await window.cyberDB.saveAudio(trackId, file, {
        title,
        artist,
        coverBlob
      });
    }

    const newTrack = {
      id: trackId,
      title: title || file.name.replace(/\.[^/.]+$/, ""),
      artist: artist || 'Unknown Artist',
      duration: 0,
      src: '',
      cover: coverUrl,
      isIndexedDB: true,
      isFavorite: false
    };

    this.playlist.push(newTrack);
    this.savePlaylist();
    this.updateAllUI();

    // If it's the first added track or currently paused, cue it
    if (this.playlist.length === 1) {
      this.loadTrack(0, false);
    }
    return newTrack;
  }

  async deleteTrack(trackId) {
    const idx = this.playlist.findIndex(t => t.id === trackId);
    if (idx === -1) return;

    // Cannot delete if only 1 track left
    if (this.playlist.length <= 1) {
      alert('You must keep at least one track in the playlist.');
      return;
    }

    const track = this.playlist[idx];
    if (track.isIndexedDB && window.cyberDB) {
      await window.cyberDB.deleteAudio(trackId);
    }

    this.playlist.splice(idx, 1);
    if (this.currentIndex >= this.playlist.length) {
      this.currentIndex = 0;
    }
    this.savePlaylist();

    if (idx === this.currentIndex) {
      this.loadTrack(this.currentIndex, this.isPlaying);
    } else {
      this.updateAllUI();
    }
  }

  bindAudioEvents() {
    this.audio.addEventListener('timeupdate', () => {
      this.updateScrubbers();
    });

    this.audio.addEventListener('ended', () => {
      if (this.repeatMode === 'one') {
        this.seek(0);
        this.play();
      } else {
        this.next();
      }
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateAllUI();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateAllUI();
    });
  }

  formatTime(secs) {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  updateScrubbers() {
    const cur = this.audio.currentTime || 0;
    const dur = this.audio.duration || 0;

    // Mini player scrub
    const miniScrub = document.getElementById('mini-scrub');
    const miniCur = document.getElementById('mini-curr-time');
    const miniDur = document.getElementById('mini-total-time');

    if (miniScrub && dur > 0) {
      miniScrub.value = (cur / dur) * 100;
    }
    if (miniCur) miniCur.textContent = this.formatTime(cur);
    if (miniDur) miniDur.textContent = this.formatTime(dur);

    // Full player scrub
    const fullScrub = document.getElementById('full-scrub');
    const fullCur = document.getElementById('full-curr-time');
    const fullDur = document.getElementById('full-total-time');

    if (fullScrub && dur > 0) {
      fullScrub.value = (cur / dur) * 100;
    }
    if (fullCur) fullCur.textContent = this.formatTime(cur);
    if (fullDur) fullDur.textContent = this.formatTime(dur);
  }

  updateAllUI() {
    const track = this.getCurrentTrack();
    if (!track) return;

    // 1. Mini Player elements
    const miniTitle = document.getElementById('mini-title');
    const miniArtist = document.getElementById('mini-artist');
    const miniCover = document.getElementById('mini-cover');
    const miniPlayBtn = document.getElementById('mini-play-icon');

    if (miniTitle) miniTitle.textContent = track.title;
    if (miniArtist) miniArtist.textContent = track.artist;
    if (miniCover) {
      miniCover.src = track.cover || 'assets/images/default-album.svg';
      if (this.isPlaying) {
        miniCover.classList.add('spinning');
      } else {
        miniCover.classList.remove('spinning');
      }
    }
    if (miniPlayBtn) {
      miniPlayBtn.innerHTML = this.isPlaying 
        ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' // Pause icon
        : '<path d="M8 5v14l11-7z"/>'; // Play icon
    }

    // 2. Full Player elements (if on music.html)
    const fullTitle = document.getElementById('full-title');
    const fullArtist = document.getElementById('full-artist');
    const fullCover = document.getElementById('full-cover');
    const fullPlayBtn = document.getElementById('full-play-icon');
    const vinylDisc = document.getElementById('vinyl-disc');
    const favBtn = document.getElementById('full-fav-btn');
    const shuffleBtn = document.getElementById('full-shuffle-btn');
    const repeatBtn = document.getElementById('full-repeat-btn');

    if (fullTitle) fullTitle.textContent = track.title;
    if (fullArtist) fullArtist.textContent = track.artist;
    if (fullCover) fullCover.src = track.cover || 'assets/images/default-album.svg';
    if (vinylDisc) {
      if (this.isPlaying) {
        vinylDisc.classList.add('playing');
      } else {
        vinylDisc.classList.remove('playing');
      }
    }
    if (fullPlayBtn) {
      fullPlayBtn.innerHTML = this.isPlaying 
        ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' 
        : '<path d="M8 5v14l11-7z"/>';
    }
    if (favBtn) {
      favBtn.classList.toggle('active', !!track.isFavorite);
    }
    if (shuffleBtn) {
      shuffleBtn.classList.toggle('active', this.isShuffle);
    }
    if (repeatBtn) {
      repeatBtn.classList.toggle('active', this.repeatMode !== 'none');
      repeatBtn.title = `Repeat: ${this.repeatMode.toUpperCase()}`;
    }

    // 3. Render playlist if list element exists
    this.renderPlaylistDrawer();
  }

  renderPlaylistDrawer(filter = '') {
    const listContainer = document.getElementById('playlist-items-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const query = filter.toLowerCase().trim();

    this.playlist.forEach((item, index) => {
      if (query && !item.title.toLowerCase().includes(query) && !item.artist.toLowerCase().includes(query)) {
        return;
      }

      const row = document.createElement('div');
      row.className = `playlist-track-row ${index === this.currentIndex ? 'active' : ''}`;
      row.innerHTML = `
        <img class="track-row-art" src="${item.cover || 'assets/images/default-album.svg'}" alt="Cover" />
        <div class="track-row-info">
          <div class="track-row-title">${item.title}</div>
          <div class="track-row-artist">${item.artist}</div>
        </div>
        <div class="track-row-actions">
          <button class="track-del-btn" title="Delete Track" data-id="${item.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.track-del-btn')) {
          e.stopPropagation();
          const delId = e.target.closest('.track-del-btn').getAttribute('data-id');
          if (confirm('Delete this track from your playlist?')) {
            this.deleteTrack(delId);
          }
          return;
        }
        this.loadTrack(index, true);
      });

      listContainer.appendChild(row);
    });
  }

  // Visualizer Animation Loop
  startVisualizer(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!this.analyser || !this.dataArray || !this.isPlaying) {
        // Draw resting subtle ambient glow waves
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
        ctx.lineWidth = 2;
        const midY = canvas.height / 2;
        for (let x = 0; x < canvas.width; x += 10) {
          const y = midY + Math.sin(x * 0.01 + Date.now() * 0.002) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      this.analyser.getByteFrequencyData(this.dataArray);

      const bufferLength = this.analyser.frequencyBinCount;
      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (this.dataArray[i] / 255) * (canvas.height * 0.35);

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#ff007f');
        gradient.addColorStop(0.5, '#00f3ff');
        gradient.addColorStop(1, 'rgba(157, 0, 255, 0.1)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 4, barHeight);

        // Top mirror bars
        ctx.fillRect(x, 0, barWidth - 4, barHeight * 0.4);

        x += barWidth;
      }
    };

    draw();
  }
}

// Global instance
window.cyberMusic = new CyberMusicManager();
