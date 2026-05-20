// Scene.js - Game scene with fisher on boat + background fish
import { getFishSprite, getFisherBoatSprite, getBobberSprite } from '../utils/sprites.js';
import { fishingMinigame } from '../systems/fishing-minigame.js';

const BG_FISH = [
  { id: 'goldfish', top: 55, duration: 14, dir: 'left' },
  { id: 'salmon', top: 65, duration: 18, dir: 'right' },
  { id: 'bass', top: 75, duration: 22, dir: 'left' },
  { id: 'trout', top: 60, duration: 16, dir: 'right' },
  { id: 'carp', top: 70, duration: 20, dir: 'left' },
  { id: 'guppy', top: 80, duration: 12, dir: 'right' }
];

export function renderScene() {
  const container = document.getElementById('fishBg');
  if (!container) return;

  const fisherBoat = getFisherBoatSprite();
  const phase = fishingMinigame.phase;
  
  // Bobber visibility based on phase
  const showBobber = ['waiting', 'bite', 'reeling'].includes(phase);
  const bobberClass = phase === 'bite' ? 'bobber-bite' : '';
  const bobber = getBobberSprite();

  let html = `
    <div class="scene-fisher" style="
      position: absolute;
      bottom: 42%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    ">
      <img src="${fisherBoat}" alt="Fisher" style="width:140px;height:80px;image-rendering:pixelated;">
    </div>
  `;

  if (showBobber) {
    html += `
      <div class="scene-bobber ${bobberClass}" style="
        position: absolute;
        bottom: 28%;
        right: 25%;
        z-index: 9;
        animation: bobber-float 1.5s ease-in-out infinite;
      ">
        <img src="${bobber}" alt="Bobber" style="width:16px;height:16px;image-rendering:pixelated;">
      </div>
    `;
  }

  // Background fish
  BG_FISH.forEach((f, i) => {
    const sprite = getFishSprite(f.id);
    const goingRight = f.dir === 'right';
    const animName = goingRight ? 'swim-right' : 'swim-left';
    const flipStyle = goingRight ? 'transform:scaleX(-1);' : '';
    
    html += `
      <div class="fish-bg" style="
        position: absolute;
        top: ${f.top}%;
        animation: ${animName} ${f.duration}s linear infinite;
        animation-delay: ${-i * 3}s;
        opacity: 0.6;
      "><img src="${sprite}" alt="${f.id}" style="width:48px;height:24px;image-rendering:pixelated;${flipStyle}"></div>
    `;
  });
  container.innerHTML = html;

  // Add keyframes if not already added
  if (!document.getElementById('swim-keyframes')) {
    const style = document.createElement('style');
    style.id = 'swim-keyframes';
    style.textContent = `
      @keyframes swim-left {
        from { left: calc(100% + 60px); }
        to { left: -60px; }
      }
      @keyframes swim-right {
        from { left: -60px; }
        to { left: calc(100% + 60px); }
      }
      @keyframes bobber-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .bobber-bite {
        animation: bobber-bite 0.2s ease-in-out infinite !important;
      }
      @keyframes bobber-bite {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(3px) rotate(-5deg); }
        75% { transform: translateY(5px) rotate(5deg); }
      }
      .fish-bg { position: absolute; }
      .scene-fisher img { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
    `;
    document.head.appendChild(style);
  }
}
