// Modals.js - Modal system (menu, shop, inventory, quests, achievements, breeding)
import gameState from '../systems/state.js';
import { RODS, BAITS } from '../data/fish.js';
import { ACHIEVEMENTS } from '../systems/quests.js';

export function renderModals() {
  // Modals are rendered on-demand via window.game methods
}

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
    return `
      <div style="background:rgba(0,0,0,.3);border-radius:12px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:12px">
        <div style="font-size:28px;width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border-radius:10px">${it.icon}</div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">${it.name}</div>
          <div style="font-size:10px;color:var(--dim)">${tab === 'rods' ? 'Power: ' + it.power + 'x \u2022 Dur: ' + it.durability : 'Qual: ' + it.quality + 'x \u2022 x' + it.count}${it.level > 1 ? ' \u2022 Lv.' + it.level : ''}${it.rareBonus ? ' \u2022 +' + (it.rareBonus * 100) + '% rare' : ''}</div>
        </div>
        <button class="energy-buy" style="padding:8px 14px;font-size:11px" ${!canBuy ? 'disabled' : ''} onclick="window.game.buyItem('${tab}','${it.id}')">${owned ? '\u2713' : it.price === 0 ? 'FREE' : it.price + '\u{1F4B0}'}</button>
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
    openModal('\u{1F392} Inventory', '<div style="text-align:center;padding:36px;color:var(--dim)"><div style="font-size:56px;opacity:.4">\u{1F41F}</div><p>Belum ada ikan!</p></div>');
    return;
  }

  const html = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">' + inventory.map((f, i) => {
    const rarityColor = { common: '#78909c', uncommon: '#66bb6a', rare: '#42a5f5', epic: '#ab47bc', legendary: '#ffb300', mythic: '#e91e63', hybrid: '#00bcd4' };
    const sellValue = Math.floor(f.value * (1 + f.weight / 10));
    return `
      <div style="background:rgba(0,0,0,.3);border-radius:12px;padding:10px;text-align:center;border:2px solid ${rarityColor[f.rarity] || '#78909c'}">
        <div style="font-size:32px;margin-bottom:4px">\u{1F41F}</div>
        <div style="font-size:11px;font-weight:600">${f.name}</div>
        <div style="font-size:9px;color:var(--dim)">${f.weight}kg \u2022 ${f.rarity}${f.hybrid ? ' \u2022 \u{1F9EC}' : ''}</div>
        ${f.mutation ? '<div style="font-size:8px;padding:2px 5px;background:rgba(255,107,107,.3);color:#ff6b6b;border-radius:4px;display:inline-block;margin-top:4px">\u2728 ' + f.mutation.name + '</div>' : ''}
        <div style="margin-top:6px">
          <button class="energy-buy" style="padding:4px 8px;font-size:9px" onclick="window.game.sellFish(${i})">\u{1F4B0}${sellValue}</button>
        </div>
      </div>
    `;
  }).join('') + '</div>';

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
      <div style="background:rgba(0,0,0,.3);border-radius:12px;padding:12px;margin-bottom:8px;border-left:3px solid ${q.completed ? 'var(--success)' : 'var(--dim)'}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:12px;font-weight:600">${q.name}</div>
            <div style="font-size:10px;color:var(--dim)">${q.desc}</div>
          </div>
          ${q.completed && !q.claimed ? '<button class="energy-buy" style="padding:6px 10px;font-size:10px" onclick="window.game.claimQuest(\'' + period + '\',\'' + q.id + '\')">Claim!</button>' : ''}
          ${q.claimed ? '<span style="color:var(--success);font-size:11px">\u2713</span>' : ''}
        </div>
        <div style="margin-top:6px;display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;background:rgba(0,0,0,.5);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:var(--success);transition:width .3s"></div></div>
          <span style="font-size:10px;color:var(--dim)">${q.progress}/${q.target}</span>
        </div>
        <div style="font-size:9px;color:var(--gold);margin-top:4px">${rewardText}</div>
      </div>
    `;
  }).join('');

  openModal('\u{1F4DC} Quests', `
    <div style="font-size:13px;font-weight:600;margin-bottom:8px">\u2600\uFE0F Daily</div>
    ${questHtml(daily, 'daily') || '<div style="color:var(--dim);font-size:11px">No quests</div>'}
    <div style="font-size:13px;font-weight:600;margin:12px 0 8px">\u{1F4C5} Weekly</div>
    ${questHtml(weekly, 'weekly') || '<div style="color:var(--dim);font-size:11px">No quests</div>'}
  `);
}

export function renderAchievements() {
  const unlocked = gameState.get('achievements') || [];
  const html = ACHIEVEMENTS.map(a => {
    const done = unlocked.includes(a.id);
    return `
      <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:10px;margin-bottom:6px;display:flex;align-items:center;gap:10px;opacity:${done ? 1 : 0.5}">
        <div style="font-size:24px">${done ? a.icon : '\u{1F512}'}</div>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:600">${a.name}</div>
          <div style="font-size:9px;color:var(--dim)">${a.desc}</div>
        </div>
        ${done ? '<span style="color:var(--success)">\u2713</span>' : ''}
      </div>
    `;
  }).join('');

  const progress = window.game.achievements.getProgress();
  openModal(`\u{1F3C6} Achievements (${progress.unlocked}/${progress.total})`, html);
}

export function renderStats() {
  const stats = gameState.get('stats');
  const level = gameState.get('player.level');
  const xp = gameState.get('player.xp');
  const needed = level * 150 + 50;

  openModal('\u{1F4CA} Stats', `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${level}</div>
        <div style="font-size:10px;color:var(--dim)">Level</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${xp}/${needed}</div>
        <div style="font-size:10px;color:var(--dim)">XP</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${stats.totalCaught}</div>
        <div style="font-size:10px;color:var(--dim)">Caught</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${stats.rareCaught}</div>
        <div style="font-size:10px;color:var(--dim)">Rare+</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${stats.totalBred}</div>
        <div style="font-size:10px;color:var(--dim)">Bred</div>
      </div>
      <div style="background:rgba(0,217,165,.1);border-radius:12px;padding:14px;text-align:center;border:1px solid rgba(0,217,165,.25)">
        <div style="font-family:'Pixelify Sans';font-size:26px;font-weight:700;color:var(--success)">${stats.biggestFish}kg</div>
        <div style="font-size:10px;color:var(--dim)">Biggest</div>
      </div>
    </div>
  `);
}
