// Scene.js - Background fish animations with real sprites
import { getFishSprite } from '../utils/sprites.js';

const BG_FISH = [
  { id: 'goldfish', top: 42, duration: 14, dir: 'left' },
  { id: 'salmon', top: 55, duration: 18, dir: 'right' },
  { id: 'bass', top: 70, duration: 22, dir: 'left' },
  { id: 'trout', top: 48, duration: 16, dir: 'right' },
  { id: 'carp', top: 65, duration: 20, dir: 'left' },
  { id: 'guppy', top: 80, duration: 12, dir: 'right' }
];

export function renderScene() {
  const container = document.getElementById('fishBg');
  if (!container) return;

  let html = '';
  BG_FISH.forEach((f, i) => {
    const sprite = getFishSprite(f.id);
    const goingRight = f.dir === 'right';
    
    // SVG fish faces LEFT by default (mouth on left side)
    // Going left = no flip needed, going right = flip with scaleX(-1)
    const animName = goingRight ? 'swim-right' : 'swim-left';
    const flipStyle = goingRight ? 'transform:scaleX(-1);' : '';
    
    html += `
      <div class="fish-bg fish-${f.dir}" style="
        position: absolute;
        top: ${f.top}%;
        animation: ${animName} ${f.duration}s linear infinite;
        animation-delay: ${-i * 3}s;
        opacity: 0.7;
      "><img src="${sprite}" alt="${f.id}" style="width:48px;height:30px;${flipStyle}"></div>
    `;
  });
  container.innerHTML = html;

  // Add swim keyframes
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
      .fish-bg {
        position: absolute;
      }
    `;
    document.head.appendChild(style);
  }
}
