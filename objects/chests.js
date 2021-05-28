class Chest {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.myContainer = container;

    this.identity = 0;
    this.loadSprite();
  }
  get screenX() {
    return this.x + this.myContainer.x;
  }
  get screenY() {
    return this.y + this.myContainer.y;
  }
  loadSprite() {
    this.sprite = new PIXI.Sprite(terrainSheet.textures["chest.png"]);
    this.sprite.x = this.x + BLOCK_SIZE / 2;
    this.sprite.y = this.y + BLOCK_SIZE / 2;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.zIndex = 22;

    this.sprite.width = BLOCK_SIZE * 0.8;
    this.sprite.height = BLOCK_SIZE * 0.8;

    this.myContainer.addChild(this.sprite);
  }
  draw() {
    //c.fillStyle = "red";
    //c.fillRect(this.screenX, this.screenY, BLOCK_SIZE, BLOCK_SIZE);
    //
    if (
      this.screenX > -BLOCK_SIZE &&
      this.screenX <= canvas.width &&
      this.screenY > -BLOCK_SIZE &&
      this.screenY <= canvas.height
    ) {
      this.sprite.visibility = true;
    } else {
      this.sprite.visibility = false;
    }
    this.checkDestroyed();
  }
  checkDestroyed() {
    if (this.broken || !player.isAttacking) return;

    if (
      circleTouchRect(
        player.attackCircle.x,
        player.attackCircle.y,
        player.attackCircle.r,
        this.screenX,
        this.screenY,
        BLOCK_SIZE,
        BLOCK_SIZE
      )
    ) {
      this.destroy();
    }
  }
  destroy() {
    this.sprite.destroy();
    this.sprite = new PIXI.Sprite(terrainSheet.textures["chestOpened.png"]);
    this.sprite.x = this.x + BLOCK_SIZE / 2;
    this.sprite.y = this.y + BLOCK_SIZE / 2;
    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.width = BLOCK_SIZE * 0.8;
    this.sprite.height = BLOCK_SIZE * 0.8;

    this.myContainer.addChild(this.sprite);

    screenShake.timeLeft = 8;
    screenShake.amplitude = 5;
    this.broken = true;

    for (let i = 0; i < 10; i++) {
      particles.push(
        new Particle(
          this.screenX + BLOCK_SIZE / 2 + offset.x,
          this.screenY + BLOCK_SIZE / 2 + offset.y,
          0xffff00,
          2 + Math.random() * 10,
          Math.PI * 2 * Math.random(),
          Math.random() * 7 + 10,
          Math.random() * 4 + 4
        )
      );
      //console.log(particles[particles.length - 1]);
    }
    let money = Math.ceil(
      (Math.hypot(
        (offset.x - CHUNK_WIDTH) / CHUNK_WIDTH,
        (offset.y - CHUNK_WIDTH) / CHUNK_WIDTH
      ) *
        1.3 +
        9 +
        Math.round(Math.random() * 9)) *
        0.31
    );

    score.loot += money;

    dashShadows.push(
      new Money(this.screenX + BLOCK_SIZE / 2, this.screenY, money)
    );
    playSound("bonusGold");
  }
}

class Barril {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.myContainer = container;
    this.broken = false;

    this.identity = 0;

    this.seed = fastRandom2.rand(hash3d(this.screenX, this.screenY));
    this.hasMoney = fastRandom2.toDecimal(this.seed) < 0.26;
    this.loadSprite();
  }
  get screenX() {
    return this.x + this.myContainer.x;
  }
  get screenY() {
    return this.y + this.myContainer.y;
  }
  loadSprite() {
    this.sprite = new PIXI.Sprite(terrainSheet.textures["barril.png"]);
    this.sprite.x = this.x + BLOCK_SIZE / 2;
    this.sprite.y = this.y + BLOCK_SIZE / 2;
    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.width = BLOCK_SIZE * 0.65;
    this.sprite.height = BLOCK_SIZE * 0.8;
    this.sprite.zIndex = 5;

    this.myContainer.addChild(this.sprite);
  }
  destroy() {
    this.sprite.destroy();
    this.sprite = new PIXI.Sprite(terrainSheet.textures["brokenBarril.png"]);
    this.sprite.x = this.x + BLOCK_SIZE / 2;
    this.sprite.y = this.y + BLOCK_SIZE / 2;
    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.width = BLOCK_SIZE * 0.65;
    this.sprite.height = BLOCK_SIZE * 0.8;

    this.myContainer.addChild(this.sprite);

    screenShake.timeLeft = 4;
    screenShake.amplitude = 3;
    this.identity = 1;
    this.broken = true;
  }
  draw() {
    //c.fillStyle = "red";
    //c.fillRect(this.screenX, this.screenY, BLOCK_SIZE, BLOCK_SIZE);
    //
    if (
      this.screenX > -BLOCK_SIZE &&
      this.screenX <= canvas.width &&
      this.screenY > -BLOCK_SIZE &&
      this.screenY <= canvas.height
    ) {
      this.sprite.visibility = true;
    } else {
      this.sprite.visibility = false;
    }
    this.checkDestroyed();
  }
  checkDestroyed() {
    if (this.broken || !player.isAttacking) return;

    if (
      circleTouchRect(
        player.attackCircle.x,
        player.attackCircle.y,
        player.attackCircle.r,
        this.screenX,
        this.screenY,
        BLOCK_SIZE,
        BLOCK_SIZE
      )
    ) {
      this.destroy();
      playSound("woodDestroy", 0.34);

      if (this.hasMoney) {
        let money = Math.ceil(Math.random() * 4);
        score.loot += money;
        dashShadows.push(
          new Money(this.screenX + BLOCK_SIZE / 2, this.screenY, money)
        );
        playSound("money");
      }
    }
  }
  highlight() {}
}
