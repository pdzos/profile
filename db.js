/**
 * Neon Cyber DB - Vanilla IndexedDB Storage Engine
 * Handles binary storage for audio files, high-res gallery images, and profile assets.
 */

const DB_CONFIG = {
  name: 'NeonCyberDB',
  version: 1,
  stores: {
    audio: 'audio_files',
    gallery: 'gallery_images',
    assets: 'custom_assets'
  }
};

class CyberDB {
  constructor() {
    this.db = null;
    this._initPromise = null;
  }

  async init() {
    if (this.db) return this.db;
    if (this._initPromise) return this._initPromise;

    this._initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Audio store: stores song files
        if (!db.objectStoreNames.contains(DB_CONFIG.stores.audio)) {
          db.createObjectStore(DB_CONFIG.stores.audio, { keyPath: 'id' });
        }
        // Gallery store: stores photos
        if (!db.objectStoreNames.contains(DB_CONFIG.stores.gallery)) {
          db.createObjectStore(DB_CONFIG.stores.gallery, { keyPath: 'id' });
        }
        // Custom assets: avatar, covers
        if (!db.objectStoreNames.contains(DB_CONFIG.stores.assets)) {
          db.createObjectStore(DB_CONFIG.stores.assets, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this._initPromise;
  }

  // --- AUDIO METHODS ---
  async saveAudio(id, blob, metadata = {}) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.audio, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.stores.audio);
      const record = {
        id,
        blob,
        title: metadata.title || 'Unknown Track',
        artist: metadata.artist || 'Unknown Artist',
        duration: metadata.duration || 0,
        coverBlob: metadata.coverBlob || null,
        type: blob.type || 'audio/mpeg',
        size: blob.size,
        createdAt: Date.now()
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async getAudio(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.audio, 'readonly');
      const store = tx.objectStore(DB_CONFIG.stores.audio);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteAudio(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.audio, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.stores.audio);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllAudios() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.audio, 'readonly');
      const store = tx.objectStore(DB_CONFIG.stores.audio);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- GALLERY METHODS ---
  async saveGalleryImage(id, blob, metadata = {}) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.gallery, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.stores.gallery);
      const record = {
        id,
        blob,
        title: metadata.title || 'Cyber Shot',
        category: metadata.category || 'General',
        type: blob.type,
        size: blob.size,
        createdAt: Date.now()
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async getGalleryImage(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.gallery, 'readonly');
      const store = tx.objectStore(DB_CONFIG.stores.gallery);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteGalleryImage(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.gallery, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.stores.gallery);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllGalleryImages() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.gallery, 'readonly');
      const store = tx.objectStore(DB_CONFIG.stores.gallery);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- ASSET METHODS (Avatar / Cover) ---
  async saveAsset(key, blob) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.assets, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.stores.assets);
      const record = { key, blob, type: blob.type, updatedAt: Date.now() };
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async getAsset(key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.assets, 'readonly');
      const store = tx.objectStore(DB_CONFIG.stores.assets);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteAsset(key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.stores.assets, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.stores.assets);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  // --- RESET ALL DATA ---
  async clearAll() {
    const db = await this.init();
    const stores = [DB_CONFIG.stores.audio, DB_CONFIG.stores.gallery, DB_CONFIG.stores.assets];
    const tx = db.transaction(stores, 'readwrite');
    for (const s of stores) {
      tx.objectStore(s).clear();
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  // Utility: Convert Blob to Object URL (caller can revoke if needed)
  blobToUrl(blob) {
    if (!blob) return '';
    return URL.createObjectURL(blob);
  }
}

// Global instance
window.cyberDB = new CyberDB();
