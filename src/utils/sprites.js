// Sprite loader - imports all PNG pixel art assets
// Fish sprites
import goldfish from '../assets/sprites/goldfish.png';
import carp from '../assets/sprites/carp.png';
import catfish from '../assets/sprites/catfish.png';
import tilapia from '../assets/sprites/tilapia.png';
import guppy from '../assets/sprites/guppy.png';
import salmon from '../assets/sprites/salmon.png';
import bass from '../assets/sprites/bass.png';
import trout from '../assets/sprites/trout.png';
import pike from '../assets/sprites/pike.png';
import tuna from '../assets/sprites/tuna.png';
import marlin from '../assets/sprites/marlin.png';
import swordfish from '../assets/sprites/swordfish.png';
import pufferfish from '../assets/sprites/pufferfish.png';
import shark from '../assets/sprites/shark.png';
import whale from '../assets/sprites/whale.png';
import squid from '../assets/sprites/squid.png';
import manta from '../assets/sprites/manta.png';
import dragon from '../assets/sprites/dragon.png';
import kraken from '../assets/sprites/kraken.png';
import phoenix from '../assets/sprites/phoenix.png';
import leviathan from '../assets/sprites/leviathan.png';
import cosmic from '../assets/sprites/cosmic.png';
import ancient from '../assets/sprites/ancient.png';

// Hybrid sprites
import hybrid_goldentrout from '../assets/sprites/hybrid_goldentrout.png';
import hybrid_seabass from '../assets/sprites/hybrid_seabass.png';
import hybrid_dragonshark from '../assets/sprites/hybrid_dragonshark.png';
import hybrid_rainbow from '../assets/sprites/hybrid_rainbow.png';
import hybrid_abyssal from '../assets/sprites/hybrid_abyssal.png';
import hybrid_celestial from '../assets/sprites/hybrid_celestial.png';
import hybrid_oceanlord from '../assets/sprites/hybrid_oceanlord.png';

// Boat
import boat from '../assets/sprites/boat.png';

const SPRITES = {
  goldfish, carp, catfish, tilapia, guppy,
  salmon, bass, trout, pike,
  tuna, marlin, swordfish, pufferfish,
  shark, whale, squid, manta,
  dragon, kraken, phoenix, leviathan,
  cosmic, ancient,
  hybrid_goldentrout, hybrid_seabass, hybrid_dragonshark,
  hybrid_rainbow, hybrid_abyssal, hybrid_celestial, hybrid_oceanlord,
  boat
};

export function getFishSprite(id) {
  return SPRITES[id] || SPRITES.goldfish;
}

export function getBoatSprite() {
  return SPRITES.boat;
}

export default SPRITES;
