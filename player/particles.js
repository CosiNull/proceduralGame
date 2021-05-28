let g = new PIXI.Graphics();
g.zIndex = 100;
mainContainer.addChild(g);

class Particle {
  constructor(x, y, color, size, angle, maxUpdates, speed) {
    this.x = x;
    this.y = y;

    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;

    this.totalMov = {
      x: 0,
      y: 0,
    };

    this.isAlive = true;
    this.color = color;
    this.size = size;

    this.updateCount = 0;
    this.maxUpdates = maxUpdates;
  }
  draw() {
    g.alpha = this.updateCount / this.maxUpdates;
    g.beginFill(this.color);
    g.drawRect(
      this.x - offset.x + this.totalMov.x,
      this.y - offset.y + this.totalMov.y,
      this.size,
      this.size
    );
    g.endFill();
  }
  update() {
    this.totalMov.x += this.dx;
    this.totalMov.y += this.dy;
    this.updateCount++;
    this.draw();

    if (this.updateCount > this.maxUpdates) {
      this.isAlive = false;
    }
  }
  die() {
    //this.sprite.destroy();
    //g.clear();
  }
}

let particles = [];

function updateParticles() {
  g.clear();
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].isAlive) {
      particles[i].update();
    } else {
      //particles[i].die();
      particles.splice(i, 1);
      i--;
    }
  }
}
