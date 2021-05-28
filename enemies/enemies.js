//let enemiesContainer = new PIXI.Container();
//mainContainer.addChild(enemiesContainer);
//
function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].isDead) {
      enemies.splice(i, 1);
      i--;
    } else {
      enemies[i].update();
    }
  }
}

let enemies = [];

class Enemy {
  constructor(x, y, chunkX, chunkY) {
    this.x = x;
    this.y = y;

    this.seed = hash3d(this.x, this.y);
    this.tempSeed = this.seed;

    this.chunkX = chunkX;
    this.chunkY = chunkY;

    this.isDead = false;
    this.xMovement = 0;
    this.yMovement = 0;
    this.knockbackSpeed = 24;

    this.coyoteMaxFrames = 1;
    this.coyoteCount = 0;
    this.noCoyote = true;

    this.killPoints = 4;
    this.damage = 5.15;

    this.sprite = {};
  }
  get screenX() {
    return this.x - offset.x;
  }
  get screenY() {
    return this.y - offset.y;
  }
  detectWallCollisions() {
    //Knowing which chunk it exists in
    let chunkIndexX = Math.floor(this.x / CHUNK_WIDTH);
    let chunkIndexY = Math.floor(this.y / CHUNK_WIDTH);

    //Their position in the map
    let chunkMapIndexX = Math.round(
      chunkIndexX - loadedMap[1][1].x / CHUNK_WIDTH + 1
    );
    let chunkMapIndexY = Math.round(
      chunkIndexY - loadedMap[1][1].y / CHUNK_WIDTH + 1
    );

    //Now need to know in which block it lives in
    let chunkX = loadedMap[chunkMapIndexY][chunkMapIndexX].x;
    let chunkY = loadedMap[chunkMapIndexY][chunkMapIndexX].y;

    let blockPosX = Math.floor((this.x - chunkX) / BLOCK_SIZE);
    let blockPosY = Math.floor((this.y - chunkY) / BLOCK_SIZE);

    let collidingBlocks = [];
    for (let x = blockPosX - 1; x <= blockPosX + 1; x++) {
      for (let y = blockPosY - 1; y <= blockPosY + 1; y++) {
        let addBlock = true;
        if (x == -1) {
          try {
            loadedMap[chunkMapIndexY][chunkMapIndexX - 1].map[y][
              CHUNK_SIZE - 1
            ];
          } catch (e) {
            this.die();
            console.log("Hum...");
            return false;
          }

          collidingBlocks.push(
            loadedMap[chunkMapIndexY][chunkMapIndexX - 1].map[y][CHUNK_SIZE - 1]
          );
          addBlock = false;
        } else if (x == CHUNK_SIZE) {
          try {
            loadedMap[chunkMapIndexY][chunkMapIndexX + 1].map[y][0];
          } catch (e) {
            this.die();
            console.log("Hum...");
            return false;
          }

          collidingBlocks.push(
            loadedMap[chunkMapIndexY][chunkMapIndexX + 1].map[y][0]
          );
          addBlock = false;
        }
        if (y == -1) {
          try {
            loadedMap[chunkMapIndexY - 1][chunkMapIndexX].map[CHUNK_SIZE - 1][
              x
            ];
          } catch (e) {
            this.die();
            console.log("Hum...");
            return false;
          }

          collidingBlocks.push(
            loadedMap[chunkMapIndexY - 1][chunkMapIndexX].map[CHUNK_SIZE - 1][x]
          );
          addBlock = false;
        } else if (y == CHUNK_SIZE) {
          try {
            loadedMap[chunkMapIndexY + 1][chunkMapIndexX].map[0][x];
          } catch (e) {
            this.die();
            console.log("Hum...");
            return false;
          }

          collidingBlocks.push(
            loadedMap[chunkMapIndexY + 1][chunkMapIndexX].map[0][x]
          );
          addBlock = false;
        }
        if (addBlock) {
          collidingBlocks.push(
            loadedMap[chunkMapIndexY][chunkMapIndexX].map[y][x]
          );
        }
      }
    }
    for (let block of collidingBlocks) {
      //if (block.identity == 1) block.highlight();
      if (block.identity == 0) {
        if (
          rectRectCollision(
            this.x - offset.x,
            this.y - offset.y,
            this.w,
            this.h,
            block.screenX,
            block.screenY,
            BLOCK_SIZE * 0.8,
            BLOCK_SIZE * 0.8
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }
  inScreen() {
    return (
      this.x - offset.x > 0 &&
      this.x - offset.x < canvas.width &&
      this.y - offset.y > 0 &&
      this.y - offset.y < canvas.height
    );
  }
  die() {
    this.isDead = true;
    for (let state in this.sprite) {
      this.sprite[state].destroy();
    }
  }
  checkIfOnLoadedChunks() {
    if (
      (this.screenX < -CHUNK_WIDTH ||
        this.screenX > CHUNK_WIDTH * 2 ||
        this.screenY < -CHUNK_WIDTH ||
        this.screenY > CHUNK_WIDTH * 2) &&
      (this.chunkX < loadedMap[0][0].x ||
        this.chunkX > loadedMap[0][2].x ||
        this.chunkY < loadedMap[0][0].y ||
        this.chunkY > loadedMap[2][0].y)
    ) {
      //console.log("Offchunks");
      this.die();
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
        score.enemies++;
        for (let i = 0; i < 35; i++) {
          particles.push(
            new Particle(
              this.x + Math.cos(this.attackedAngle) * 3,
              this.y + Math.sin(this.attackedAngle) * 3,
              0xff0000,
              2 + Math.random() * 5,
              this.attackedAngle + Math.PI * Math.random() - Math.PI / 2,
              Math.random() * 5 + 5,
              Math.random() * 5 + 3
            )
          );
        }
        screenShake.amplitude = 4.5;
        health.timer += this.killPoints;
        health.scoredCount = 12;
      } else {
        screenShake.amplitude = 3;
      }
      sounds.damage.play();
      //ScreenShake
      screenShake.timeLeft = 5;
    }
  }
  knockback() {
    this.xMovement =
      Math.cos(this.attackedAngle) *
      ((this.knockbackSpeed * this.knockbackCount) / this.knockbackTimes);
    this.yMovement =
      Math.sin(this.attackedAngle) *
      ((this.knockbackSpeed * this.knockbackCount) / this.knockbackTimes);

    this.x += this.xMovement;
    if (this.detectWallCollisions()) {
      this.x -= this.xMovement;
      //this.stopAttacked();
      //console.log("Wall x");
    }
    this.y += this.yMovement;
    if (this.detectWallCollisions()) {
      this.y -= this.yMovement;
      //this.stopAttacked();
      //console.log("Wall y");
    }

    if (this.knockbackCount <= 0) {
      this.stopAttacked();
    } else {
      this.knockbackCount--;
    }
  }
  stopAttacked() {
    for (let state in this.sprite) {
      this.sprite[state].play();
      this.sprite[state].tint = 0xffffff;
    }
    this.knockbackCount = this.knockbackTimes;
    this.isAttacked = false;
  }
  checkIfTouchingPlayer() {
    if (
      !this.isAttacked &&
      !player.isDashing &&
      player.damageCount == 0 &&
      this.inScreen() &&
      rectRectCollision(
        this.screenX,
        this.screenY,
        this.w,
        this.h,
        player.x,
        player.y,
        player.w,
        player.h
      )
    ) {
      if (this.coyoteCount > this.coyoteMaxFrames || this.noCoyote) {
        player.damageCount = player.damageMax;
        //console.log("Touch");
        screenShake.timeLeft = 4;
        screenShake.amplitude = 5;

        //Substract points
        health.timer -= this.damage;
        health.scoredCount = -10;

        playSound("ouch");
        return true;
      } else {
        this.coyoteCount++;
      }
    } else {
      this.coyoteCount = 0;
    }
    return false;
  }
}

class RockBeetle extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 2;
    this.attackedAngle = 0;
    this.isAttacked = false;
    this.w = BLOCK_SIZE * 0.82;
    this.h = BLOCK_SIZE * 0.82;
    this.speed = 4.5; //2.5
    this.angle = this.seed % (2 * Math.PI);

    this.knockbackTimes = 6;
    this.knockbackCount = this.knockbackTimes;

    this.killPoints = 6.75;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["rockBeetleL"]
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
      enemiesSheet.animations["rockBeetleR"]
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
      this.sprite.left.animationSpeed = 0.3;
      this.sprite.right.animationSpeed = 0.3;
    } else {
      this.speed = 3;
      this.sprite.left.animationSpeed = 0.2;
      this.sprite.right.animationSpeed = 0.2;
    }
  }
}
//____________________________________________________________________________________________
class Bat extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 1;
    this.w = BLOCK_SIZE * 0.88;
    this.h = BLOCK_SIZE * 0.88;

    this.attackedAngle = 0;
    this.isAttacked = false;

    //Movement
    this.movingToDestination = true;
    this.travelCount = 0;
    this.travelMax = 15; //21
    this.speed = 3.6; //2
    this.angle = this.seed % (2 * Math.PI);

    this.killPoints = 6.75;

    this.knockbackTimes = 6;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["batLeft"]
    );
    this.sprite.right = new PIXI.AnimatedSprite(
      enemiesSheet.animations["batRight"]
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
      if (this.travelCount > this.travelMax && Math.random() > 0.6) {
        this.movingToDestination = false;
        this.travelCount = 0;

        enemies.push(
          new Projectile(this.x + this.w / 2, this.y + this.h / 2, this.angle)
        );
      }
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
//______________________________________
class Projectile extends Enemy {
  constructor(x, y, angle) {
    super(x, y);

    this.angle = angle;
    this.speed = 4;
    this.w = BLOCK_SIZE * 0.3;
    this.h = BLOCK_SIZE * 0.3;

    this.noCoyote = true;
    this.points = 0;

    this.loadSprite();
  }
  loadSprite() {
    this.sprite = {};
    this.sprite.projectile = new PIXI.Sprite(
      enemiesSheet.textures["projectile.png"]
    );
    this.sprite.projectile.visible = true;
    this.sprite.projectile.x = this.x;
    this.sprite.projectile.y = this.y;
    this.sprite.projectile.width = this.w;
    this.sprite.projectile.height = this.h;
    this.sprite.projectile.zIndex = 14;

    mainContainer.addChild(this.sprite.projectile);
  }
  update() {
    this.sprite.projectile.x = this.x - offset.x;
    this.sprite.projectile.y = this.y - offset.y;
    this.checkIfHit();
    this.checkIfOnLoadedChunks();

    if (!this.isDead) {
      if (this.checkIfTouchingPlayer()) {
        for (let i = 0; i < 15; i++) {
          particles.push(
            new Particle(
              this.x,
              this.y,
              0x0c0031,
              2 + Math.random() * 2,
              Math.PI * Math.random() * 2,
              Math.random() * 4 + 3,
              Math.random() * 5 + 3
            )
          );
        }
        this.die();
      } else {
        this.move();
      }
    }
  }
  move() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.detectWallCollisions()) {
      for (let i = 0; i < 15; i++) {
        particles.push(
          new Particle(
            this.x,
            this.y,
            0x0c0031,
            2 + Math.random() * 2,
            Math.PI * Math.random() * 2,
            Math.random() * 4 + 3,
            Math.random() * 5 + 3
          )
        );
      }
      this.die();
    }
  }
  checkIfHit() {
    if (!player.isAttacking) return;

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
      for (let i = 0; i < 15; i++) {
        particles.push(
          new Particle(
            this.x,
            this.y,
            0x0c0031,
            2 + Math.random() * 2,
            Math.PI * Math.random() * 2,
            Math.random() * 4 + 3,
            Math.random() * 5 + 3
          )
        );
      }
      this.die();
    }
  }
  checkIfOnLoadedChunks() {
    if (!this.inScreen()) {
      //console.log("Offchunks B");
      this.die();
    }
  }
}
