// FishingMinigame.js - Cast → Bite → Timing bar mechanic
import gameState from '../systems/state.js';
import { DEPTH_CONFIG, RODS, BAITS, WEATHER, GEM_CHANCES, GEM_AMOUNTS, MUTATIONS, SPECIES } from '../data/fish.js';

const PHASES = { IDLE: 'idle', CASTING: 'casting', WAITING: 'waiting', BITE: 'bite', REELING: 'reeling', RESULT: 'result' };

// Green zone sizes per rarity (percentage of bar width)
const ZONE_SIZES = {
  common: 45,
  uncommon: 38,
  rare: 30,
  epic: 22,
  legendary: 15,
  mythic: 10
};

// Number of successful taps needed
const REEL_ROUNDS = {
  common: 1,
  uncommon: 1,
  rare: 2,
  epic: 2,
  legendary: 3,
  mythic: 4
};

export class FishingMinigame {
  constructor() {
    this.phase = PHASES.IDLE;
    this.depth = 1;
    this.rolledFish = null;
    this.rolledRarity = null;
    
    // Timing bar state
    this.barPosition = 0; // 0-100
    this.barDirection = 1; // 1 or -1
    this.barSpeed = 2;
    this.greenZoneStart = 0;
    this.greenZoneSize = 40;
    this.roundsNeeded = 1;
    this.roundsCompleted = 0;
    this.animFrame = null;
    
    // Wait phase
    this.waitTimer = null;
    this.biteTimeout = null;
    
    // Callbacks
    this.onPhaseChange = null;
    this.onBarUpdate = null;
    this.onCatch = null;
    this.onEscape = null;
  }

  setDepth(d) {
    this.depth = Math.max(1, Math.min(5, d));
  }

  canCast() {
    const config = DEPTH_CONFIG[this.depth];
    const energy = gameState.get('player.energy');
    const rod = gameState.get('equipment.rod');
    return this.phase === PHASES.IDLE && energy >= config.energy && rod.durability > 0;
  }

  getEnergyCost() {
    const config = DEPTH_CONFIG[this.depth];
    const weatherId = gameState.get('weather.current') || 'clear';
    const weather = WEATHER[weatherId] || WEATHER.clear;
    return Math.ceil(config.energy * (weather.energyCost || 1));
  }

  // Phase 1: Cast
  cast() {
    if (!this.canCast()) return false;

    const energyCost = this.getEnergyCost();
    gameState.update('player.energy', e => e - energyCost);

    // Rod durability
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

    this.phase = PHASES.CASTING;
    if (this.onPhaseChange) this.onPhaseChange(this.phase);

    // After short cast animation, go to waiting
    setTimeout(() => {
      this.phase = PHASES.WAITING;
      if (this.onPhaseChange) this.onPhaseChange(this.phase);
      this.startWaiting();
    }, 800);

    return true;
  }

  // Phase 2: Wait for bite
  startWaiting() {
    // Pre-roll the fish now so we know difficulty
    this.rollFish();

    // Random wait time 2-5 seconds
    const waitTime = 2000 + Math.random() * 3000;
    
    this.biteTimeout = setTimeout(() => {
      this.phase = PHASES.BITE;
      if (this.onPhaseChange) this.onPhaseChange(this.phase);
      
      // Player has 2 seconds to tap, or fish escapes
      this.biteTimeout = setTimeout(() => {
        if (this.phase === PHASES.BITE) {
          this.escape('too_slow');
        }
      }, 2000);
    }, waitTime);
  }

  // Player taps during bite phase → start reeling
  hookFish() {
    if (this.phase !== PHASES.BITE) return;
    
    clearTimeout(this.biteTimeout);
    this.phase = PHASES.REELING;
    this.roundsCompleted = 0;
    this.setupTimingBar();
    if (this.onPhaseChange) this.onPhaseChange(this.phase);
    this.startTimingBar();
  }

  // Phase 3: Timing bar
  setupTimingBar() {
    const rarity = this.rolledRarity;
    this.greenZoneSize = ZONE_SIZES[rarity] || 40;
    this.roundsNeeded = REEL_ROUNDS[rarity] || 1;
    this.barPosition = 0;
    this.barDirection = 1;
    
    // Speed increases with rarity and rounds
    const baseSpeed = 1.5;
    const rarityBonus = { common: 0, uncommon: 0.3, rare: 0.6, epic: 1, legendary: 1.5, mythic: 2 };
    this.barSpeed = baseSpeed + (rarityBonus[rarity] || 0) + (this.roundsCompleted * 0.3);
    
    // Randomize green zone position
    this.greenZoneStart = 10 + Math.random() * (90 - this.greenZoneSize - 10);
  }

  startTimingBar() {
    const tick = () => {
      if (this.phase !== PHASES.REELING) return;
      
      this.barPosition += this.barSpeed * this.barDirection;
      
      // Bounce
      if (this.barPosition >= 100) {
        this.barPosition = 100;
        this.barDirection = -1;
      } else if (this.barPosition <= 0) {
        this.barPosition = 0;
        this.barDirection = 1;
      }
      
      if (this.onBarUpdate) this.onBarUpdate(this.barPosition, this.greenZoneStart, this.greenZoneSize, this.roundsCompleted, this.roundsNeeded);
      
      this.animFrame = requestAnimationFrame(tick);
    };
    this.animFrame = requestAnimationFrame(tick);
  }

  // Player taps during reeling → check if in green zone
  reelTap() {
    if (this.phase !== PHASES.REELING) return;

    const inZone = this.barPosition >= this.greenZoneStart && 
                   this.barPosition <= (this.greenZoneStart + this.greenZoneSize);

    if (inZone) {
      this.roundsCompleted++;
      
      if (this.roundsCompleted >= this.roundsNeeded) {
        // Caught!
        this.stopTimingBar();
        this.catchFish();
      } else {
        // Next round - harder
        this.stopTimingBar();
        setTimeout(() => {
          this.setupTimingBar();
          this.startTimingBar();
        }, 300);
      }
    } else {
      // Missed - fish escapes
      this.stopTimingBar();
      this.escape('missed');
    }
  }

  stopTimingBar() {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  // Roll fish (determines what we're catching)
  rollFish() {
    const config = DEPTH_CONFIG[this.depth];
    const bait = gameState.get('equipment.bait');
    const baitData = BAITS.find(b => b.id === bait.id) || BAITS[0];
    const weatherId = gameState.get('weather.current') || 'clear';
    const weather = WEATHER[weatherId] || WEATHER.clear;

    // Rarity roll with bonuses
    const rareBonus = (baitData.rareBonus || 0) + (weather.rareBonus || 0);
    const chances = { ...config.chances };
    
    if (rareBonus > 0) {
      const boost = rareBonus * 100;
      chances.common = Math.max(10, chances.common - boost);
      chances.rare += boost * 0.4;
      chances.epic += boost * 0.3;
      chances.legendary += boost * 0.2;
      chances.mythic += boost * 0.1;
    }

    // Roll rarity
    const roll = Math.random() * 100;
    let cumulative = 0;
    let rarity = 'common';
    for (const [r, chance] of Object.entries(chances)) {
      cumulative += chance;
      if (roll < cumulative) { rarity = r; break; }
    }

    // Pick species
    const pool = Object.entries(SPECIES).filter(([_, s]) => s.rarity === rarity).map(([id, s]) => ({ id, ...s }));
    const fish = pool[Math.floor(Math.random() * pool.length)];

    this.rolledRarity = rarity;
    this.rolledFish = fish;
  }

  // Successful catch
  catchFish() {
    const fish = this.rolledFish;
    const rarity = this.rolledRarity;
    const [minW, maxW] = fish.weight;
    const weight = +(minW + Math.random() * (maxW - minW)).toFixed(2);

    const caught = {
      uid: Date.now() + Math.random(),
      id: fish.id,
      name: fish.name,
      rarity,
      value: fish.value,
      xp: fish.xp,
      weight,
      sprite: fish.sprite,
      breedable: fish.breedable || false,
      breedCount: 0,
      caughtAt: Date.now(),
      mutation: null
    };

    // Mutation (5%)
    if (Math.random() < 0.05) {
      const mut = MUTATIONS[Math.floor(Math.random() * MUTATIONS.length)];
      caught.mutation = mut;
      if (mut.effect === 'weight') caught.weight = +(caught.weight * mut.multiplier).toFixed(2);
      if (mut.effect === 'value') caught.value = Math.floor(caught.value * mut.multiplier);
      if (mut.effect === 'xp') caught.xp = Math.floor(caught.xp * mut.multiplier);
    }

    // Gems
    let gems = 0;
    if (Math.random() < (GEM_CHANCES[rarity] || 0)) {
      gems = GEM_AMOUNTS[rarity] || 1;
    }

    // Add to inventory & stats
    const inventory = gameState.get('inventory') || [];
    inventory.push(caught);
    gameState.set('inventory', inventory);
    gameState.update('player.coins', c => c + caught.value);
    gameState.update('player.xp', x => x + caught.xp);
    if (gems > 0) gameState.update('player.gems', g => g + gems);
    gameState.update('stats.totalCaught', n => n + 1);
    gameState.update('stats.totalCoinsEarned', n => n + caught.value);
    if (['rare', 'epic', 'legendary', 'mythic'].includes(rarity)) {
      gameState.update('stats.rareCaught', n => n + 1);
    }
    if (caught.weight > gameState.get('stats.biggestFish')) {
      gameState.set('stats.biggestFish', caught.weight);
    }

    this.phase = PHASES.RESULT;
    if (this.onPhaseChange) this.onPhaseChange(this.phase);
    if (this.onCatch) this.onCatch({ fish: caught, gems, rarity });

    // Reset after delay
    setTimeout(() => this.reset(), 2500);
  }

  escape(reason) {
    this.stopTimingBar();
    clearTimeout(this.biteTimeout);
    
    this.phase = PHASES.RESULT;
    if (this.onPhaseChange) this.onPhaseChange(this.phase);
    if (this.onEscape) this.onEscape({ fish: this.rolledFish, reason });

    setTimeout(() => this.reset(), 2000);
  }

  reset() {
    this.phase = PHASES.IDLE;
    this.rolledFish = null;
    this.rolledRarity = null;
    this.roundsCompleted = 0;
    clearTimeout(this.biteTimeout);
    this.stopTimingBar();
    if (this.onPhaseChange) this.onPhaseChange(this.phase);
  }

  cancel() {
    this.stopTimingBar();
    clearTimeout(this.biteTimeout);
    this.reset();
  }
}

export const fishingMinigame = new FishingMinigame();
export default fishingMinigame;
