// Controller.js - Game actions connecting UI to systems
import gameState from '../systems/state.js';
import { fishingMinigame } from '../systems/fishing-minigame.js';
import { breedingSystem } from '../systems/breeding.js';
import { RODS, BAITS, SPECIES } from '../data/fish.js';
import { renderHeader } from '../components/Header.js';
import { renderUI, updateTimingBar } from '../components/UI.js';
import { renderScene } from '../components/Scene.js';
import { openModal, closeModal, renderMenu, renderShop, renderInventory, renderQuests, renderAchievements, renderStats, renderCodex, renderSettings } from '../components/Modals.js';
import { getFishSprite } from '../utils/sprites.js';
import { soundSystem } from './sound.js';

export function initController() {
  // Fishing minigame callbacks
  fishingMinigame.onPhaseChange = (phase) => {
    const rod = document.getElementById('rod');
    const line = document.getElementById('line');
    const bobber = document.getElementById('bobber');

    // Reset classes
    if (rod) rod.classList.remove('cast');
    if (line) line.classList.remove('active');
    if (bobber) bobber.classList.remove('bite');

    switch (phase) {
      case 'casting':
        if (rod) rod.classList.add('cast');
        soundSystem.cast();
        break;
      case 'waiting':
        if (line) line.classList.add('active');
        break;
      case 'bite':
        if (bobber) bobber.classList.add('bite');
        if (gameState.get('settings.vibration') && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        break;
      case 'idle':
        // All classes already removed above
        break;
    }

    renderUI();
  };

  fishingMinigame.onBarUpdate = (position, zoneStart, zoneSize, roundsDone, roundsTotal) => {
    updateTimingBar(position, zoneStart, zoneSize, roundsDone, roundsTotal);
  };

  fishingMinigame.onCatch = (result) => {
    resetFishingUI();
    showCatchPopup(result);
    soundSystem.splash();
    soundSystem.catchFish(result.rarity);

    // Particles
    if (window.game.particles && gameState.get('settings.particles')) {
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

    // Vibration
    if (gameState.get('settings.vibration') && navigator.vibrate) {
      const patterns = { common: [50], uncommon: [50, 30, 50], rare: [100, 50, 100], epic: [150, 50, 150, 50, 150], legendary: [200, 100, 200, 100, 200], mythic: [300, 100, 300, 100, 300, 100, 300] };
      navigator.vibrate(patterns[result.rarity] || [50]);
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
    if (fishingMinigame.depth >= 3) {
      window.game.updateQuests('depth_fish', 1);
    }

    // Check achievements
    window.game.checkAchievements('catch', gameState.get('stats.totalCaught'));
    window.game.checkAchievements('catch_rarity', result.rarity);
    window.game.checkAchievements('coins', gameState.get('player.coins'));
    window.game.checkAchievements('weight', result.fish.weight);

    // Weather achievement
    const weather = gameState.get('weather.current');
    if (weather === 'storm') {
      window.game.checkAchievements('weather_fish', 'storm');
    }
  };

  fishingMinigame.onEscape = (result) => {
    resetFishingUI();
    showEscapePopup(result);
    soundSystem.escape();
  };

  // === Expose game methods ===
  window.game.cast = () => fishingMinigame.cast();
  window.game.hookFish = () => fishingMinigame.hookFish();
  window.game.reelTap = () => fishingMinigame.reelTap();

  window.game.setDepth = (depth) => {
    fishingMinigame.setDepth(depth);
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
  window.game.openStats = () => renderStats();
  window.game.openCodex = () => renderCodex();
  window.game.openSettings = () => renderSettings();

  window.game.openBreeding = () => {
    const inventory = gameState.get('inventory') || [];
    const breedable = inventory.filter(f => f.breedable && (f.breedCount || 0) < 5);

    if (breedable.length < 2) {
      openModal('\u{1F9EC} Breeding', '<div style="text-align:center;padding:20px;color:var(--dim)"><div style="font-size:48px;margin-bottom:12px">\u{1F9EC}</div><p>Butuh minimal 2 ikan breedable.<br>Mancing dulu!</p></div>');
      return;
    }

    const html = `
      <div style="text-align:center;margin-bottom:16px">
        <p style="font-size:12px;color:var(--dim)">Pilih 2 ikan untuk breeding. Cross-breed bisa menghasilkan hybrid unik!</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
        ${breedable.map((f, i) => {
          const realIdx = inventory.indexOf(f);
          const sprite = getFishSprite(f.id);
          return `
            <div style="background:rgba(0,0,0,.3);border-radius:12px;padding:10px;text-align:center;cursor:pointer;border:2px solid rgba(156,39,176,.3)" onclick="window.game.selectBreed(${realIdx})">
              <img src="${sprite}" style="width:40px;height:25px;image-rendering:pixelated">
              <div style="font-size:10px;font-weight:600;margin-top:4px">${f.name}</div>
              <div style="font-size:8px;color:var(--dim)">${f.rarity} \u2022 Breed: ${f.breedCount || 0}/5</div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="margin-top:16px;padding:12px;background:rgba(0,188,212,.1);border-radius:10px;border:1px solid rgba(0,188,212,.3)">
        <div style="font-weight:700;font-size:12px;color:#00bcd4;margin-bottom:8px">\u{1F9EC} Breeding Info</div>
        <div style="font-size:10px;color:var(--dim);line-height:1.6">
          \u2022 15% chance upgrade rarity<br>
          \u2022 20% chance mutation bonus<br>
          \u2022 30% chance hybrid (kombinasi cocok)<br>
          \u2022 Max 5x breed per ikan
        </div>
      </div>
    `;
    openModal('\u{1F9EC} Breeding Lab', html);
  };

  window.game.selectBreed = (index) => {
    if (!breedingSystem.parent1) {
      breedingSystem.setParent(1, index);
      window.game.showToast('\u{1F9EC} Pilih ikan ke-2', 'info');
      window.game.openBreeding();
    } else if (breedingSystem.parent1.index === index) {
      window.game.showToast('Pilih ikan yang berbeda!', 'error');
    } else {
      breedingSystem.setParent(2, index);
      // Show breed confirmation
      const cost = breedingSystem.getBreedCost();
      const p1 = breedingSystem.parent1;
      const p2 = breedingSystem.parent2;
      openModal('\u{1F9EC} Breeding', `
        <div style="text-align:center">
          <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin:20px 0">
            <div><img src="${getFishSprite(p1.id)}" style="width:48px;height:30px;image-rendering:pixelated"><div style="font-size:10px;margin-top:4px">${p1.name}</div></div>
            <div style="font-size:24px;color:var(--gem)">\u2764\uFE0F</div>
            <div><img src="${getFishSprite(p2.id)}" style="width:48px;height:30px;image-rendering:pixelated"><div style="font-size:10px;margin-top:4px">${p2.name}</div></div>
          </div>
          <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:12px;margin-bottom:16px">
            <div style="font-size:12px;color:var(--dim)">Biaya Breeding</div>
            <div style="font-size:24px;font-weight:700;color:var(--gold)">${cost} \u{1F4B0}</div>
          </div>
          <button class="energy-buy" style="padding:14px 36px;font-size:14px;background:linear-gradient(135deg,#ab47bc,#8e24aa)" onclick="window.game.startBreed()" ${gameState.get('player.coins') < cost ? 'disabled' : ''}>\u{1F9EC} Mulai Breeding</button>
          <br><button class="energy-buy" style="margin-top:10px;padding:8px 20px;font-size:11px;background:var(--accent)" onclick="window.game.cancelBreed()">\u2715 Batal</button>
        </div>
      `);
    }
  };

  window.game.startBreed = () => {
    if (!breedingSystem.canBreed()) {
      window.game.showToast('\u{1F4B0} Coins kurang!', 'error');
      return;
    }

    breedingSystem.onTimerTick = (timer) => {
      const el = document.querySelector('.breed-timer-val');
      if (el) el.textContent = timer + 's';
    };

    breedingSystem.onComplete = (offspring) => {
      window.game.updateQuests('breed', 1);
      window.game.checkAchievements('breed', gameState.get('stats.totalBred'));
      if (offspring.hybrid) window.game.checkAchievements('hybrid', 1);
      if (offspring.mutation) window.game.checkAchievements('mutation', 1);

      // Show result
      const sprite = getFishSprite(offspring.id);
      openModal('\u{1F389} Breeding Sukses!', `
        <div style="text-align:center">
          <div style="font-family:'Pixelify Sans';font-size:22px;margin-bottom:16px">${offspring.hybrid ? '\u2728 HYBRID BARU!' : offspring.mutation ? '\u{1F9EC} MUTASI!' : '\u{1F423} Ikan Baru!'}</div>
          <img src="${sprite}" style="width:80px;height:50px;image-rendering:pixelated">
          <div style="font-size:18px;font-weight:700;margin-top:12px">${offspring.name}</div>
          <div style="display:inline-block;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:700;text-transform:uppercase;margin-top:8px;background:${offspring.hybrid ? '#00bcd4' : 'var(--success)'}">${offspring.hybrid ? 'HYBRID' : offspring.rarity}</div>
          <div style="margin-top:12px;font-size:13px;color:var(--dim)">${offspring.weight}kg \u2022 \u{1F4B0}${offspring.value} \u2022 \u2B50${offspring.xp}</div>
          ${offspring.mutation ? '<div style="margin-top:8px;font-size:11px;color:#ff6b6b">\u2728 Mutasi: ' + offspring.mutation.name + '</div>' : ''}
          ${offspring.parents ? '<div style="margin-top:8px;font-size:10px;color:var(--dim)">Parents: ' + offspring.parents.join(' + ') + '</div>' : ''}
          <button class="energy-buy" style="margin-top:20px;padding:14px 40px;font-size:14px;background:var(--success)" onclick="window.game.closeModal()">\u{1F44D} Keren!</button>
        </div>
      `);

      if (window.game.particles && gameState.get('settings.particles')) {
        const scene = document.getElementById('scene');
        window.game.particles.sparkle(scene.offsetWidth / 2, scene.offsetHeight / 2, '#9c27b0');
      }

      renderHeader();
      renderUI();
    };

    breedingSystem.startBreeding();
    window.game.showToast('\u{1F95A} Breeding dimulai!', 'success');

    // Show timer
    openModal('\u{1F9EC} Breeding...', `
      <div style="text-align:center;padding:20px">
        <div style="font-size:48px;margin-bottom:12px">\u{1F95A}</div>
        <div style="font-weight:600">Breeding in progress...</div>
        <div class="breed-timer-val" style="font-size:36px;font-weight:700;color:var(--success);font-family:'Pixelify Sans';margin:12px 0">${breedingSystem.timer}s</div>
        <button class="energy-buy" style="padding:12px 24px;font-size:13px;background:linear-gradient(135deg,var(--gem),#aa00ff)" onclick="window.game.skipBreed()" ${gameState.get('player.gems') < 5 ? 'disabled' : ''}>\u26A1 Skip (5\u{1F48E})</button>
      </div>
    `);
  };

  window.game.cancelBreed = () => {
    breedingSystem.clearParents();
    closeModal();
  };

  window.game.skipBreed = () => {
    if (!breedingSystem.skipBreeding()) {
      window.game.showToast('\u{1F48E} Gems kurang!', 'error');
    }
  };

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
    soundSystem.coin();

    if (window.game.particles && gameState.get('settings.particles')) {
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

  window.game.toggleSetting = (key) => {
    const current = gameState.get('settings.' + key);
    gameState.set('settings.' + key, !current);
    renderSettings();
  };

  window.game.exportSave = () => {
    const data = gameState.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fishing-frenzy-save.json';
    a.click();
    URL.revokeObjectURL(url);
    window.game.showToast('\u{1F4BE} Save exported!', 'success');
  };

  window.game.importSave = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (gameState.import(ev.target.result)) {
          window.game.showToast('\u{1F4C2} Save imported!', 'success');
          closeModal();
          renderHeader();
          renderUI();
        } else {
          window.game.showToast('\u274C Invalid save file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  window.game.resetGame = () => {
    gameState.reset();
    closeModal();
    renderHeader();
    renderUI();
    window.game.showToast('\u{1F5D1}\uFE0F Game reset!', 'success');
  };
}

function resetFishingUI() {
  const line = document.getElementById('line');
  const bobber = document.getElementById('bobber');
  const rod = document.getElementById('rod');
  if (line) line.classList.remove('active');
  if (bobber) bobber.classList.remove('bite');
  if (rod) rod.classList.remove('cast');
  renderUI();
}

function showCatchPopup(result) {
  const popup = document.getElementById('catchPopup');
  if (!popup) return;

  const sprite = getFishSprite(result.fish.id);
  const rarityColors = {
    common: '#78909c', uncommon: '#66bb6a', rare: '#42a5f5',
    epic: '#ab47bc', legendary: '#ffb300', mythic: '#e91e63', hybrid: '#00bcd4'
  };

  popup.innerHTML = `
    <div class="catch-card" style="border-color:${rarityColors[result.rarity] || '#ffc107'};box-shadow:0 0 60px ${rarityColors[result.rarity] || '#ffc107'}40">
      <img src="${sprite}" style="width:80px;height:50px;image-rendering:pixelated;margin-bottom:12px">
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
