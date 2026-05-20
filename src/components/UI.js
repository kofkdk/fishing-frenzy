// UI.js - Bottom UI panel
import gameState from '../systems/state.js';
import { fishingEngine } from '../systems/fishing.js';
import { DEPTH_CONFIG, RODS, BAITS } from '../data/fish.js';

export function renderUI() {
  const panel = document.getElementById('uiPanel');
  if (!panel) return;

  const depth = fishingEngine.currentDepth;
  const config = DEPTH_CONFIG[depth];
  const energy = gameState.get('player.energy');
  const maxEnergy = gameState.get('player.maxEnergy');
  const rod = gameState.get('equipment.rod');
  const bait = gameState.get('equipment.bait');
  const rodData = RODS.find(r => r.id === rod.id) || RODS[0];
  const baitData = BAITS.find(b => b.id === bait.id) || BAITS[0];
  const inventory = gameState.get('inventory') || [];
  const isFishing = fishingEngine.isFishing;

  const rareChance = config.chances.rare + config.chances.epic + config.chances.legendary + config.chances.mythic;
  const legendChance = config.chances.legendary + config.chances.mythic;
  const canFish = energy >= config.energy && rod.durability > 0 && !isFishing;

  let castLabel = '\u{1F3A3} LEMPAR (' + config.energy + '\u26A1)';
  if (isFishing) castLabel = '\u23F3 ' + fishingEngine.progress + '%';
  else if (rod.durability <= 0) castLabel = '\u{1F527} RUSAK';
  else if (energy < config.energy) castLabel = '\u26A1 KURANG';

  panel.innerHTML = `
    <div class="depth-control">
      <div class="depth-header"><b>\u{1F3AF} Kedalaman</b><span>${depth}m</span></div>
      <input type="range" class="depth-slider" id="depthSlider" min="1" max="5" value="${depth}" oninput="window.game.setDepth(+this.value)">
      <div class="depth-labels"><span>1m</span><span>2m</span><span>3m</span><span>4m</span><span>5m</span></div>
      <div class="depth-stats">
        <div class="depth-stat"><b>\u26A1${config.energy}</b><span>Energy</span></div>
        <div class="depth-stat"><b>${rareChance.toFixed(1)}%</b><span>Rare+</span></div>
        <div class="depth-stat"><b>${legendChance.toFixed(1)}%</b><span>Legend</span></div>
      </div>
    </div>
    <div class="energy-bar-wrap">
      <span>\u26A1</span>
      <div class="energy-bar"><div class="energy-fill" style="width:${(energy/maxEnergy*100)}%"></div></div>
      <div class="energy-text">${energy}/${maxEnergy}</div>
      <button class="energy-buy" onclick="window.game.buyEnergy()" ${gameState.get('player.coins') < 50 || energy >= maxEnergy ? 'disabled' : ''}>+20\u26A1 50\u{1F4B0}</button>
    </div>
    <button class="cast-btn" id="castBtn" onclick="window.game.cast()" ${!canFish ? 'disabled' : ''}>
      ${castLabel}
      ${isFishing ? '<div class="cast-progress" style="width:' + fishingEngine.progress + '%"></div>' : ''}
    </button>
    <div class="equip-row">
      <div class="equip-slot" onclick="window.game.openShop('rods')">
        <div class="equip-icon">${rodData.icon}</div>
        <div class="equip-name">${rodData.name}</div>
        <div class="equip-stat">${rod.durability}/${rod.maxDurability}</div>
      </div>
      <div class="equip-slot" onclick="window.game.openShop('baits')">
        <div class="equip-icon">${baitData.icon}</div>
        <div class="equip-name">${baitData.name}</div>
        <div class="equip-stat ${bait.id === 'none' ? 'warn' : ''}">${bait.id === 'none' ? 'Opsional' : 'x' + bait.count}</div>
      </div>
      <div class="equip-slot" onclick="window.game.openInventory()">
        <div class="equip-icon">\u{1F392}</div>
        <div class="equip-name">Inventory</div>
        <div class="equip-stat">${inventory.length}</div>
      </div>
    </div>
  `;
}
