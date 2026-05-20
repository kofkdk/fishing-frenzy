// Main entry point - Fishing Frenzy
import './styles/main.css';
import gameState from './systems/state.js';
import { fishingEngine } from './systems/fishing.js';
import { breedingSystem } from './systems/breeding.js';
import { weatherSystem } from './systems/weather.js';
import { QuestSystem, AchievementSystem } from './systems/quests.js';
import { ParticleSystem } from './systems/particles.js';
import { renderApp } from './components/App.js';
import { initController } from './systems/controller.js';
import { soundSystem } from './systems/sound.js';

// Initialize systems
const questSystem = new QuestSystem(gameState);
const achievementSystem = new AchievementSystem(gameState);

// Energy regeneration (1 energy per 3 seconds)
setInterval(() => {
  const energy = gameState.get('player.energy');
  const maxEnergy = gameState.get('player.maxEnergy');
  if (energy < maxEnergy) {
    gameState.set('player.energy', Math.min(energy + 1, maxEnergy));
  }
}, 3000);

// Level up check
gameState.on('player.xp', () => {
  const xp = gameState.get('player.xp');
  const level = gameState.get('player.level');
  const needed = level * 150 + 50;

  if (xp >= needed) {
    gameState.set('player.xp', xp - needed);
    gameState.set('player.level', level + 1);
    gameState.update('player.maxEnergy', e => e + 15);
    gameState.set('player.energy', gameState.get('player.maxEnergy'));
    gameState.update('player.gems', g => g + 5);

achievementSystem.check('level', level + 1);
    soundSystem.levelUp();
    showToast(`\\u{1F389} Level ${level + 1}! +5 Gems`, 'success');
  }
});

// Export for global access
window.game = {
  state: gameState,
  fishing: fishingEngine,
  breeding: breedingSystem,
  weather: weatherSystem,
  quests: questSystem,
  achievements: achievementSystem,
  particles: null,

  showToast,
  checkAchievements: (type, value) => achievementSystem.check(type, value),
  updateQuests: (type, amount, meta) => questSystem.updateProgress(type, amount, meta)
};

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = 'toast', 2500);
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  initController();

  // Init particle canvas
  const particleCanvas = document.getElementById('particles');
  if (particleCanvas) {
    const scene = document.getElementById('scene');
    particleCanvas.width = scene.offsetWidth;
    particleCanvas.height = scene.offsetHeight;
    window.game.particles = new ParticleSystem(particleCanvas);
    window.game.particles.start();
  }

// Init sound on first interaction
  document.addEventListener('pointerdown', () => soundSystem.init(), { once: true });

  console.log('\\u{1F3A3} Fishing Frenzy loaded!');
});
