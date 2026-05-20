// Modals.js - Modal system (menu, shop, inventory, quests, achievements, breeding)
import gameState from '../systems/state.js';
import { RODS, BAITS, SPECIES } from '../data/fish.js';
import { ACHIEVEMENTS } from '../systems/quests.js';
import { renderFishCard, renderFishImage } from './FishRenderer.js';
import { getFishSprite } from '../utils/sprites.js';

export function renderModals() {}

export function openModal(title, content) {
  const bg = document.getElementById('modalBg');
  if (!bg) return;
  bg.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <div class="modal-title">${title}</div>
        <button class="modal-close" onclick="window.game.closeModal()">\u2715</button>
      </div>
      <div class="modal-body">${content}</div>
    </div>
  `;
  bg.classList.add('show');
  bg.onclick = (e) => { if (e.target === bg) window.game.closeModal(); };
}

export function closeModal() {
  const bg = document.getElementById('modalBg');
  if (bg) bg.classList.remove('show');
}

export function renderMenu() {
  const inventory = gameState.get('inventory') || [];
  const quests = gameState.get('quests.daily') || [];
  const pendingQuests = quests.filter(q => q.completed && !q.claimed).length;

  openModal('\u2630 Menu', `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <div class="equip-slot" onclick="window.game.openInventory()">
        <div class="equip-icon">\u{1F392}</div>
        <div class="equip-name">Inventory</div>
        <div class="equip-stat">${inventory.length}</div>
      </div>
      <div class="equip-slot" onclick="window.game.openShop('rods')">
        <div class="equip-icon">\u{1F3EA}</div>
        <div class="equip-name">Shop</div>
      </div>
      <div class="equip-slot" onclick="window.game.openQuests()">
        <div class="equip-icon">\u{1F4DC}</div>
        <div class="equip-name">Quests</div>
        ${pendingQuests ? '<div class="equip-stat" style="color:var(--gold)">' + pendingQuests + '</div>' : ''}
      </div>
      <div class="equip-slot" onclick="window.game.openAchievements()">
        <div class="equip-icon">\u{1F3C6}</div>
        <div class="equip-name">Achievements</div>
      </div>
      <div class="equip-slot" onclick="window.game.openBreeding()">
        <div class="equip-icon">\u{1F9EC}</div>
        <div class="equip-name">Breeding</div>
      </div>
      <div class="equip-slot" onclick="window.game.openStats()">
        <div class="equip-icon">\u{1F4CA}</div>
        <div class="equip-name">Stats</div>
      </div>
      <div class="equip-slot" onclick="window.game.openCodex()">
        <div class="equip-icon">\u{1F4D6}</div>
        <div class="equip-name">Codex</div>
      </div>
      <div class="equip-slot" onclick="window.game.openSettings()">
        <div class="equip-icon">\u2699\uFE0F</div>
        <div class="equip-name">Settings</div>
      </div>
    </div>
  `);
}

export function renderShop(tab = 'rods') {
  const items = tab === 'rods' ? RODS : BAITS.filter(b => b.id !== 'none');
  const rod = gameState.get('equipment.rod');
  const level = gameState.get('player.level');
  const coins = gameState.get('player.coins');

  const itemsHtml = items.map(it => {
    const owned = tab === 'rods' && rod.id === it.id;
    const canBuy = (!it.level || level >= it.level) && coins >= it.price && !owned;
    const locked = it.level && level < it.level;
    return `
      <div style="background:rgba(0,0,0,.3);border-radius:12px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:12px;${locked ? 'opacity:0.5' : ''}">
        <div style="font-size:28px;width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border-radius:10px">${it.icon}</div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">${it.name}${locked ? ' \u{1F512}' : ''}</div>
          <div style="font-size:10px;color:var(--dim)">${tab === 'rods' ? 'Power: ' + it.power + 'x \u2022 Dur: ' + it.durability : 'Qual: ' + it.quality + 'x \u2022 x' + it.count}${it.level > 1 ? ' \u2022 Lv.' + it.level : ''}${it.rareBonus ? ' \u2022 +' + (it.rareBonus * 100) + '% rare' : ''}</div>
        </div>
        <button class="energy-buy" style="padding:8px 14px;font-size:11px;${owned ? 'background:rgba(255,255,255,.15)' : ''}" ${!canBuy ? 'disabled' : ''} onclick="window.game.buyItem('${tab}','${it.id}')">${owned ? '\u2713 Equipped' : locked ? '\u{1F512} Lv.' + it.level : it.price === 0 ? 'FREE' : it.price + '\u{1F4B0}'}</button>
      </div>
    `;
  }).join('');

  openModal('\u{1F3EA} Shop', `
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button class="energy-buy" style="flex:1;padding:10px;font-size:12px;${tab === 'rods' ? 'background:var(--success)' : ''}" onclick="window.game.openShop('rods')">\u{1F3A3} Rods</button>
      <button class="energy-buy" style="flex:1;padding:10px;font-size:12px;${tab === 'baits' ? 'background:var(--success)' : ''}" onclick="window.game.openShop('baits')">\u{1FAB1} Baits</button>
    </div>
    ${itemsHtml}
  `);
}

export function renderInventory() {
  const inventory = gameState.get('inventory') || [];
  if (!inventory.length) {
    openModal('\u{1F392} Inventory', '<div style="text-align:center;padding:36px;color:var(--dim)"><div style="font-size:56px;opacity:.4">\u{1F41F}</div><p>Belum ada ikan! Mulai mancing dulu.</p></div>');
    return;
  }

  const html = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">' +
    inventory.map((f, i) => renderFishCard(f, i, { showSell: true, showBreed: true })).join('') +
    '</div>';

  openModal('\u{1F392} Inventory (' + inventory.length + ')', html);
}

export function renderQuests() {
  const daily = gameState.get('quests.daily') || [];
  const weekly = gameState.get('quests.weekly') || [];

  const questHtml = (quests, period) => quests.map(q => {
    const pct = Math.min(100, (q.progress / q.target) * 100);
    const rewardText = Object.entries(q.reward).map(([k, v]) => {
      const icons = { coins: '\u{1F4B0}', gems: '\u{1F48E}', xp: '\u2B50' };
      return (icons[k] || '') + v;
    }).join(' ');

    return `
      <div style="background:rgba(0,0,0,.3);border-radius:12px;padding:12px;margin-bottom:8px;border-left:3px solid ${q.completed ? 'var(--success)' : q.claimed ? 'var(--dim)' : 'var(--gold)'}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:12px;font-weight:600">${q.name}</div>
            <div style="font-size:10px;color:var(--dim)">${q.desc}</div>
          </div>
          ${q.completed && !q.claimed ? '<button class="energy-buy" style="padding:6px 10px;font-size:10px;animation:pop .5s infinite" onclick="window.game.claimQuest(\'' + period + '\',\'' + q.id + '\')">\u{1F381} Claim!</button>' : ''}
          ${q.claimed ? '<span style="color:var(--success);font-size:14px">\u2713</span>' : ''}
        </div>
        <div style="margin-top:6px;display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;background:rgba(0,0,0,.5);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${q.completed ? 'var(--success)' : 'var(--gold)'};transition:width .3s"></div></div>
          <span style="font-size:10px;color:var(--dim)">${Math.min(q.progress, q.target)}/${q.target}</span>
        </div>
        <div style="font-size:9px;color:var(--gold);margin-top:4px">${rewardText}</div>
      </div>
    `;
  }).join('');

  openModal('\u{1F4DC} Quests', `
    <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--gold)">\u2600\uFE0F Daily Quests</div>
    ${questHtml(daily, 'daily') || '<div style="color:var(--dim);font-size:11px;padding:10px">Loading...</div>'}
    <div style="font-size:13px;font-weight:600;margin:12px 0 8px;color:var(--gem)">\u{1F4C5} Weekly Quests</div>
    ${questHtml(weekly, 'weekly') || '<div style="color:var(--dim);font-size:11px;padding:10px">Loading...</div>'}
  `);
}

export function renderAchievements() {
  const unlocked = gameState.get('achievements') || [];
  const progress = window.game.achievements.getProgress();

  const html = ACHIEVEMENTS.map(a => {
    const done = unlocked.includes(a.id);
    const rewardText = Object.entries(a.reward).map(([k, v]) => {
      const icons = { coins: '\u{1F4B0}', gems: '\u{1F48E}', xp: '\u2B50' };
      return (icons[k] || '') + v;
    }).join(' ');

    return `
      <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:10px;margin-bottom:6px;display:flex;align-items:center;gap:10px;opacity:${done ? 1 : 0.5};${done ? 'border:1px solid var(--success)' : ''}">
        <div style="font-size:24px;min-width:32px;text-align:center">${done ? a.icon : '\u{1F512}'}</div>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:600">${a.name}</div>
          <div style="font-size:9px;color:var(--dim)">${a.desc}</div>
          <div style="font-size:8px;color:var(--gold);margin-top:2px">${rewardText}</div>
        </div>
        ${done ? '<span style="color:var(--success);font-size:16px">\u2713</span>' : ''}
      </div>
    `;
  }).join('');

  openModal(`\u{1F3C6} Achievements (${progress.unlocked}/${progress.total})`, `
    <div style="background:rgba(0,217,165,.1);border-radius:10px;padding:10px;margin-bottom:12px;text-align:center">
      <div style="font-size:11px;color:var(--dim)">Progress</div>
      <div style="height:8px;background:rgba(0,0,0,.5);border-radius:4px;margin-top:6px;overflow:hidden">
        <div style="height:100%;width:${(progress.unlocked/progress.total*100)}%;background:var(--success)"></div>
      </div>
      <div style="font-size:10px;margin-top:4px;color:var(--success)">${progress.unlocked}/${progress.total} (${Math.round(progress.unlocked/progress.total*100)}%)</div>
    </div>
    ${html}
  `);
}

export function renderStats() {
  const stats = gameState.get('stats');
  const level = gameState.get('player.level');
  const xp = gameState.get('player.xp');
  const needed = level * 150 + 50;
  const coins = gameState.get('player.coins');

  openModal('\u{1F4CA} Stats', `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${level}</div>
        <div style="font-size:10px;color:var(--dim)">Level</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:18px;font-weight:700;color:var(--success)">${xp}/${needed}</div>
        <div style="font-size:10px;color:var(--dim)">XP</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${stats.totalCaught}</div>
        <div style="font-size:10px;color:var(--dim)">Total Caught</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--rare)">${stats.rareCaught}</div>
        <div style="font-size:10px;color:var(--dim)">Rare+ Caught</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--gem)">${stats.totalBred}</div>
        <div style="font-size:10px;color:var(--dim)">Bred</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--gold)">${stats.biggestFish}kg</div>
        <div style="font-size:10px;color:var(--dim)">Biggest Fish</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--gold)">${coins.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--dim)">Coins</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--gold)">${stats.totalCoinsEarned.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--dim)">Total Earned</div>
      </div>
    </div>
  `);
}

export function renderCodex() {
  const inventory = gameState.get('inventory') || [];
  const discovered = [...new Set(inventory.map(f => f.id))];
  const allFish = Object.entries(SPECIES);

  const html = allFish.map(([id, fish]) => {
    const found = discovered.includes(id);
    return `
      <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:8px;display:flex;align-items:center;gap:8px;margin-bottom:4px;opacity:${found ? 1 : 0.4}">
        <div style="width:32px;text-align:center">${found ? renderFishImage(id, 32) : '\u2753'}</div>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:600">${found ? fish.name : '???'}</div>
          <div style="font-size:9px;color:var(--dim)">${fish.rarity}${found ? ' \u2022 ' + fish.weight[0] + '-' + fish.weight[1] + 'kg' : ''}</div>
        </div>
        ${found ? '<span style="color:var(--success);font-size:12px">\u2713</span>' : ''}
      </div>
    `;
  }).join('');

  openModal(`\u{1F4D6} Codex (${discovered.length}/${allFish.length})`, html);
}

export function renderSettings() {
  const settings = gameState.get('settings');

  openModal('\u2699\uFE0F Settings', `
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px">\u{1F50A} Sound Effects</span>
        <button class="energy-buy" style="padding:6px 12px;${settings.sound ? 'background:var(--success)' : 'background:#546e7a'}" onclick="window.game.toggleSetting('sound')">${settings.sound ? 'ON' : 'OFF'}</button>
      </div>
      <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px">\u{1F3B5} Music</span>
        <button class="energy-buy" style="padding:6px 12px;${settings.music ? 'background:var(--success)' : 'background:#546e7a'}" onclick="window.game.toggleSetting('music')">${settings.music ? 'ON' : 'OFF'}</button>
      </div>
      <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px">\u2728 Particles</span>
        <button class="energy-buy" style="padding:6px 12px;${settings.particles ? 'background:var(--success)' : 'background:#546e7a'}" onclick="window.game.toggleSetting('particles')">${settings.particles ? 'ON' : 'OFF'}</button>
      </div>
      <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px">\u{1F4F3} Vibration</span>
        <button class="energy-buy" style="padding:6px 12px;${settings.vibration ? 'background:var(--success)' : 'background:#546e7a'}" onclick="window.game.toggleSetting('vibration')">${settings.vibration ? 'ON' : 'OFF'}</button>
      </div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,.1);margin:8px 0">
      <div style="display:flex;gap:8px">
        <button class="energy-buy" style="flex:1;padding:10px;font-size:11px" onclick="window.game.exportSave()">\u{1F4BE} Export Save</button>
        <button class="energy-buy" style="flex:1;padding:10px;font-size:11px" onclick="window.game.importSave()">\u{1F4C2} Import Save</button>
      </div>
      <button class="energy-buy" style="padding:10px;font-size:11px;background:var(--accent)" onclick="if(confirm('Reset semua progress?'))window.game.resetGame()">\u{1F5D1}\uFE0F Reset Game</button>
    </div>
  `);
}
