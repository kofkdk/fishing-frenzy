// Header.js - Top bar with currency, weather, menu
import gameState from '../systems/state.js';
import { weatherSystem } from '../systems/weather.js';

export function renderHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const coins = gameState.get('player.coins');
  const gems = gameState.get('player.gems');
  const weather = weatherSystem.getCurrent();
  const level = gameState.get('player.level');

  header.innerHTML = `
    <div class="currency-group">
      <div class="currency" id="coinDisplay">
        <span>\u{1F4B0}</span><span>${coins.toLocaleString()}</span>
      </div>
      <div class="currency" id="gemDisplay">
        <span>\u{1F48E}</span><span>${gems}</span>
      </div>
      <div class="weather-badge">
        <span>${weather.icon}</span>
        <span>${weather.name}</span>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <div class="currency"><span>Lv.${level}</span></div>
      <button class="menu-btn" onclick="window.game.openMenu()">\u2630</button>
    </div>
  `;
}
