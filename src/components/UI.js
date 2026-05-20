// UI.js - Bottom UI panel with fishing minigame
import gameState from '../systems/state.js';
import { fishingMinigame } from '../systems/fishing-minigame.js';
import { DEPTH_CONFIG, RODS, BAITS } from '../data/fish.js';

export function renderEnergyOverlay() {
  const el = document.getElementById('energyOverlay');
  if (!el) return;
  const energy = gameState.get('player.energy');
  const maxEnergy = gameState.get('player.maxEnergy');
  el.innerHTML = `
    <div class="energy-bar-wrap energy-overlay">
      <span>\u26A1</span>
      <div class="energy-bar"><div class="energy-fill" style="width:${(energy/maxEnergy*100)}%"></div></div>
      <div class="energy-text">${energy}/${maxEnergy}</div>
      <button class="energy-plus-btn" onclick="window.game.toggleEnergyMenu()">+</button>
    </div>
    <div class="energy-menu" id="energyMenu">
      <div class="energy-menu-title">\u26A1 Beli Energy</div>
      <button class="energy-menu-item" onclick="window.game.buyEnergy(20, 50)" ${gameState.get('player.coins') < 50 || energy >= maxEnergy ? 'disabled' : ''}>
        <span>+20 \u26A1</span><span class="energy-menu-price">50 \u{1F4B0}</span>
      </button>
      <button class="energy-menu-item" onclick="window.game.buyEnergy(50, 100)" ${gameState.get('player.coins') < 100 || energy >= maxEnergy ? 'disabled' : ''}>
        <span>+50 \u26A1</span><span class="energy-menu-price">100 \u{1F4B0}</span>
      </button>
      <button class="energy-menu-item" onclick="window.game.buyEnergy(100, 180)" ${gameState.get('player.coins') < 180 || energy >= maxEnergy ? 'disabled' : ''}>
        <span>+100 \u26A1</span><span class="energy-menu-price">180 \u{1F4B0}</span>
      </button>
    </div>
  `;
}

export function renderUI() {
  const panel = document.getElementById('uiPanel');
  if (!panel) return;

  const depth = fishingMinigame.depth;
  const config = DEPTH_CONFIG[depth];
  const energy = gameState.get('player.energy');
  const maxEnergy = gameState.get('player.maxEnergy');
  const rod = gameState.get('equipment.rod');
  const bait = gameState.get('equipment.bait');
  const rodData = RODS.find(r => r.id === rod.id) || RODS[0];
  const baitData = BAITS.find(b => b.id === bait.id) || BAITS[0];
  const inventory = gameState.get('inventory') || [];
  const phase = fishingMinigame.phase;

  const rareChance = config.chances.rare + config.chances.epic + config.chances.legendary + config.chances.mythic;
  const legendChance = config.chances.legendary + config.chances.mythic;
  const canCast = fishingMinigame.canCast();

  panel.innerHTML = `
    <div class="depth-control">
      <div class="depth-header"><b>\u{1F3AF} Kedalaman</b><span>${depth}m</span></div>
      <input type="range" class="depth-slider" id="depthSlider" min="1" max="5" value="${depth}" oninput="window.game.setDepth(+this.value)" ${phase !== 'idle' ? 'disabled' : ''}>
      <div class="depth-labels"><span>1m</span><span>2m</span><span>3m</span><span>4m</span><span>5m</span></div>
      <div class="depth-stats">
        <div class="depth-stat"><b>\u26A1${config.energy}</b><span>Energy</span></div>
        <div class="depth-stat"><b>${rareChance.toFixed(1)}%</b><span>Rare+</span></div>
        <div class="depth-stat"><b>${legendChance.toFixed(1)}%</b><span>Legend</span></div>
      </div>
    </div>
    <div class="energy-bar-wrap" id="energyBarInline" style="display:none">
      <span>\u26A1</span>
      <div class="energy-bar"><div class="energy-fill" style="width:${(energy/maxEnergy*100)}%"></div></div>
      <div class="energy-text">${energy}/${maxEnergy}</div>
      <button class="energy-buy" onclick="window.game.buyEnergy()" ${gameState.get('player.coins') < 50 || energy >= maxEnergy ? 'disabled' : ''}>+20\u26A1 50\u{1F4B0}</button>
    </div>
    <div id="fishingArea">
      ${renderFishingPhase(phase, canCast, config)}
    </div>
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

function renderFishingPhase(phase, canCast, config) {
  switch (phase) {
    case 'idle':
      return `<button class="cast-btn" onclick="window.game.cast()" ${!canCast ? 'disabled' : ''}>
        \u{1F3A3} LEMPAR (${config.energy}\u26A1)
      </button>`;
    
    case 'casting':
      return `<button class="cast-btn" disabled>
        \u{1F3A3} Melempar...
      </button>`;
    
    case 'waiting':
      return `<button class="cast-btn" disabled style="background:linear-gradient(135deg,#1565C0,#0D47A1);box-shadow:0 5px 0 #0A3A7A">
        \u{1F30A} Menunggu ikan...
      </button>`;
    
    case 'bite':
      return `<button class="cast-btn" onclick="window.game.hookFish()" style="background:linear-gradient(135deg,#FF6F00,#E65100);box-shadow:0 5px 0 #BF360C;animation:pop 0.3s infinite">
        \u{1F41F} TAP SEKARANG!
      </button>`;
    
    case 'reeling':
      return `
        <div style="background:rgba(0,0,0,.4);border-radius:14px;padding:14px;text-align:center">
          <div style="font-size:12px;font-weight:600;margin-bottom:8px" id="reelInfo">Tap di zona hijau!</div>
          <div id="timingBar" style="position:relative;height:30px;background:rgba(0,0,0,.5);border-radius:15px;overflow:hidden;margin-bottom:10px">
            <div id="greenZone" style="position:absolute;height:100%;background:rgba(0,200,83,.4);border-radius:15px"></div>
            <div id="barCursor" style="position:absolute;top:2px;width:4px;height:26px;background:white;border-radius:2px;box-shadow:0 0 8px white;transition:none"></div>
          </div>
          <div id="reelRounds" style="font-size:11px;color:var(--dim);margin-bottom:8px"></div>
          <button class="cast-btn" onclick="window.game.reelTap()" style="padding:14px;font-size:16px">
            \u{1F3A3} TARIK!
          </button>
        </div>
      `;
    
    default:
      return `<button class="cast-btn" disabled>\u23F3...</button>`;
  }
}

// Update timing bar visuals (called from controller)
export function updateTimingBar(position, zoneStart, zoneSize, roundsDone, roundsTotal) {
  const cursor = document.getElementById('barCursor');
  const zone = document.getElementById('greenZone');
  const info = document.getElementById('reelInfo');
  const rounds = document.getElementById('reelRounds');
  
  if (cursor) cursor.style.left = position + '%';
  if (zone) {
    zone.style.left = zoneStart + '%';
    zone.style.width = zoneSize + '%';
  }
  if (info) {
    const inZone = position >= zoneStart && position <= (zoneStart + zoneSize);
    info.textContent = inZone ? '\u2705 SEKARANG!' : 'Tap di zona hijau!';
    info.style.color = inZone ? 'var(--success)' : 'var(--text)';
  }
  if (rounds && roundsTotal > 1) {
    rounds.textContent = '\u2B50 '.repeat(roundsDone) + '\u2B1C '.repeat(roundsTotal - roundsDone);
  }
}
