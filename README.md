# 🎣 Fishing Frenzy

A pixel art fishing game built with vanilla JavaScript + Vite. PWA-ready, mobile-first.

![Fishing Frenzy](https://img.shields.io/badge/Game-Fishing%20Frenzy-00c853?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 🎮 Features

### Core Gameplay
- **Fishing** — Cast your line, adjust depth, catch fish from Common to Mythic rarity
- **22 Fish Species** — Each with unique sprites, weights, and values
- **Depth System** — Deeper = rarer fish, but costs more energy
- **Weather System** — Dynamic weather affects catch rates (storm = rare bonus!)

### Progression
- **Level System** — Earn XP, level up, unlock better equipment
- **Daily & Weekly Quests** — Fresh challenges with coin/gem rewards
- **20+ Achievements** — Milestones from "First Catch" to "Grandmaster"
- **Fish Codex** — Track your discoveries

### Breeding Lab 🧬
- **Cross-breed** fish to create hybrids
- **7 Hybrid combinations** (Dragon Shark, Celestial Beast, etc.)
- **Mutations** — 20% chance for bonus traits (Giant, Golden, Shiny...)
- **Genetic inheritance** — Offspring inherit parent traits

### Economy
- **Shop** — 8 rods (Bamboo → Poseidon) + 8 baits
- **Sell fish** — Value scales with weight
- **Gems** — Premium currency from rare catches

### Technical
- **PWA** — Installable on mobile, works offline
- **localStorage** — Auto-save, export/import saves
- **Pixel Art SVG** — Lightweight, scalable sprites
- **Particle Effects** — Splash, sparkle, bubbles
- **Haptic Feedback** — Vibration on catches (mobile)

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/kofkdk/fishing-frenzy.git
cd fishing-frenzy

# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## 📱 Mobile

Open `http://localhost:3000` on your phone (same network) or deploy to any static host.

The game is designed mobile-first with touch controls.

## 🏗️ Project Structure

```
fishing-frenzy/
├── src/
│   ├── assets/
│   │   ├── sprites/     # Fish & boat SVGs (23 fish + 7 hybrids)
│   │   ├── tiles/       # Water, sky backgrounds
│   │   └── ui/          # Coin, gem, energy icons
│   ├── components/      # UI rendering (App, Header, UI, Modals, Scene)
│   ├── data/            # Game data (fish species, rods, baits)
│   ├── systems/         # Game logic (fishing, breeding, quests, weather, particles)
│   ├── styles/          # CSS
│   ├── utils/           # Sprite loader
│   └── main.js          # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🐟 Fish Rarity

| Rarity | Depth | Chance (Depth 5) | Examples |
|--------|-------|-------------------|----------|
| Common | 1+ | 40% | Ikan Mas, Lele, Karper |
| Uncommon | 1+ | 32% | Salmon, Bass, Trout |
| Rare | 2+ | 18% | Tuna, Marlin, Swordfish |
| Epic | 3+ | 7% | Hiu, Paus, Cumi Raksasa |
| Legendary | 4+ | 2.5% | Naga Laut, Kraken, Phoenix |
| Mythic | 5 | 0.5% | Paus Kosmik, Ikan Purba |

## 🧬 Hybrid Combinations

| Parent 1 | Parent 2 | Hybrid |
|----------|----------|--------|
| Goldfish | Salmon | Golden Trout |
| Bass | Tuna | Sea Bass |
| Shark | Dragon | Dragon Shark |
| Salmon | Trout | Rainbow Fish |
| Squid | Kraken | Abyssal Terror |
| Phoenix | Dragon | Celestial Beast |
| Manta | Whale | Ocean Lord |

## 📄 License

MIT
