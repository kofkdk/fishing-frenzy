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

let fishRendered = false;

export function renderScene() {
  const fishBg = document.getElementById('fishBg');
  const fisherContainer = document.getElementById('fisherContainer');
  if (!fishBg || !fisherContainer) return;

  const phase = fishingMinigame.phase;

  // Get the correct sprite for current phase
  const fisherSprite = getFisherBoatSprite(phase);
  const bobber = getBobberSprite();
  const showBobber = ['waiting', 'bite', 'reeling'].includes(phase);
  const bobberClass = phase === 'bite' ? 'bobber-bite' : (phase === 'reeling' ? 'bobber-reel' : '');

  // Always update fisher (swap sprite per phase = animation!)
  let fisherHtml = `
    <div class="scene-fisher">
      <img src="${fisherSprite}" alt="Fisher">
    </div>
  `;

  if (showBobber) {
    fisherHtml += `
      <div class="scene-bobber ${bobberClass}">
        <img src="${bobber}" alt="Bobber">
      </div>
    `;
  }

  fisherContainer.innerHTML = fisherHtml;

  // Background fish - only render once
  if (!fishRendered) {
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

    // Add keyframes
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
    fishRendered = true;
  }
}
