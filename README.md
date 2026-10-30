# Neon Cyber Personal Profile Website

> A futuristic, cyberpunk-themed personal profile dashboard and dedicated audio synthesizer player built strictly with **HTML5, CSS3, and Vanilla JavaScript**.

---

## ⚡ Highlights & Key Features

- **No Frameworks, No Backend, No Firebase, No Paid APIs**: 100% lightweight, pure web standards.
- **Persistent Local Storage**:
  - **IndexedDB**: High-performance binary storage for user-uploaded MP3/WAV audio files and high-resolution gallery images.
  - **LocalStorage**: Seamless persistence for profile biography, skills telemetry, projects catalog, social nodes, playlists, and themes.
- **Cyberpunk & Glassmorphism Design System**:
  - Glowing neon borders, dynamic scanline CRT overlay, and perspective grid backdrop.
  - Multi-palette accent switcher (*Electric Cyan, Neon Magenta, Hyper Violet, Toxic Matrix, Solar Flare*).
  - Animated profile avatar frame with rotating neon gradient rings.
  - Glitch-hover cyber buttons with corner polygon clips.
- **Comprehensive Profile & Content CRUD**:
  - **Edit Profile**: Modify Name, Username, Profession, Location, Bio, Avatar, and Cover Banner with instant preview.
  - **Skills Matrix**: Visual percentage gauges with real-time add, edit, and delete functionality.
  - **Project Archive**: Interactive project showcases featuring tag chips, live demo links, and GitHub links.
  - **Cyber Gallery**: IndexedDB-backed local photo vault with masonry grid and neon Lightbox viewer.
  - **Social Links**: Attractive cyberpunk cards for YouTube, Instagram, Telegram, GitHub, Discord, and X (Twitter) with customizable URLs.
- **Dual Music Player System**:
  - **Universal Bottom Mini Player**: Sticky dock with spinning vinyl album art, track scrubber, playback controls, and volume slider.
  - **Dedicated Fullscreen Music Player (`music.html`)**: Real-time Web Audio API frequency visualizer, large rotating holographic vinyl, shuffle, repeat, favorites, and playlist manager with MP3 file uploader.
- **Settings & Data Portability**:
  - Export entire configuration and library data as a single `.json` file.
  - Import / restore data from backups.
  - Factory reset / wipe with confirmation safety.

---

## 📂 Project Structure

```
profile/
│
├── index.html               # Main Cyberpunk Profile & Dashboard SPA
├── music.html               # Dedicated Full-Screen Audio Player & Spectrum Visualizer
├── style.css                # Global cyber neon design system, animations, & responsive layout
├── music.css                # Visualizer, circular glowing vinyl, and playlist drawer styles
├── db.js                    # Vanilla IndexedDB storage wrapper (Audio files, Gallery images, Assets)
├── script.js                # Dashboard logic, SPA navigation, CRUD operations, & theme engine
├── music.js                 # HTML5 Audio engine, Web Audio API Analyser, and playlist manager
│
├── assets/
│   ├── images/
│   │   ├── default-avatar.svg   # Cyber cyborg avatar with neon visor
│   │   ├── default-cover.svg    # Retro synthwave perspective grid & neon skyline
│   │   └── default-album.svg    # Holographic cyber vinyl album cover
│   └── audio/
│       └── neon-cyber-dream.wav # Looping synthwave ambient starter audio track
│
└── README.md                # Project documentation
```

---

## 🚀 How to Run

1. Open the folder:
   ```
   E:\Users\Administrator\Desktop\profile
   ```
2. Simply double-click **`index.html`** or **`music.html`** in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).
3. (Optional) Run with a local development server like VS Code Live Server or `npx serve`:
   ```bash
   npx serve .
   ```

---

## 🌐 Browser Compatibility
- Chrome / Chromium-based browsers (Edge, Brave, Opera)
- Firefox
- Safari (iOS & macOS)
- Fully responsive across Mobile (< 768px), Tablet (768px - 1024px), and Desktop (> 1024px).
