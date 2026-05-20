// Breeding System
import { SPECIES, HYBRIDS, MUTATIONS } from '../data/fish.js';
import gameState from './state.js';

const NAME_PREFIXES = ['Royal', 'Shadow', 'Crystal', 'Storm', 'Ancient', 'Golden', 'Silver', 'Mystic', 'Primal', 'Ember', 'Frost', 'Thunder', 'Celestial', 'Abyssal', 'Phantom', 'Radiant', 'Savage', 'Noble', 'Eternal', 'Crimson', 'Azure', 'Jade', 'Obsidian', 'Scarlet', 'Violet'];
const NAME_SUFFIXES = ['fin', 'scale', 'tail', 'wave', 'tide', 'reef', 'deep', 'coral', 'stream', 'pearl', 'fang', 'heart', 'spirit', 'soul', 'flash'];

export class BreedingSystem {
  constructor() {
    this.parent1 = null;
    this.parent2 = null;
    this.isBreeding = false;
    this.timer = 0;
    this.timerInterval = null;
    this.onTimerTick = null;
    this.onComplete = null;
  }

  setParent(slot, fishIndex) {
    const inventory = gameState.get('inventory') || [];
    const fish = inventory[fishIndex];
    if (!fish || !fish.breedable || (fish.breedCount || 0) >= 5) return false;

    if (slot === 1) this.parent1 = { ...fish, index: fishIndex };
    else this.parent2 = { ...fish, index: fishIndex };
    return true;
  }

  clearParents() {
    this.parent1 = null;
    this.parent2 = null;
  }

  getBreedCost() {
    if (!this.parent1 || !this.parent2) return 0;
    const rarityMultiplier = { common: 1, uncommon: 2, rare: 4, epic: 8, legendary: 16, mythic: 32 };
    const r1 = rarityMultiplier[this.parent1.rarity] || 1;
    const r2 = rarityMultiplier[this.parent2.rarity] || 1;
    return 100 * Math.max(r1, r2);
  }

  canBreed() {
    if (!this.parent1 || !this.parent2) return false;
    if (this.parent1.index === this.parent2.index) return false;
    if (this.isBreeding) return false;
    const cost = this.getBreedCost();
    return gameState.get('player.coins') >= cost;
  }

  startBreeding() {
    if (!this.canBreed()) return false;

    const cost = this.getBreedCost();
    gameState.update('player.coins', c => c - cost);

    // Increment breed counts
    const inventory = gameState.get('inventory');
    inventory[this.parent1.index].breedCount = (inventory[this.parent1.index].breedCount || 0) + 1;
    inventory[this.parent2.index].breedCount = (inventory[this.parent2.index].breedCount || 0) + 1;
    gameState.set('inventory', inventory);

    this.isBreeding = true;
    this.timer = 30;

    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.onTimerTick) this.onTimerTick(this.timer);
      if (this.timer <= 0) {
        this.completeBreeding();
      }
    }, 1000);

    return true;
  }

  skipBreeding() {
    if (!this.isBreeding) return false;
    if (gameState.get('player.gems') < 5) return false;

    gameState.update('player.gems', g => g - 5);
    this.completeBreeding();
    return true;
  }

  completeBreeding() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const offspring = this.generateOffspring();

    // Add to inventory
    const inventory = gameState.get('inventory') || [];
    inventory.push(offspring);
    gameState.set('inventory', inventory);

    // Stats
    gameState.update('stats.totalBred', n => n + 1);

    this.isBreeding = false;
    this.timer = 0;

    if (this.onComplete) this.onComplete(offspring);
    return offspring;
  }

  generateOffspring() {
    const p1 = this.parent1;
    const p2 = this.parent2;

    // Check for hybrid
    const key1 = `${p1.id}+${p2.id}`;
    const key2 = `${p2.id}+${p1.id}`;
    const hybrid = HYBRIDS[key1] || HYBRIDS[key2];

    if (hybrid && Math.random() < 0.3) {
      return {
        uid: Date.now() + Math.random(),
        id: hybrid.id,
        name: hybrid.name,
        rarity: 'hybrid',
        value: hybrid.value,
        xp: hybrid.xp,
        weight: +((p1.weight + p2.weight) / 2 * 1.2).toFixed(2),
        sprite: hybrid.sprite,
        breedable: true,
        breedCount: 0,
        hybrid: true,
        parents: [p1.name, p2.name],
        mutation: null,
        caughtAt: Date.now()
      };
    }

    // Normal offspring
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
    let rarity = Math.random() < 0.5 ? p1.rarity : p2.rarity;

    // 15% chance to upgrade rarity
    if (Math.random() < 0.15) {
      const idx = Math.max(rarities.indexOf(p1.rarity), rarities.indexOf(p2.rarity));
      if (idx < rarities.length - 1) rarity = rarities[idx + 1];
    }

    // Generate name
    const name = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)] +
      NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];

    const offspring = {
      uid: Date.now() + Math.random(),
      id: 'bred_' + Date.now(),
      name,
      rarity,
      value: Math.floor((p1.value + p2.value) / 2 * 1.3),
      xp: Math.floor((p1.xp + p2.xp) / 2 * 1.3),
      weight: +((p1.weight + p2.weight) / 2 * (0.8 + Math.random() * 0.4)).toFixed(2),
      sprite: Math.random() < 0.5 ? p1.sprite : p2.sprite,
      breedable: true,
      breedCount: 0,
      parents: [p1.name, p2.name],
      hybrid: false,
      mutation: null,
      caughtAt: Date.now()
    };

    // 20% mutation chance
    if (Math.random() < 0.2) {
      const mut = MUTATIONS[Math.floor(Math.random() * MUTATIONS.length)];
      offspring.mutation = mut;
      if (mut.effect === 'weight') offspring.weight = +(offspring.weight * mut.multiplier).toFixed(2);
      if (mut.effect === 'value') offspring.value = Math.floor(offspring.value * mut.multiplier);
      if (mut.effect === 'xp') offspring.xp = Math.floor(offspring.xp * mut.multiplier);
    }

    return offspring;
  }
}

export const breedingSystem = new BreedingSystem();
export default breedingSystem;
