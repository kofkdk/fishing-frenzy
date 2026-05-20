// Fishing Engine - Core fishing mechanics
import { SPECIES, DEPTH_CONFIG, RODS, BAITS, WEATHER, GEM_CHANCES, GEM_AMOUNTS, MUTATIONS } from '../data/fish.js';
import gameState from './state.js';

export class FishingEngine {
  constructor() {
    this.isFishing = false;
    this.progress = 0;
    this.interval = null;
    this.currentDepth = 1;
    this.onProgress = null;
    this.onComplete = null;
    this.onEscape = null;
  }

  canFish() {
    const depth = this.currentDepth;
    const config = DEPTH_CONFIG[depth];
    const energy = gameState.get('player.energy');
    const rod = gameState.get('equipment.rod');
    return energy >= config.energy && rod.durability > 0 && !this.isFishing;
  }

  getEnergyCost() {
    const config = DEPTH_CONFIG[this.currentDepth];
    const weather = this.getCurrentWeather();
    const multiplier = weather.energyCost || 1;
    return Math.ceil(config.energy * multiplier);
  }

  getCurrentWeather() {
    const weatherId = gameState.get('weather.current') || 'clear';
    return WEATHER[weatherId] || WEATHER.clear;
  }

  setDepth(depth) {
    this.currentDepth = Math.max(1, Math.min(5, depth));
  }

  startFishing() {
    if (!this.canFish()) return false;

    const energyCost = this.getEnergyCost();
    gameState.update('player.energy', e => e - energyCost);

    // Reduce rod durability
    const rod = gameState.get('equipment.rod');
    rod.durability--;
    gameState.set('equipment.rod', rod);

    // Consume bait
    const bait = gameState.get('equipment.bait');
    if (bait.id !== 'none' && bait.count > 0) {
      bait.count--;
      if (bait.count <= 0) {
        gameState.set('equipment.bait', { id: 'none', count: 999 });
      } else {
        gameState.set('equipment.bait', bait);
      }
    }

    this.isFishing = true;
    this.progress = 0;

    // Calculate fishing time based on rod power
    const rodData = RODS.find(r => r.id === rod.id) || RODS[0];
    const fishTime = Math.max(1000, 4000 - rodData.power * 100);
    const tickInterval = fishTime / 50;

    this.interval = setInterval(() => {
      this.progress += 2;
      if (this.onProgress) this.onProgress(this.progress);

      if (this.progress >= 100) {
        clearInterval(this.interval);
        this.interval = null;
        this.completeFishing();
      }
    }, tickInterval);

    return true;
  }

  completeFishing() {
    const result = this.rollFish();
    this.isFishing = false;
    this.progress = 0;

    if (result.escaped) {
      if (this.onEscape) this.onEscape(result);
      return result;
    }

    // Add to inventory
    const inventory = gameState.get('inventory') || [];
    inventory.push(result.fish);
    gameState.set('inventory', inventory);

    // Add rewards
    gameState.update('player.coins', c => c + result.fish.value);
    gameState.update('player.xp', x => x + result.fish.xp);

    // Gems
    if (result.gems > 0) {
      gameState.update('player.gems', g => g + result.gems);
    }

    // Stats
    gameState.update('stats.totalCaught', n => n + 1);
    gameState.update('stats.totalCoinsEarned', n => n + result.fish.value);
    if (['rare', 'epic', 'legendary', 'mythic'].includes(result.fish.rarity)) {
      gameState.update('stats.rareCaught', n => n + 1);
    }
    if (result.fish.weight > gameState.get('stats.biggestFish')) {
      gameState.set('stats.biggestFish', result.fish.weight);
    }

    if (this.onComplete) this.onComplete(result);
    return result;
  }

  rollFish() {
    const depth = this.currentDepth;
    const config = DEPTH_CONFIG[depth];
    const weather = this.getCurrentWeather();
    const baitData = this.getBaitData();
    const rodData = this.getRodData();

    // Roll rarity
    const rareBonus = (baitData.rareBonus || 0) + (weather.rareBonus || 0);
    const chances = { ...config.chances };

    // Apply rare bonus (boost rare+ chances)
    if (rareBonus > 0) {
      const boost = rareBonus * 100;
      chances.common = Math.max(10, chances.common - boost);
      chances.rare += boost * 0.4;
      chances.epic += boost * 0.3;
      chances.legendary += boost * 0.2;
      chances.mythic += boost * 0.1;
    }

    const rarity = this.rollRarity(chances);

    // Get fish pool for this rarity
    const pool = Object.entries(SPECIES)
      .filter(([_, s]) => s.rarity === rarity)
      .map(([id, s]) => ({ id, ...s }));

    if (pool.length === 0) return { escaped: true, reason: 'no_fish' };

    const base = pool[Math.floor(Math.random() * pool.length)];

    // Catch chance (can escape)
    const catchDifficulty = { common: 0.85, uncommon: 0.75, rare: 0.6, epic: 0.45, legendary: 0.3, mythic: 0.2 };
    let catchChance = (catchDifficulty[rarity] || 0.5) + rodData.power * 0.015 + (baitData.catchBonus || 0);
    catchChance = Math.min(0.95, catchChance);

    if (Math.random() > catchChance) {
      return { escaped: true, fish: { name: base.name, rarity, sprite: base.sprite } };
    }

    // Generate caught fish
    const [minW, maxW] = base.weight;
    const weight = +(minW + Math.random() * (maxW - minW)).toFixed(2);

    const fish = {
      uid: Date.now() + Math.random(),
      id: base.id,
      name: base.name,
      rarity,
      value: base.value,
      xp: base.xp,
      weight,
      sprite: base.sprite,
      breedable: base.breedable || false,
      breedCount: 0,
      caughtAt: Date.now(),
      mutation: null
    };

    // Mutation chance (5%)
    if (Math.random() < 0.05) {
      const mut = MUTATIONS[Math.floor(Math.random() * MUTATIONS.length)];
      fish.mutation = mut;
      if (mut.effect === 'weight') fish.weight = +(fish.weight * mut.multiplier).toFixed(2);
      if (mut.effect === 'value') fish.value = Math.floor(fish.value * mut.multiplier);
      if (mut.effect === 'xp') fish.xp = Math.floor(fish.xp * mut.multiplier);
    }

    // Gem drop
    let gems = 0;
    if (Math.random() < (GEM_CHANCES[rarity] || 0)) {
      gems = GEM_AMOUNTS[rarity] || 1;
    }

    return { escaped: false, fish, gems, rarity };
  }

  rollRarity(chances) {
    const roll = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(chances)) {
      cumulative += chance;
      if (roll < cumulative) return rarity;
    }
    return 'common';
  }

  getBaitData() {
    const bait = gameState.get('equipment.bait');
    return BAITS.find(b => b.id === bait.id) || BAITS[0];
  }

  getRodData() {
    const rod = gameState.get('equipment.rod');
    return RODS.find(r => r.id === rod.id) || RODS[0];
  }

  cancelFishing() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isFishing = false;
    this.progress = 0;
  }
}

export const fishingEngine = new FishingEngine();
export default fishingEngine;
