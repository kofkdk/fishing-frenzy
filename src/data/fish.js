// Fish species database
export const SPECIES = {
  // Common (depth 1+)
  goldfish: { name: 'Ikan Mas', rarity: 'common', value: 15, xp: 8, weight: [0.3, 0.8], breedable: true, sprite: 'goldfish.png' },
  carp: { name: 'Karper', rarity: 'common', value: 20, xp: 10, weight: [0.5, 1.2], breedable: true, sprite: 'carp.png' },
  catfish: { name: 'Lele', rarity: 'common', value: 18, xp: 9, weight: [0.4, 1.0], breedable: true, sprite: 'catfish.png' },
  tilapia: { name: 'Nila', rarity: 'common', value: 12, xp: 7, weight: [0.2, 0.6], breedable: true, sprite: 'tilapia.png' },
  guppy: { name: 'Guppy', rarity: 'common', value: 10, xp: 5, weight: [0.05, 0.15], breedable: true, sprite: 'guppy.png' },

  // Uncommon (depth 1+, low chance)
  salmon: { name: 'Salmon', rarity: 'uncommon', value: 45, xp: 25, weight: [2, 5], breedable: true, sprite: 'salmon.png' },
  bass: { name: 'Bass', rarity: 'uncommon', value: 50, xp: 28, weight: [1.5, 4], breedable: true, sprite: 'bass.png' },
  trout: { name: 'Trout', rarity: 'uncommon', value: 48, xp: 26, weight: [1, 3], breedable: true, sprite: 'trout.png' },
  pike: { name: 'Pike', rarity: 'uncommon', value: 55, xp: 30, weight: [2, 6], breedable: true, sprite: 'pike.png' },

  // Rare (depth 2+)
  tuna: { name: 'Tuna', rarity: 'rare', value: 120, xp: 80, weight: [10, 30], breedable: true, nft: true, sprite: 'tuna.png' },
  marlin: { name: 'Marlin', rarity: 'rare', value: 150, xp: 100, weight: [15, 40], breedable: true, nft: true, sprite: 'marlin.png' },
  swordfish: { name: 'Swordfish', rarity: 'rare', value: 135, xp: 90, weight: [12, 35], breedable: true, nft: true, sprite: 'swordfish.png' },
  pufferfish: { name: 'Buntal', rarity: 'rare', value: 100, xp: 70, weight: [1, 5], breedable: true, sprite: 'pufferfish.png' },

  // Epic (depth 3+)
  shark: { name: 'Hiu', rarity: 'epic', value: 400, xp: 250, weight: [200, 800], breedable: true, nft: true, sprite: 'shark.png' },
  whale: { name: 'Paus', rarity: 'epic', value: 500, xp: 300, weight: [1000, 5000], breedable: false, nft: true, sprite: 'whale.png' },
  squid: { name: 'Cumi Raksasa', rarity: 'epic', value: 450, xp: 280, weight: [500, 2000], breedable: true, nft: true, sprite: 'squid.png' },
  manta: { name: 'Pari Manta', rarity: 'epic', value: 380, xp: 240, weight: [300, 1000], breedable: true, nft: true, sprite: 'manta.png' },

  // Legendary (depth 4+)
  dragon: { name: 'Naga Laut', rarity: 'legendary', value: 2000, xp: 1000, weight: [9999, 9999], breedable: true, nft: true, sprite: 'dragon.png' },
  kraken: { name: 'Kraken', rarity: 'legendary', value: 5000, xp: 2000, weight: [9999, 9999], breedable: false, nft: true, sprite: 'kraken.png' },
  phoenix: { name: 'Phoenix Fish', rarity: 'legendary', value: 4000, xp: 1800, weight: [9999, 9999], breedable: true, nft: true, sprite: 'phoenix.png' },
  leviathan: { name: 'Leviathan', rarity: 'legendary', value: 6000, xp: 2500, weight: [9999, 9999], breedable: false, nft: true, sprite: 'leviathan.png' },

  // Mythic (depth 5 only)
  cosmic: { name: 'Paus Kosmik', rarity: 'mythic', value: 10000, xp: 5000, weight: [9999, 9999], breedable: false, nft: true, sprite: 'cosmic.png' },
  ancient: { name: 'Ikan Purba', rarity: 'mythic', value: 15000, xp: 7000, weight: [9999, 9999], breedable: false, nft: true, sprite: 'ancient.png' }
};

// Rarity pools per depth
export const DEPTH_CONFIG = {
  1: { energy: 5, chances: { common: 90, uncommon: 8, rare: 2, epic: 0, legendary: 0, mythic: 0 } },
  2: { energy: 10, chances: { common: 82, uncommon: 14, rare: 3.5, epic: 0.5, legendary: 0, mythic: 0 } },
  3: { energy: 20, chances: { common: 70, uncommon: 22, rare: 6, epic: 1.8, legendary: 0.2, mythic: 0 } },
  4: { energy: 35, chances: { common: 55, uncommon: 28, rare: 12, epic: 4, legendary: 0.9, mythic: 0.1 } },
  5: { energy: 50, chances: { common: 40, uncommon: 32, rare: 18, epic: 7, legendary: 2.5, mythic: 0.5 } }
};

// Rods
export const RODS = [
  { id: 'bamboo', name: 'Kail Bambu', icon: '🎋', power: 1, price: 0, level: 1, durability: 100 },
  { id: 'wood', name: 'Kail Oak', icon: '🪵', power: 2, price: 150, level: 2, durability: 150 },
  { id: 'iron', name: 'Kail Besi', icon: '⚙️', power: 3, price: 400, level: 4, durability: 200 },
  { id: 'steel', name: 'Kail Baja', icon: '🔩', power: 5, price: 1000, level: 6, durability: 300 },
  { id: 'carbon', name: 'Kail Carbon', icon: '⚫', power: 8, price: 2500, level: 9, durability: 500 },
  { id: 'titan', name: 'Kail Titanium', icon: '💠', power: 12, price: 5000, level: 12, durability: 800 },
  { id: 'mythril', name: 'Kail Mythril', icon: '🔮', power: 18, price: 10000, level: 15, durability: 1200 },
  { id: 'poseidon', name: 'Poseidon', icon: '🔱', power: 30, price: 25000, level: 20, durability: 2000 }
];

// Baits
export const BAITS = [
  { id: 'none', name: 'Tanpa Umpan', icon: '❌', quality: 0.5, price: 0, count: 999, catchBonus: 0 },
  { id: 'worm', name: 'Cacing', icon: '🪱', quality: 1, price: 5, count: 20, catchBonus: 0.1 },
  { id: 'bread', name: 'Roti', icon: '🍞', quality: 1.2, price: 8, count: 20, catchBonus: 0.12 },
  { id: 'corn', name: 'Jagung', icon: '🌽', quality: 1.5, price: 15, count: 20, catchBonus: 0.15 },
  { id: 'shrimp', name: 'Udang', icon: '🦐', quality: 2, price: 30, count: 15, catchBonus: 0.2 },
  { id: 'lure', name: 'Premium Lure', icon: '🎣', quality: 4, price: 120, count: 10, catchBonus: 0.3, rareBonus: 0.15 },
  { id: 'magic', name: 'Umpan Ajaib', icon: '✨', quality: 6, price: 250, count: 10, catchBonus: 0.35, rareBonus: 0.25 },
  { id: 'legend', name: 'Umpan Legendaris', icon: '👑', quality: 10, price: 500, count: 5, catchBonus: 0.4, rareBonus: 0.4 }
];

// Hybrid combinations
export const HYBRIDS = {
  'goldfish+salmon': { id: 'goldentrout', name: 'Golden Trout', value: 200, xp: 100, sprite: 'hybrid_goldentrout.png' },
  'bass+tuna': { id: 'seabass', name: 'Sea Bass', value: 300, xp: 150, sprite: 'hybrid_seabass.png' },
  'shark+dragon': { id: 'dragonshark', name: 'Dragon Shark', value: 5000, xp: 2500, sprite: 'hybrid_dragonshark.png' },
  'salmon+trout': { id: 'rainbowfish', name: 'Rainbow Fish', value: 150, xp: 75, sprite: 'hybrid_rainbow.png' },
  'squid+kraken': { id: 'abyssal', name: 'Abyssal Terror', value: 8000, xp: 4000, sprite: 'hybrid_abyssal.png' },
  'phoenix+dragon': { id: 'celestial', name: 'Celestial Beast', value: 15000, xp: 7500, sprite: 'hybrid_celestial.png' },
  'manta+whale': { id: 'oceanlord', name: 'Ocean Lord', value: 6000, xp: 3000, sprite: 'hybrid_oceanlord.png' }
};

// Mutations
export const MUTATIONS = [
  { id: 'giant', name: 'Raksasa', effect: 'weight', multiplier: 2 },
  { id: 'golden', name: 'Emas', effect: 'value', multiplier: 1.5 },
  { id: 'wise', name: 'Bijak', effect: 'xp', multiplier: 2 },
  { id: 'shiny', name: 'Berkilau', effect: 'glow', multiplier: 1 },
  { id: 'ancient', name: 'Purba', effect: 'value', multiplier: 2 },
  { id: 'toxic', name: 'Beracun', effect: 'xp', multiplier: 1.5 }
];

// Weather effects on fishing
export const WEATHER = {
  clear: { name: 'Cerah', icon: '☀️', modifier: 1, rareBonus: 0 },
  cloudy: { name: 'Berawan', icon: '☁️', modifier: 1.1, rareBonus: 0.02 },
  rain: { name: 'Hujan', icon: '🌧️', modifier: 1.3, rareBonus: 0.05 },
  storm: { name: 'Badai', icon: '⛈️', modifier: 1.5, rareBonus: 0.1, energyCost: 1.5 },
  night: { name: 'Malam', icon: '🌙', modifier: 1.2, rareBonus: 0.08 }
};

// Gem drop chances per rarity
export const GEM_CHANCES = {
  common: 0.02, uncommon: 0.05, rare: 0.12, epic: 0.2, legendary: 0.4, mythic: 0.6
};
export const GEM_AMOUNTS = {
  common: 1, uncommon: 1, rare: 2, epic: 3, legendary: 5, mythic: 10
};
