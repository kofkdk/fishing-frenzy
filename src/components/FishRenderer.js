// FishRenderer.js - Render fish sprites in UI contexts
import { getFishSprite } from '../utils/sprites.js';

export function renderFishImage(fishId, size = 48) {
  const sprite = getFishSprite(fishId);
  return `<img src="${sprite}" alt="${fishId}" style="width:${size}px;height:${size * 0.625}px;image-rendering:pixelated">`;
}

export function renderFishCard(fish, index, options = {}) {
  const { showSell = true, showBreed = false, onClick = '' } = options;
  const sprite = getFishSprite(fish.id);
  const rarityColors = {
    common: '#78909c', uncommon: '#66bb6a', rare: '#42a5f5',
    epic: '#ab47bc', legendary: '#ffb300', mythic: '#e91e63', hybrid: '#00bcd4'
  };
  const borderColor = rarityColors[fish.rarity] || '#78909c';
  const sellValue = Math.floor(fish.value * (1 + fish.weight / 10));
  const glowClass = ['legendary', 'mythic', 'hybrid'].includes(fish.rarity) ? `box-shadow:0 0 15px ${borderColor}40;` : '';

  return `
    <div class="fish-card" style="background:rgba(0,0,0,.3);border-radius:12px;padding:10px;text-align:center;border:2px solid ${borderColor};${glowClass}" ${onClick ? `onclick="${onClick}"` : ''}>
      <div style="height:40px;display:flex;align-items:center;justify-content:center;margin-bottom:4px">
        <img src="${sprite}" alt="${fish.name}" style="width:48px;height:30px;image-rendering:pixelated">
      </div>
      <div style="font-size:11px;font-weight:600">${fish.name}</div>
      <div style="font-size:9px;color:var(--dim)">${fish.weight}kg \u2022 ${fish.rarity}${fish.hybrid ? ' \u2022 \u{1F9EC}' : ''}</div>
      ${fish.mutation ? '<div style="font-size:8px;padding:2px 5px;background:rgba(255,107,107,.3);color:#ff6b6b;border-radius:4px;display:inline-block;margin-top:4px">\u2728 ' + fish.mutation.name + '</div>' : ''}
      ${fish.breedable ? '<div style="font-size:8px;color:var(--gem);margin-top:2px">Breed: ' + (fish.breedCount || 0) + '/5</div>' : ''}
      <div style="margin-top:6px;display:flex;gap:4px;justify-content:center">
        ${showSell ? '<button class="energy-buy" style="padding:4px 8px;font-size:9px" onclick="event.stopPropagation();window.game.sellFish(' + index + ')">\u{1F4B0}' + sellValue + '</button>' : ''}
        ${showBreed && fish.breedable && (fish.breedCount || 0) < 5 ? '<button class="energy-buy" style="padding:4px 8px;font-size:9px;background:var(--gem)" onclick="event.stopPropagation();window.game.selectBreed(' + index + ')">\u{1F9EC}</button>' : ''}
      </div>
    </div>
  `;
}
