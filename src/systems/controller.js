// Controller.js - Game actions connecting UI to systems
import gameState from '../systems/state.js';
import { fishingEngine } from '../systems/fishing.js';
import { breedingSystem } from '../systems/breeding.js';
import { RODS, BAITS } from '../data/fish.js';
import { renderHeader } from '../components/Header.js';
import { renderUI } from '../components/UI.js';
import { openModal, closeModal, renderMenu, renderShop, renderInventory, renderQuests, renderAchievements, renderStats } from '../components/Modals.js';

export function initController() {
  // Fishing callbacks
  fishingEngine.onProgress = (progress) => {
    const btn = document.getElementById('castBtn');
    if (btn) {
      btn.innerHTML = `\u23F3 ${progress}%<div class="cast-progress" style="width:${progress}%"></div>`;
    }
    if (progress >= 80) {
      const bobber = document.getElementById('bobber');
      if (bobber) bobber.classList.add('bite');
    }
  };

  fishingEngine.onComplete = (result) => {
    resetFishingUI();
    showCatchPopup(result);

    // Particles
    if (window.game.particles) {
      const scene = document.getElementById('scene');
      const cx = scene.offsetWidth / 2;
      const cy = scene.offsetHeight * 0.4;
      window.game.particles.splash(cx, cy);

      if (['rare', 'epic', 'legendary', 'mythic'].includes(result.rarity)) {
        window.game.particles.rareCatch(cx, cy, result.rarity);
      }
      if (result.gems > 0) {
        setTimeout(() => window.game.particles.gemBurst(cx, cy - 30), 500);
      }
    }

    // Update quests
    window.game.updateQuests('catch', 1);
    if (['rare', 'epic', 'legendary', 'mythic'].includes(result.rarity)) {
      window.game.updateQuests('catch_rare', 1);
    }
    if (['epic', 'legendary', 'mythic'].includes(result.rarity)) {
      window.game.updateQuests('catch_epic', 1);
    }
    window.game.updateQuests('earn_coins', result.fish.value);
    window.game.updateQuests('use_bait', 1);
    if (fishingEngine.currentDepth >= 3) {
      window.game.updateQuests('depth_fish', 1);
    }

    // Check achievements
    window.game.checkAchievements('catch', gameState.get('stats.totalCaught'));
    window.game.checkAchievements('catch_rarity', result.rarity);
    window.game.checkAchievements('coins', gameState.get('player.coins'));
    window.game.checkAchievements('weight', result.fish.weight);
  };

  fishingEngine.onEscape = (result) => {
    resetFishingUI();
    showEscapePopup(result);
  };

  // Expose game methods to window
  window.game.cast = () => {
    if (!fishingEngine.canFish()) return;
    fishingEngine.startFishing();

    // Animate rod
    const rod = document.getElementById('rod');
    const line = document.getElementById('line');
    if (rod) rod.classList.add('cast');
    setTimeout(() => {
      if (line) line.classList.add('active');
      if (rod) rod.classList.remove('cast');
    }, 400);

    renderUI();
  };

  window.game.setDepth = (depth) => {
    fishingEngine.setDepth(depth);
    renderUI();
  };

  window.game.buyEnergy = () => {
    const coins = gameState.get('player.coins');
    const energy = gameState.get('player.energy');
    const maxEnergy = gameState.get('player.maxEnergy');
    if (coins < 50 || energy >= maxEnergy) return;
    gameState.update('player.coins', c => c - 50);
    gameState.set('player.energy', Math.min(energy + 20, maxEnergy));
    window.game.showToast('\u26A1 +20 Energy!', 'success');
    renderHeader();
    renderUI();
  };

  window.game.openMenu = () => renderMenu();
  window.game.closeModal = () => closeModal();
  window.game.openShop = (tab) => renderShop(tab);
  window.game.openInventory = () => renderInventory();
  window.game.openQuests = () => renderQuests();
  window.game.openAchievements = () => renderAchievements();
  window.game.openBreeding = () => {
    // TODO: full breeding UI
    openModal('\u{1F9EC} Breeding', '<div style="text-align:center;padding:20px;color:var(--dim)">Pilih 2 ikan dari Inventory untuk breeding</div>');
  };
  window.game.openStats = () => renderStats();

  window.game.buyItem = (tab, id) => {
    const items = tab === 'rods' ? RODS : BAITS;
    const item = items.find(x => x.id === id);
    if (!item) return;

    const coins = gameState.get('player.coins');
    const level = gameState.get('player.level');
    if (coins < item.price) return window.game.showToast('\u{1F4B0} Coins kurang!', 'error');
    if (item.level && level < item.level) return window.game.showToast('\u{1F512} Level ' + item.level + ' needed', 'error');

    gameState.update('player.coins', c => c - item.price);

    if (tab === 'rods') {
      gameState.set('equipment.rod', { id: item.id, durability: item.durability, maxDurability: item.durability });
    } else {
      const bait = gameState.get('equipment.bait');
      if (bait.id === item.id) {
        bait.count += item.count;
        gameState.set('equipment.bait', bait);
      } else {
        gameState.set('equipment.bait', { id: item.id, count: item.count });
      }
    }

    window.game.showToast('\u2705 Bought ' + item.name + '!', 'success');
    renderHeader();
    renderUI();
    renderShop(tab);
  };

  window.game.sellFish = (index) => {
    const inventory = gameState.get('inventory') || [];
    const fish = inventory[index];
    if (!fish) return;

    const value = Math.floor(fish.value * (1 + fish.weight / 10));
    gameState.update('player.coins', c => c + value);
    inventory.splice(index, 1);
    gameState.set('inventory', inventory);
    gameState.update('stats.totalSold', n => n + 1);

    window.game.updateQuests('sell', 1);
    window.game.updateQuests('earn_coins', value);
    window.game.checkAchievements('coins', gameState.get('player.coins'));

    window.game.showToast('\u{1F4B0} +' + value + ' coins', 'success');

    if (window.game.particles) {
      window.game.particles.coinBurst(200, 300);
    }

    renderHeader();
    renderUI();
    renderInventory();
  };

  window.game.claimQuest = (period, questId) => {
    const reward = window.game.quests.claimReward(period, questId);
    if (reward) {
      const parts = [];
      if (reward.coins) parts.push('\u{1F4B0}' + reward.coins);
      if (reward.gems) parts.push('\u{1F48E}' + reward.gems);
      if (reward.xp) parts.push('\u2B50' + reward.xp);
      window.game.showToast('\u{1F381} ' + parts.join(' '), 'success');
      renderHeader();
      renderQuests();
    }
  };
}

function resetFishingUI() {
  const line = document.getElementById('line');
  const bobber = document.getElementById('bobber');
  if (line) line.classList.remove('active');
  if (bobber) bobber.classList.remove('bite');
  renderUI();
}

function showCatchPopup(result) {
  const popup = document.getElementById('catchPopup');
  if (!popup) return;

  const rarityColors = {
    common: '#78909c', uncommon: '#66bb6a', rare: '#42a5f5',
    epic: '#ab47bc', legendary: '#ffb300', mythic: '#e91e63', hybrid: '#00bcd4'
  };

  popup.innerHTML = `
    <div class="catch-card">
      <div style="font-size:60px;margin-bottom:12px">\u{1F41F}</div>
      <div style="display:inline-block;padding:6px 18px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;background:${rarityColors[result.rarity] || '#78909c'}">${result.rarity}</div>
      <div style="font-family:'Pixelify Sans';font-size:22px;font-weight:700;margin:10px 0">${result.fish.name}</div>
      <div style="font-size:15px;color:var(--dim);margin-bottom:14px">${result.fish.weight} kg</div>
      <div style="display:flex;justify-content:center;gap:20px">
        <div><b style="font-size:20px;color:var(--success);display:block">+${result.fish.value}</b><span style="font-size:10px;color:var(--dim)">Coins</span></div>
        <div><b style="font-size:20px;color:var(--success);display:block">+${result.fish.xp}</b><span style="font-size:10px;color:var(--dim)">XP</span></div>
        ${result.gems > 0 ? '<div><b style="font-size:20px;color:var(--gem);display:block">+' + result.gems + '</b><span style="font-size:10px;color:var(--dim)">Gems</span></div>' : ''}
      </div>
      ${result.fish.mutation ? '<div style="margin-top:10px;font-size:11px;color:#ff6b6b">\u2728 Mutasi: ' + result.fish.mutation.name + '</div>' : ''}
    </div>
  `;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 2500);
}

function showEscapePopup(result) {
  const popup = document.getElementById('catchPopup');
  if (!popup) return;

  popup.innerHTML = `
    <div class="catch-card escaped">
      <div style="font-size:60px;margin-bottom:12px">\u{1F4A8}</div>
      <div style="font-family:'Pixelify Sans';font-size:20px;font-weight:700;margin:10px 0">${result.fish?.name || 'Ikan'} kabur!</div>
      <div style="font-size:13px;color:var(--dim)">Coba lagi!</div>
    </div>
  `;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 2000);
}
