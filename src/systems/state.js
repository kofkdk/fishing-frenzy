// Game State Manager - Central state with localStorage persistence
const SAVE_KEY = 'fishing-frenzy-save';
const VERSION = '1.0.0';

const DEFAULT_STATE = {
  version: VERSION,
  player: {
    coins: 500,
    gems: 20,
    xp: 0,
    level: 1,
    energy: 100,
    maxEnergy: 100,
    title: 'Pemula'
  },
  equipment: {
    rod: { id: 'bamboo', durability: 100, maxDurability: 100 },
    bait: { id: 'worm', count: 20 }
  },
  inventory: [],
  stats: {
    totalCaught: 0,
    rareCaught: 0,
    totalBred: 0,
    totalSold: 0,
    biggestFish: 0,
    totalCoinsEarned: 0,
    daysPlayed: 1,
    firstPlayDate: Date.now()
  },
  quests: {
    daily: [],
    weekly: [],
    lastDailyReset: 0,
    lastWeeklyReset: 0
  },
  achievements: [],
  settings: {
    sound: true,
    music: true,
    particles: true,
    vibration: true
  },
  weather: {
    current: 'clear',
    lastChange: Date.now()
  }
};

class GameState {
  constructor() {
    this.state = this.load();
    this.listeners = new Map();
  }

  load() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        return this.deepMerge(structuredClone(DEFAULT_STATE), parsed);
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
    return structuredClone(DEFAULT_STATE);
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  }

  reset() {
    this.state = structuredClone(DEFAULT_STATE);
    this.save();
    this.emit('reset');
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  set(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], this.state);
    target[last] = value;
    this.save();
    this.emit(path, value);
  }

  update(path, fn) {
    const current = this.get(path);
    this.set(path, fn(current));
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const list = this.listeners.get(event);
    if (list) this.listeners.set(event, list.filter(cb => cb !== callback));
  }

  emit(event, data) {
    const list = this.listeners.get(event);
    if (list) list.forEach(cb => cb(data));
    // Also emit wildcard
    const wild = this.listeners.get('*');
    if (wild) wild.forEach(cb => cb(event, data));
  }

  deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  export() {
    return JSON.stringify(this.state, null, 2);
  }

  import(json) {
    try {
      const data = JSON.parse(json);
      this.state = this.deepMerge(structuredClone(DEFAULT_STATE), data);
      this.save();
      this.emit('reset');
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const gameState = new GameState();
export default gameState;
