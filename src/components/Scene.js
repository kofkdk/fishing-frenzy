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

let initialized = false;

export function renderScene() {
  const fishBg = document.getElementById('fishBg');
  const fisherContainer = document.getElementById('fisherContainer');
  if (!fishBg || !fisherContainer) return;

  const phase = fishingMinigame.phase;

  // Only create fisher DOM once, then just update classes
  if (!initialized) {
    const fisherBoat = getFisherBoatSprite();
    const bobber = getBobberSprite();

    fisherContainer.innerHTML = `
      <div class="scene-fisher" id="sceneFisher">
        <img src="${fisherBoat}" alt="Fisher">
      </div>
      <div class="scene-bobber" id="sceneBobber">
        <img src="${bobber}" alt="Bobber">
      </div>
      <div class="fishing-line" id="fishingLine"></div>
    `;

    // Background fish - only render once
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

    initialized = true;
  }

  // Update fisher classes (without re-creating DOM = animations persist)
  const fisher = document.getElementById('sceneFisher');
  const bobberEl = document.getElementById('sceneBobber');
  const lineEl = document.getElementById('fishingLine');

  if (fisher) {
    fisher.className = 'scene-fisher';
    if (phase === 'casting') fisher.classList.add('casting');
    if (phase === 'reeling') fisher.classList.add('reeling');
    if (phase === 'bite') fisher.classList.add('bite-alert');
  }

  // Show/hide bobber and line
  const showBobber = ['waiting', 'bite', 'reeling'].includes(phase);
  if (bobberEl) {
    bobberEl.style.display = showBobber ? 'block' : 'none';
    bobberEl.className = 'scene-bobber';
    if (phase === 'bite') bobberEl.classList.add('bobber-bite');
    if (phase === 'reeling') bobberEl.classList.add('bobber-reel');
  }
  if (lineEl) {
    lineEl.style.display = showBobber ? 'block' : 'none';
  }
}
