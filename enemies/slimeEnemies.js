class BigSlime extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 2;
    this.attackedAngle = 0;
    this.isAttacked = false;
    this.w = BLOCK_SIZE * 1;
    this.h = BLOCK_SIZE * 1;
    this.speed = 4.5; //2.5
    this.angle = this.seed % (2 * Math.PI);

    this.knockbackTimes = 6;
    this.killPoints = 4;
    this.noCoyote = true;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["slimeL"]
    );
    this.sprite.left.visible = false;
    this.sprite.left.x = this.x;
    this.sprite.left.y = this.y;
    this.sprite.left.width = this.w;
    this.sprite.left.height = this.h;
    this.sprite.left.animationSpeed = 0.15;
    this.sprite.left.zIndex = 15;
    this.sprite.left.loop = true;
    this.sprite.left.gotoAndPlay(Math.floor(Math.random() * 4));
    mainContainer.addChild(this.sprite.left);

    this.sprite.right = new PIXI.AnimatedSprite(
      enemiesSheet.animations["slimeR"]
    );
    this.sprite.right.visible = false;
    this.sprite.right.x = this.x;
    this.sprite.right.y = this.y;
    this.sprite.right.width = this.w;
    this.sprite.right.height = this.h;
    this.sprite.right.animationSpeed = 0.15;
    this.sprite.right.zIndex = 15;
    this.sprite.right.loop = true;
    this.sprite.right.gotoAndPlay(Math.floor(Math.random() * 4));
    mainContainer.addChild(this.sprite.right);
  }

  update() {
    if (this.inScreen()) {
      if (!this.isAttacked) {
        this.checkIfTouchingPlayer();
        this.move();
        this.checkIfHit();
        if (this.isDead) return;
        if (this.xMovement <= 0) {
          this.sprite.left.visible = true;
          this.sprite.right.visible = false;
          this.sprite.left.x = this.x - offset.x;
          this.sprite.left.y = this.y - offset.y;
        } else {
          this.sprite.right.visible = true;
          this.sprite.left.visible = false;
          this.sprite.right.x = this.x - offset.x;
          this.sprite.right.y = this.y - offset.y;
        }
      } else {
        if (this.xMovement <= 0) {
          this.sprite.right.visible = true;
          this.sprite.left.visible = false;
          this.sprite.right.x = this.x - offset.x;
          this.sprite.right.y = this.y - offset.y;
        } else {
          this.sprite.left.visible = true;
          this.sprite.right.visible = false;
          this.sprite.left.x = this.x - offset.x;
          this.sprite.left.y = this.y - offset.y;
        }
        this.knockback();
      }
    } else {
      this.sprite.left.visible = false;
      this.sprite.right.visible = false;
      this.checkIfOnLoadedChunks();
    }
  }

  move() {
    this.xMovement = Math.cos(this.angle) * this.speed;
    this.yMovement = Math.sin(this.angle) * this.speed;

    let collided = false;

    this.x += this.xMovement;
    if (this.detectWallCollisions()) {
      this.x -= this.xMovement;
      collided = true;
    }
    this.y += this.yMovement;
    if (this.detectWallCollisions()) {
      this.y -= this.yMovement;
      collided = true;
    }
    if (collided) {
      this.tempSeed = fastRandom2.rand(this.tempSeed);

      this.angle = this.tempSeed % (Math.PI * 2);
    }

    if (
      (this.screenX + this.w / 2 - player.x - player.w / 2) ** 2 +
        (this.screenY + this.h / 2 - player.y - player.h / 2) ** 2 <
      (BLOCK_SIZE * 4) ** 2
    ) {
      this.angle =
        calculateAngle(
          this.screenX + this.w / 2,
          this.screenY + this.h / 2,
          player.x + player.w / 2,
          player.y + player.h / 2
        ) +
        Math.random() * 0.1 -
        0.2;
      this.speed = 4;
    } else {
      this.speed = 3;
    }
  }

  checkIfHit() {
    if (!player.isAttacking || this.isAttacked) return;

    if (
      circleTouchRect(
        player.attackCircle.x,
        player.attackCircle.y,
        player.attackCircle.r,
        this.screenX,
        this.screenY,
        this.w,
        this.h
      )
    ) {
      this.isAttacked = true;
      this.life--;
      if (player.dashDamage) this.life--;
      this.attackedAngle = player.attackAngle;

      for (let state in this.sprite) {
        this.sprite[state].stop();
        this.sprite[state].tint = 0xff0000;
      }

      //Death
      if (this.life <= 0) {
        this.die();
        score.enemies++; //
        for (let i = 0; i < 35; i++) {
          particles.push(
            new Particle(
              this.x + Math.cos(this.attackedAngle) * 3,
              this.y + Math.sin(this.attackedAngle) * 3,
              0xff0000,
              2 + Math.random() * 5,
              this.attackedAngle + Math.PI * Math.random() - Math.PI,
              Math.random() * 5 + 5,
              Math.random() * 5 + 3
            )
          );
        }
        screenShake.amplitude = 4.5;
        health.timer += this.killPoints;

        let offsprings = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < offsprings; i++) {
          let miniSlime = new MiniSlime(
            this.x,
            this.y,
            this.chunkX,
            this.chunkY
          );
          miniSlime.isAttacked = true;
          miniSlime.attackedAngle = this.attackedAngle;
          miniSlime.angle = this.attackedAngle + Math.random() * Math.PI * 0.9;

          let examinedChunk = Math.max(
            Math.abs(this.chunkX / CHUNK_WIDTH - 1),
            Math.abs(this.chunkY / CHUNK_WIDTH - 1),
            0
          );
          if (examinedChunk > BIOMES.length - 1) {
            let biomeNum = Math.floor(examinedChunk / 3);
            miniSlime.life += biomeNum - (BIOMES.length - 1);
          }

          enemies.push(miniSlime);
        }

        health.scoredCount = 12;
      } else {
        screenShake.amplitude = 3;
      }

      sounds.damage.play();
      //ScreenShake
      screenShake.timeLeft = 5;
    }
  }
}

class MiniSlime extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 1;
    this.w = BLOCK_SIZE * 0.54;
    this.h = BLOCK_SIZE * 0.54;

    this.attackedAngle = 0;
    this.isAttacked = false;

    this.killPoints = 3.6;

    //Movement
    this.movingToDestination = true;
    this.travelCount = 0;
    this.travelMax = 30;
    this.speed = 9; //
    this.angle = this.seed % (2 * Math.PI);

    this.knockbackTimes = 6;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["slimeL"]
    );
    this.sprite.right = new PIXI.AnimatedSprite(
      enemiesSheet.animations["slimeR"]
    );

    for (let state in this.sprite) {
      this.sprite[state].visible = false;
      this.sprite[state].x = this.x;
      this.sprite[state].y = this.y;
      this.sprite[state].width = this.w;
      this.sprite[state].height = this.h;
      this.sprite[state].animationSpeed = 0.15;
      this.sprite[state].zIndex = 15;
      this.sprite[state].loop = true;
      this.sprite[state].gotoAndPlay(Math.floor(Math.random() * 4));
      mainContainer.addChild(this.sprite[state]);
    }
  }
  update() {
    if (this.inScreen()) {
      if (!this.isAttacked) {
        this.checkIfTouchingPlayer();
        this.move();
        if (this.xMovement <= 0) {
          this.sprite.right.visible = false;
          this.sprite.left.visible = true;
          this.sprite.left.x = this.x - offset.x;
          this.sprite.left.y = this.y - offset.y;
        } else {
          this.sprite.left.visible = false;
          this.sprite.right.visible = true;
          this.sprite.right.x = this.x - offset.x;
          this.sprite.right.y = this.y - offset.y;
        }
        this.checkIfHit();
      } else {
        if (this.xMovement <= 0) {
          this.sprite.right.visible = true;
          this.sprite.left.visible = false;
          this.sprite.right.x = this.x - offset.x;
          this.sprite.right.y = this.y - offset.y;
        } else {
          this.sprite.left.visible = true;
          this.sprite.right.visible = false;
          this.sprite.left.x = this.x - offset.x;
          this.sprite.left.y = this.y - offset.y;
        }
        this.knockback();
      }
    } else {
      this.checkIfOnLoadedChunks();
      this.sprite.left.visible = false;
      this.sprite.right.visible = false;
    }
  }
  move() {
    if (this.movingToDestination) {
      this.xMovement = Math.cos(this.angle) * this.speed;
      this.yMovement = Math.sin(this.angle) * this.speed;

      this.x += this.xMovement;
      this.y += this.yMovement;

      this.travelCount++;

      if (this.detectWallCollisions()) {
        this.x -= this.xMovement;
        this.y -= this.yMovement;
        this.movingToDestination = false;
        this.travelCount = 0;
      }
    } else {
      this.angle = Math.random() * (2 * Math.PI);
      this.movingToDestination = true;
    }
  }
}
