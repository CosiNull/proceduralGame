class Skull extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 2;
    this.w = BLOCK_SIZE;
    this.h = BLOCK_SIZE;

    this.attackedAngle = 0;
    this.isAttacked = false;

    //Movement
    this.movingToDestination = true;
    this.travelCount = 0;
    this.travelMax = 8; //10
    this.speed = 2;
    this.angle = this.seed % (2 * Math.PI);

    this.knockbackTimes = 6;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["skullR"]
    );
    this.sprite.right = new PIXI.AnimatedSprite(
      enemiesSheet.animations["skullL"]
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
      if (this.travelCount > this.travelMax && Math.random() > 0.72) {
        this.movingToDestination = false;
        this.travelCount = 0;

        enemies.push(
          new Projectile(
            this.x + this.w / 2,
            this.y + this.h / 2,
            Math.random() * Math.PI * 2
          )
        );
        enemies.push(
          new Projectile(
            this.x + this.w / 2,
            this.y + this.h / 2,
            Math.random() * Math.PI * 2
          )
        );
      }
      if (this.detectWallCollisions()) {
        this.x -= this.xMovement;
        this.y -= this.yMovement;
        this.movingToDestination = false;
        this.travelCount = 0;
      }
      if (
        (this.screenX + this.w / 2 - player.x - player.w / 2) ** 2 +
          (this.screenY + this.h / 2 - player.y - player.h / 2) ** 2 <
        (BLOCK_SIZE * 4) ** 2
      ) {
        this.speed = 9; //5
      } else {
        this.speed = 7.2; //4
      }
    } else {
      this.angle = Math.random() * (2 * Math.PI);
      this.movingToDestination = true;
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
        score.enemies++; //
        this.die();
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

        let offsprings = 1;

        for (let i = 0; i < offsprings; i++) {
          let miniSlime;
          if (Math.random() > 0.2) {
            miniSlime = new MiniFlame(this.x, this.y, this.chunkX, this.chunkY);
          } else {
            miniSlime = new Flame(this.x, this.y, this.chunkX, this.chunkY);
          }

          miniSlime.isAttacked = true;
          miniSlime.attackedAngle =
            this.attackedAngle + (Math.random() * 2 - 1);
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
//______________________________________
class Flame extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 2;
    this.attackedAngle = 0;
    this.isAttacked = false;
    this.w = BLOCK_SIZE * 1;
    this.h = BLOCK_SIZE * 1;
    this.speed = 2.5;
    this.angle = this.seed % (2 * Math.PI);

    this.knockbackTimes = 6;
    this.noCoyote = true;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["flame"]
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
      enemiesSheet.animations["flame"]
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
      this.speed = 10; //6
    } else {
      this.speed = 7.2; //4
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
        score.enemies++; //
        this.die();
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

        let offsprings = 1;

        for (let i = 0; i < offsprings; i++) {
          let miniSlime = new MiniFlame(
            this.x,
            this.y,
            this.chunkX,
            this.chunkY
          );
          miniSlime.isAttacked = true;
          miniSlime.attackedAngle =
            this.attackedAngle + (Math.random() * 2 - 1);
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
class MiniFlame extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 1;
    this.attackedAngle = 0;
    this.isAttacked = false;
    this.w = BLOCK_SIZE * 0.6;
    this.h = BLOCK_SIZE * 0.6;
    this.speed = 2.5;
    this.angle = Math.random() * 2 * Math.PI;
    this.noCoyote = false;

    this.knockbackTimes = 9;
    this.knockbackCount = this.knockbackTimes;

    this.killPoints = 1;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["flame"]
    );
    this.sprite.left.visible = false;
    this.sprite.left.x = this.x;
    this.sprite.left.y = this.y;
    this.sprite.left.width = this.w;
    this.sprite.left.height = this.h;
    this.sprite.left.animationSpeed = 0.2;
    this.sprite.left.zIndex = 15;
    this.sprite.left.loop = true;
    this.sprite.left.gotoAndPlay(Math.floor(Math.random() * 4));
    mainContainer.addChild(this.sprite.left);

    this.sprite.right = new PIXI.AnimatedSprite(
      enemiesSheet.animations["flame"]
    );
    this.sprite.right.visible = false;
    this.sprite.right.x = this.x;
    this.sprite.right.y = this.y;
    this.sprite.right.width = this.w;
    this.sprite.right.height = this.h;
    this.sprite.right.animationSpeed = 0.2;
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
      (BLOCK_SIZE * 3.4) ** 2
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
      this.speed = 13;
      //7.6;
      this.sprite.left.animationSpeed = 0.3;
      this.sprite.right.animationSpeed = 0.3;
    } else {
      this.speed = 10; //5.8
      this.sprite.left.animationSpeed = 0.2;
      this.sprite.right.animationSpeed = 0.2;
    }
  }
}
