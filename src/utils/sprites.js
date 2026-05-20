// Sprite loader - imports all SVG assets
// Fish sprites
import goldfish from '../assets/sprites/goldfish.svg';
import carp from '../assets/sprites/carp.svg';
import catfish from '../assets/sprites/catfish.svg';
import tilapia from '../assets/sprites/tilapia.svg';
import guppy from '../assets/sprites/guppy.svg';
import salmon from '../assets/sprites/salmon.svg';
import bass from '../assets/sprites/bass.svg';
import trout from '../assets/sprites/trout.svg';
import pike from '../assets/sprites/pike.svg';
import tuna from '../assets/sprites/tuna.svg';
import marlin from '../assets/sprites/marlin.svg';
import swordfish from '../assets/sprites/swordfish.svg';
import pufferfish from '../assets/sprites/pufferfish.svg';
import shark from '../assets/sprites/shark.svg';
import whale from '../assets/sprites/whale.svg';
import squid from '../assets/sprites/squid.svg';
import manta from '../assets/sprites/manta.svg';
import dragon from '../assets/sprites/dragon.svg';
import kraken from '../assets/sprites/kraken.svg';
import phoenix from '../assets/sprites/phoenix.svg';
import leviathan from '../assets/sprites/leviathan.svg';
import cosmic from '../assets/sprites/cosmic.svg';
import ancient from '../assets/sprites/ancient.svg';

// Hybrid sprites
import hybrid_goldentrout from '../assets/sprites/hybrid_goldentrout.svg';
import hybrid_seabass from '../assets/sprites/hybrid_seabass.svg';
import hybrid_dragonshark from '../assets/sprites/hybrid_dragonshark.svg';
import hybrid_rainbow from '../assets/sprites/hybrid_rainbow.svg';
import hybrid_abyssal from '../assets/sprites/hybrid_abyssal.svg';
import hybrid_celestial from '../assets/sprites/hybrid_celestial.svg';
import hybrid_oceanlord from '../assets/sprites/hybrid_oceanlord.svg';

// Environment
import boat from '../assets/sprites/boat.svg';

// UI
import coinIcon from '../assets/ui/coin.svg';
import gemIcon from '../assets/ui/gem.svg';
import energyIcon from '../assets/ui/energy.svg';

export const SPRITES = {
  fish: {
    goldfish, carp, catfish, tilapia, guppy,
    salmon, bass, trout, pike,
    tuna, marlin, swordfish, pufferfish,
    shark, whale, squid, manta,
    dragon, kraken, phoenix, leviathan,
    cosmic, ancient
  },
  hybrid: {
    goldentrout: hybrid_goldentrout,
    seabass: hybrid_seabass,
    dragonshark: hybrid_dragonshark,
    rainbowfish: hybrid_rainbow,
    abyssal: hybrid_abyssal,
    celestial: hybrid_celestial,
    oceanlord: hybrid_oceanlord
  },
  environment: { boat },
  ui: { coin: coinIcon, gem: gemIcon, energy: energyIcon }
};

export function getFishSprite(fishId) {
  // Check hybrids first
  if (SPRITES.hybrid[fishId]) return SPRITES.hybrid[fishId];
  // Then regular fish
  if (SPRITES.fish[fishId]) return SPRITES.fish[fishId];
  // Fallback
  return SPRITES.fish.goldfish;
}

export function getUIIcon(name) {
  return SPRITES.ui[name] || '';
}
