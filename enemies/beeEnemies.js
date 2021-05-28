class Bee extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 2;
    this.w = BLOCK_SIZE * 0.88;
    this.h = BLOCK_SIZE * 0.88;

    this.attackedAngle = 0;
    this.isAttacked = false;

    //Movement
    this.movingToDestination = true;
    this.travelMax = 16; //24
    this.travelCount = Math.random() * this.travelMax;
    this.speed = 4.8;
    this.angle = this.seed % (2 * Math.PI);

    this.knockbackTimes = 5;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(enemiesSheet.animations["beeL"]);
    this.sprite.right = new PIXI.AnimatedSprite(
      enemiesSheet.animations["beeR"]
    );

    for (let state in this.sprite) {
      this.sprite[state].visible = false;
      this.sprite[state].x = this.x;
      this.sprite[state].y = this.y;
      this.sprite[state].width = this.w;
      this.sprite[state].height = this.h;
      this.sprite[state].animationSpeed = 0.25;
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
      if (this.travelCount > this.travelMax && Math.random() > 0.77) {
        this.movingToDestination = false;
        this.travelCount = 0;

        let angle = calculateAngle(
          this.screenX,
          this.screenY,
          player.x,
          player.y
        );

        enemies.push(
          new Projectile(this.x + this.w / 2, this.y + this.h / 2, angle)
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

class Worm extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 1;
    this.attackedAngle = 0;
    this.isAttacked = false;
    this.w = BLOCK_SIZE * 0.82;
    this.h = BLOCK_SIZE * 0.82;
    this.speed = 2.5;
    this.angle = this.seed % (2 * Math.PI);
    this.noCoyote = false;

    this.knockbackTimes = 7;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["wormL"]
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
      enemiesSheet.animations["wormR"]
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
      this.speed = 12.4; //6.9
      this.sprite.left.animationSpeed = 0.3;
      this.sprite.right.animationSpeed = 0.3;
    } else {
      this.speed = 10.2; //5.8
      this.sprite.left.animationSpeed = 0.2;
      this.sprite.right.animationSpeed = 0.2;
    }
  }
}
