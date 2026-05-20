// Weather System - Changes weather periodically, affects fishing
import gameState from './state.js';
import { WEATHER } from '../data/fish.js';

const WEATHER_IDS = Object.keys(WEATHER);
const WEATHER_DURATION = 5 * 60 * 1000; // 5 minutes per weather

export class WeatherSystem {
  constructor() {
    this.checkWeather();
    this.interval = setInterval(() => this.checkWeather(), 30000);
  }

  checkWeather() {
    const lastChange = gameState.get('weather.lastChange') || 0;
    const now = Date.now();

    if (now - lastChange > WEATHER_DURATION) {
      this.changeWeather();
    }
  }

  changeWeather() {
    // Weighted random: clear is most common, storm is rare
    const weights = { clear: 35, cloudy: 25, rain: 20, night: 15, storm: 5 };
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;

    let newWeather = 'clear';
    for (const [id, weight] of Object.entries(weights)) {
      roll -= weight;
      if (roll <= 0) { newWeather = id; break; }
    }

    gameState.set('weather.current', newWeather);
    gameState.set('weather.lastChange', Date.now());
  }

  getCurrent() {
    const id = gameState.get('weather.current') || 'clear';
    return { id, ...WEATHER[id] };
  }

  getTimeRemaining() {
    const lastChange = gameState.get('weather.lastChange') || 0;
    const elapsed = Date.now() - lastChange;
    return Math.max(0, WEATHER_DURATION - elapsed);
  }

  destroy() {
    if (this.interval) clearInterval(this.interval);
  }
}

export const weatherSystem = new WeatherSystem();
export default weatherSystem;
