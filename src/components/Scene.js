// Scene.js - Background fish animations with real sprites
import { getFishSprite } from '../utils/sprites.js';

const BG_FISH = [
  { id: 'goldfish', top: 42, duration: 14, dir: 'right' },
  { id: 'salmon', top: 55, duration: 18, dir: 'left' },
  { id: 'bass', top: 70, duration: 22, dir: 'right' },
  { id: 'trout', top: 48, duration: 16, dir: 'left' },
  { id: 'carp', top: 65, duration: 20, dir: 'right' },
  { id: 'guppy', top: 80, duration: 12, dir: 'left' }
];

export function renderScene() {
  const container = document.getElementById('fishBg');
  if (!container) return;

  let html = '';
  BG_FISH.forEach((f, i) => {
    const sprite = getFishSprite(f.id);
    const goingLeft = f.dir === 'left';
    
    html += `
      <div class="fish-bg" style="
        position: absolute;
        top: ${f.top}%;
        animation: ${goingLeft ? 'swim-left' : 'swim-right'} ${f.duration}s linear infinite;
        animation-delay: ${-i * 3}s;
        opacity: 0.7;
      "><img src="${sprite}" alt="${f.id}" style="width:48px;height:30px;${goingLeft ? 'transform:scaleX(-1);' : ''}"></div>
    `;
  });
  container.innerHTML = html;

  // Add swim keyframes
  if (!document.getElementById('swim-keyframes')) {
    const style = document.createElement('style');
    style.id = 'swim-keyframes';
    style.textContent = `
      @keyframes swim-right {
        0% { left: -60px; }
        100% { left: calc(100% + 60px); }
      }
      @keyframes swim-left {
        0% { left: calc(100% + 60px); }
        100% { left: -60px; }
      }
      .fish-bg { will-change: left; position: absolute; }
    `;
    document.head.appendChild(style);
  }
}
