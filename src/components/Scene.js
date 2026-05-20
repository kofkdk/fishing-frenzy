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
  const fishBg = document.getElementById('fishBg');
  const fisherContainer = document.getElementById('fisherContainer');
  if (!fishBg) return;

  const fisherBoat = getFisherBoatSprite();
  const phase = fishingMinigame.phase;
  
  // Phase-based classes for animation
  let fisherClass = 'scene-fisher';
  if (phase === 'casting') fisherClass += ' casting';
  if (phase === 'reeling') fisherClass += ' reeling';
  if (phase === 'bite') fisherClass += ' bite-alert';

  // Bobber visibility
  const showBobber = ['waiting', 'bite', 'reeling'].includes(phase);
  const bobberClass = phase === 'bite' ? 'bobber-bite' : (phase === 'reeling' ? 'bobber-reel' : '');
  const bobber = getBobberSprite();

  // Fisher + bobber + line → render to fisherContainer (outside water div)
  if (fisherContainer) {
    let fisherHtml = `
      <div class="${fisherClass}">
        <img src="${fisherBoat}" alt="Fisher">
      </div>
    `;

    if (showBobber) {
      fisherHtml += `
        <div class="scene-bobber ${bobberClass}">
          <img src="${bobber}" alt="Bobber">
        </div>
        <div class="fishing-line"></div>
      `;
    }

    fisherContainer.innerHTML = fisherHtml;
  }

  // Background fish → render to fishBg (inside water div)
  let fishHtml = '';
  BG_FISH.forEach((f, i) => {
    const sprite = getFishSprite(f.id);
    const goingRight = f.dir === 'right';
    const animName = goingRight ? 'swim-right' : 'swim-left';
    const flipStyle = goingRight ? 'transform:scaleX(-1);' : '';
    
    fishHtml += `
      <div class="fish-bg" style="
        position: absolute;
        top: ${f.top}%;
        animation: ${animName} ${f.duration}s linear infinite;
        animation-delay: ${-i * 3}s;
        opacity: 0.6;
      "><img src="${sprite}" alt="${f.id}" style="width:48px;height:24px;image-rendering:pixelated;${flipStyle}"></div>
    `;
  });
  fishBg.innerHTML = fishHtml;

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
      .fish-bg { position: absolute; }
    `;
    document.head.appendChild(style);
  }
}
