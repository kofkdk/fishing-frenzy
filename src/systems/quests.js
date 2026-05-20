// Quest & Achievement System

export const DAILY_QUEST_POOL = [
  { id: 'catch_5', name: 'Pemancing Rajin', desc: 'Tangkap 5 ikan', type: 'catch', target: 5, reward: { coins: 100, xp: 50 } },
  { id: 'catch_10', name: 'Pemancing Pro', desc: 'Tangkap 10 ikan', type: 'catch', target: 10, reward: { coins: 250, xp: 100 } },
  { id: 'catch_rare', name: 'Pemburu Langka', desc: 'Tangkap 1 ikan Rare+', type: 'catch_rare', target: 1, reward: { coins: 200, gems: 3 } },
  { id: 'earn_500', name: 'Kaya Raya', desc: 'Dapatkan 500 coins', type: 'earn_coins', target: 500, reward: { gems: 2, xp: 80 } },
  { id: 'breed_1', name: 'Peternak', desc: 'Breeding 1 kali', type: 'breed', target: 1, reward: { coins: 300, xp: 100 } },
  { id: 'sell_3', name: 'Pedagang', desc: 'Jual 3 ikan', type: 'sell', target: 3, reward: { coins: 150, xp: 60 } },
  { id: 'depth_3', name: 'Penyelam', desc: 'Mancing di kedalaman 3+', type: 'depth_fish', target: 3, reward: { coins: 200, xp: 80 } },
  { id: 'use_bait', name: 'Umpan Master', desc: 'Gunakan 5 umpan', type: 'use_bait', target: 5, reward: { coins: 100, xp: 40 } }
];

export const WEEKLY_QUEST_POOL = [
  { id: 'catch_50', name: 'Nelayan Sejati', desc: 'Tangkap 50 ikan', type: 'catch', target: 50, reward: { coins: 1000, gems: 10 } },
  { id: 'catch_epic', name: 'Pemburu Epic', desc: 'Tangkap 3 ikan Epic+', type: 'catch_epic', target: 3, reward: { coins: 2000, gems: 15 } },
  { id: 'breed_5', name: 'Peternak Pro', desc: 'Breeding 5 kali', type: 'breed', target: 5, reward: { coins: 1500, gems: 8 } },
  { id: 'earn_5000', name: 'Jutawan', desc: 'Dapatkan 5000 coins', type: 'earn_coins', target: 5000, reward: { gems: 20, xp: 500 } },
  { id: 'collect_20', name: 'Kolektor', desc: 'Punya 20 ikan di inventory', type: 'collection', target: 20, reward: { coins: 3000, gems: 12 } }
];

export const ACHIEVEMENTS = [
  // Fishing milestones
  { id: 'first_catch', name: 'Pemula', desc: 'Tangkap ikan pertama', icon: '🐟', type: 'catch', target: 1, reward: { coins: 50 } },
  { id: 'catch_100', name: 'Nelayan', desc: 'Tangkap 100 ikan', icon: '🎣', type: 'catch', target: 100, reward: { coins: 500, gems: 5 } },
  { id: 'catch_500', name: 'Master Angler', desc: 'Tangkap 500 ikan', icon: '🏆', type: 'catch', target: 500, reward: { coins: 2000, gems: 20 } },
  { id: 'catch_1000', name: 'Legenda Laut', desc: 'Tangkap 1000 ikan', icon: '👑', type: 'catch', target: 1000, reward: { coins: 5000, gems: 50 } },

  // Rarity achievements
  { id: 'first_rare', name: 'Keberuntungan', desc: 'Tangkap ikan Rare pertama', icon: '💎', type: 'catch_rarity', target: 'rare', reward: { gems: 3 } },
  { id: 'first_epic', name: 'Luar Biasa', desc: 'Tangkap ikan Epic pertama', icon: '🌟', type: 'catch_rarity', target: 'epic', reward: { gems: 5 } },
  { id: 'first_legendary', name: 'Legendaris!', desc: 'Tangkap ikan Legendary', icon: '⭐', type: 'catch_rarity', target: 'legendary', reward: { gems: 10 } },
  { id: 'first_mythic', name: 'Mitos Hidup', desc: 'Tangkap ikan Mythic', icon: '🌈', type: 'catch_rarity', target: 'mythic', reward: { gems: 25 } },

  // Breeding
  { id: 'first_breed', name: 'Peternak Pemula', desc: 'Breeding pertama', icon: '🧬', type: 'breed', target: 1, reward: { coins: 200 } },
  { id: 'first_hybrid', name: 'Ilmuwan Gila', desc: 'Dapatkan Hybrid pertama', icon: '🔬', type: 'hybrid', target: 1, reward: { gems: 10 } },
  { id: 'first_mutation', name: 'Mutasi!', desc: 'Dapatkan Mutasi pertama', icon: '☢️', type: 'mutation', target: 1, reward: { gems: 5 } },

  // Economy
  { id: 'rich_1000', name: 'Kaya', desc: 'Punya 1000 coins', icon: '💰', type: 'coins', target: 1000, reward: { xp: 100 } },
  { id: 'rich_10000', name: 'Sultan', desc: 'Punya 10000 coins', icon: '🤑', type: 'coins', target: 10000, reward: { gems: 10 } },
  { id: 'rich_100000', name: 'Konglomerat', desc: 'Punya 100000 coins', icon: '🏦', type: 'coins', target: 100000, reward: { gems: 50 } },

  // Level
  { id: 'level_5', name: 'Naik Kelas', desc: 'Capai Level 5', icon: '📈', type: 'level', target: 5, reward: { coins: 300 } },
  { id: 'level_10', name: 'Berpengalaman', desc: 'Capai Level 10', icon: '📊', type: 'level', target: 10, reward: { gems: 10 } },
  { id: 'level_20', name: 'Veteran', desc: 'Capai Level 20', icon: '🎖️', type: 'level', target: 20, reward: { gems: 25 } },
  { id: 'level_50', name: 'Grandmaster', desc: 'Capai Level 50', icon: '🏅', type: 'level', target: 50, reward: { gems: 100 } },

  // Special
  { id: 'big_fish', name: 'Monster!', desc: 'Tangkap ikan > 100kg', icon: '🐋', type: 'weight', target: 100, reward: { gems: 5 } },
  { id: 'collection_all', name: 'Kolektor Sejati', desc: 'Punya semua jenis ikan', icon: '📚', type: 'collection_complete', target: 1, reward: { gems: 100 } },
  { id: 'weather_storm', name: 'Pemberani', desc: 'Mancing saat badai', icon: '⛈️', type: 'weather_fish', target: 'storm', reward: { coins: 500 } }
];

export class QuestSystem {
  constructor(gameState) {
    this.state = gameState;
    this.checkReset();
  }

  checkReset() {
    const now = Date.now();
    const lastDaily = this.state.get('quests.lastDailyReset') || 0;
    const lastWeekly = this.state.get('quests.lastWeeklyReset') || 0;

    // Reset daily quests every 24h
    if (now - lastDaily > 24 * 60 * 60 * 1000) {
      this.generateDaily();
    }

    // Reset weekly quests every 7 days
    if (now - lastWeekly > 7 * 24 * 60 * 60 * 1000) {
      this.generateWeekly();
    }
  }

  generateDaily() {
    const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5);
    const quests = shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, completed: false, claimed: false }));
    this.state.set('quests.daily', quests);
    this.state.set('quests.lastDailyReset', Date.now());
  }

  generateWeekly() {
    const shuffled = [...WEEKLY_QUEST_POOL].sort(() => Math.random() - 0.5);
    const quests = shuffled.slice(0, 2).map(q => ({ ...q, progress: 0, completed: false, claimed: false }));
    this.state.set('quests.weekly', quests);
    this.state.set('quests.lastWeeklyReset', Date.now());
  }

  updateProgress(type, amount = 1, meta = {}) {
    ['daily', 'weekly'].forEach(period => {
      const quests = this.state.get(`quests.${period}`) || [];
      let changed = false;
      quests.forEach(q => {
        if (q.completed || q.type !== type) return;
        q.progress += amount;
        if (q.progress >= q.target) {
          q.completed = true;
          changed = true;
        }
      });
      if (changed) this.state.set(`quests.${period}`, quests);
    });
  }

  claimReward(period, questId) {
    const quests = this.state.get(`quests.${period}`) || [];
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return null;

    quest.claimed = true;
    this.state.set(`quests.${period}`, quests);

    // Apply rewards
    if (quest.reward.coins) {
      this.state.update('player.coins', c => c + quest.reward.coins);
    }
    if (quest.reward.gems) {
      this.state.update('player.gems', g => g + quest.reward.gems);
    }
    if (quest.reward.xp) {
      this.state.update('player.xp', x => x + quest.reward.xp);
    }

    return quest.reward;
  }
}

export class AchievementSystem {
  constructor(gameState) {
    this.state = gameState;
  }

  check(type, value) {
    const unlocked = this.state.get('achievements') || [];
    const newAchievements = [];

    ACHIEVEMENTS.forEach(ach => {
      if (unlocked.includes(ach.id)) return;
      if (ach.type !== type) return;

      let earned = false;
      if (typeof ach.target === 'number') {
        earned = value >= ach.target;
      } else {
        earned = value === ach.target;
      }

      if (earned) {
        unlocked.push(ach.id);
        newAchievements.push(ach);

        // Apply rewards
        if (ach.reward.coins) this.state.update('player.coins', c => c + ach.reward.coins);
        if (ach.reward.gems) this.state.update('player.gems', g => g + ach.reward.gems);
        if (ach.reward.xp) this.state.update('player.xp', x => x + ach.reward.xp);
      }
    });

    if (newAchievements.length) {
      this.state.set('achievements', unlocked);
    }

    return newAchievements;
  }

  getAll() {
    const unlocked = this.state.get('achievements') || [];
    return ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: unlocked.includes(ach.id)
    }));
  }

  getProgress() {
    const unlocked = this.state.get('achievements') || [];
    return { unlocked: unlocked.length, total: ACHIEVEMENTS.length };
  }
}
