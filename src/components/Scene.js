// Scene.js - Background fish animations with real sprites
import { getFishSprite } from '../utils/sprites.js';

const BG_FISH = [
  { id: 'goldfish', top: 42, duration: 12 },
  { id: 'salmon', top: 55, duration: 16 },
  { id: 'bass', top: 70, duration: 20 },
  { id: 'trout', top: 48, duration: 14 },
  { id: 'carp', top: 65, duration: 18 },
  { id: 'guppy', top: 80, duration: 10 }
];

export function renderScene() {
  const container = document.getElementById('fishBg');
  if (!container) return;

  let html = '';
  BG_FISH.forEach((f, i) => {
    const reverse = i % 2;
    const sprite = getFishSprite(f.id);
    html += `
      <div class="fish-bg" style="
        position: absolute;
        top: ${f.top}%;
        animation: swim ${f.duration}s linear infinite;
        animation-delay: ${-i * 3}s;
        animation-direction: ${reverse ? 'reverse' : 'normal'};
        opacity: 0.7;
        ${reverse ? 'transform: scaleX(-1);' : ''}
      "><img src="${sprite}" alt="${f.id}" style="width:48px;height:30px;image-rendering:pixelated"></div>
    `;
  });
  container.innerHTML = html;

  // Add swim keyframes
  if (!document.getElementById('swim-keyframes')) {
    const style = document.createElement('style');
    style.id = 'swim-keyframes';
    style.textContent = `
      @keyframes swim {
        0% { transform: translateX(-60px); }
        100% { transform: translateX(calc(100vw + 60px)); }
      }
      .fish-bg { will-change: transform; }
    `;
    document.head.appendChild(style);
  }
}
