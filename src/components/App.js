// App.js - Main application renderer
import { renderScene } from './Scene.js';
import { renderUI, renderEnergyOverlay } from './UI.js';
import { renderHeader } from './Header.js';
import { renderModals } from './Modals.js';

export function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app">
      <div class="header" id="header"></div>
      <div class="scene" id="scene">
        <div class="sky" id="sky"></div>
        <div class="moon"></div>
        <div class="stars" id="stars"></div>
        <div id="energyOverlay"></div>
        <div class="water" id="water">
          <div class="wave"></div>
          <div id="fishBg"></div>
        </div>
        <div id="fisherContainer"></div>

        <canvas id="particles"></canvas>
      </div>
      <div class="ui-panel" id="uiPanel"></div>
      <div class="modal-bg" id="modalBg"></div>
      <div class="catch-popup" id="catchPopup"></div>
      <div class="toast" id="toast"></div>
    </div>
  `;

  // Size particle canvas
  const canvas = document.getElementById('particles');
  const scene = document.getElementById('scene');
  if (canvas && scene) {
    canvas.width = scene.offsetWidth;
    canvas.height = scene.offsetHeight;
  }

  // Generate stars
  generateStars();

  // Render sub-components
  renderHeader();
  renderScene();
  renderEnergyOverlay();
  renderUI();

  // Listen for state changes
  window.game.state.on('*', () => {
    renderHeader();
    renderEnergyOverlay();
    renderUI();
  });
}

function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  let html = '';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 3;
    const size = Math.random() * 2 + 1;
    html += `<div class="star" style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;animation-delay:${delay}s"></div>`;
  }
  container.innerHTML = html;
}
