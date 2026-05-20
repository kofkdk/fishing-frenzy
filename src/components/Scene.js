// Scene.js - Background fish animations
import { SPECIES } from '../data/fish.js';

const BG_FISH = [
  { id: 'goldfish', top: 42, duration: 12 },
  { id: 'salmon', top: 58, duration: 16 },
  { id: 'bass', top: 75, duration: 20 },
  { id: 'trout', top: 52, duration: 14 },
  { id: 'carp', top: 68, duration: 18 }
];

export function renderScene() {
  const container = document.getElementById('fishBg');
  if (!container) return;

  let html = '';
  BG_FISH.forEach((f, i) => {
    const reverse = i % 2 ? 'reverse' : '';
    html += `
      <div class="fish-bg ${reverse}" style="
        position:absolute;
        top:${f.top}%;
        animation: swim ${f.duration}s linear infinite;
        animation-delay: ${-i * 4}s;
        animation-direction: ${reverse || 'normal'};
        font-size: 24px;
        opacity: 0.6;
      ">\u{1F41F}</div>
    `;
  });
  container.innerHTML = html;

  // Add swim keyframes if not exists
  if (!document.getElementById('swim-keyframes')) {
    const style = document.createElement('style');
    style.id = 'swim-keyframes';
    style.textContent = `@keyframes swim { 0% { transform: translateX(-60px); } 100% { transform: translateX(480px); } }`;
    document.head.appendChild(style);
  }
}
