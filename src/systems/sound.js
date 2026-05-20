// Sound System - Audio effects using Howler.js
import { Howl, Howler } from 'howler';
import gameState from './state.js';

// Generate simple sound effects using Web Audio API as fallback
// Since we don't have actual audio files, we'll use synthesized sounds

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.volume = 0.7;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isEnabled() {
    return gameState.get('settings.sound') !== false;
  }

  // Synthesize sounds
  playTone(freq, duration, type = 'sine', volume = 0.3) {
    if (!this.isEnabled()) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Sound effects
  cast() {
    this.playTone(300, 0.15, 'sine', 0.2);
    setTimeout(() => this.playTone(500, 0.1, 'sine', 0.15), 100);
  }

  splash() {
    // White noise burst for splash
    if (!this.isEnabled()) return;
    this.ensureContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  catchFish(rarity) {
    const melodies = {
      common: [440, 550, 660],
      uncommon: [440, 550, 660, 770],
      rare: [440, 550, 660, 880, 990],
      epic: [440, 550, 660, 880, 990, 1100],
      legendary: [440, 550, 660, 880, 990, 1100, 1320],
      mythic: [440, 550, 660, 880, 990, 1100, 1320, 1540]
    };
    const notes = melodies[rarity] || melodies.common;
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.25), i * 80);
    });
  }

  escape() {
    this.playTone(400, 0.2, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.1), 150);
  }

  coin() {
    this.playTone(1200, 0.08, 'square', 0.15);
    setTimeout(() => this.playTone(1600, 0.1, 'square', 0.12), 60);
  }

  gem() {
    this.playTone(800, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(1200, 0.1, 'sine', 0.18), 80);
    setTimeout(() => this.playTone(1600, 0.15, 'sine', 0.15), 160);
  }

  levelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.3), i * 120);
    });
  }

  buy() {
    this.playTone(600, 0.08, 'square', 0.12);
    setTimeout(() => this.playTone(800, 0.1, 'square', 0.1), 60);
  }

  error() {
    this.playTone(200, 0.2, 'sawtooth', 0.15);
  }

  click() {
    this.playTone(800, 0.05, 'sine', 0.1);
  }

  breed() {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'triangle', 0.2), i * 150);
    });
  }

  achievement() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.25), i * 100);
    });
  }

  // Ambient water loop (simple oscillator)
  startAmbient() {
    if (!gameState.get('settings.music')) return;
    this.ensureContext();
    if (!this.ctx) return;

    if (this.ambientOsc) return;

    this.ambientOsc = this.ctx.createOscillator();
    this.ambientGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    this.ambientOsc.type = 'sine';
    this.ambientOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    this.ambientGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    this.ambientOsc.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);
    this.ambientOsc.start();
  }

  stopAmbient() {
    if (this.ambientOsc) {
      this.ambientOsc.stop();
      this.ambientOsc = null;
    }
  }
}

export const soundSystem = new SoundSystem();
export default soundSystem;
