// Particle System - Visual effects (splash, sparkle, bubbles)
export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
  }

  start() {
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life);
      p.size *= (p.shrink || 0.98);
      return p.life > 0;
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      if (p.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
      } else if (p.type === 'text') {
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.fillText(p.text, p.x, p.y);
      } else if (p.type === 'star') {
        this.drawStar(p.x, p.y, p.size, p.color);
      }
      this.ctx.restore();
    });
  }

  drawStar(x, y, size, color) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Effect presets
  splash(x, y) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        type: 'circle',
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 8 - 2,
        gravity: 0.3,
        size: Math.random() * 4 + 2,
        color: `hsl(${195 + Math.random() * 20}, 80%, ${60 + Math.random() * 20}%)`,
        life: 1,
        decay: 0.02,
        shrink: 0.97
      });
    }
  }

  sparkle(x, y, color = '#FFD700') {
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      this.particles.push({
        type: 'star',
        x, y,
        vx: Math.cos(angle) * (Math.random() * 3 + 1),
        vy: Math.sin(angle) * (Math.random() * 3 + 1),
        gravity: 0,
        size: Math.random() * 4 + 2,
        color,
        life: 1,
        decay: 0.025,
        shrink: 0.96
      });
    }
  }

  bubbles(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'circle',
        x: x + (Math.random() - 0.5) * 30,
        y,
        vx: (Math.random() - 0.5) * 1,
        vy: -Math.random() * 2 - 0.5,
        gravity: -0.02,
        size: Math.random() * 5 + 2,
        color: 'rgba(255, 255, 255, 0.6)',
        life: 1,
        decay: 0.01,
        shrink: 0.99
      });
    }
  }

  coinBurst(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        type: 'text',
        text: '💰',
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 5 - 2,
        gravity: 0.2,
        size: 16 + Math.random() * 8,
        life: 1,
        decay: 0.02,
        shrink: 1
      });
    }
  }

  gemBurst(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        type: 'text',
        text: '💎',
        x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 4 - 2,
        gravity: 0.15,
        size: 18 + Math.random() * 6,
        life: 1,
        decay: 0.018,
        shrink: 1
      });
    }
  }

  rareCatch(x, y, rarity) {
    const colors = {
      rare: '#42a5f5',
      epic: '#ab47bc',
      legendary: '#ffb300',
      mythic: '#e91e63'
    };
    const color = colors[rarity] || '#fff';
    this.sparkle(x, y, color);
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        type: 'circle',
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: -Math.random() * 1,
        gravity: 0,
        size: Math.random() * 3 + 1,
        color,
        life: 1,
        decay: 0.01,
        shrink: 0.99
      });
    }
  }
}
