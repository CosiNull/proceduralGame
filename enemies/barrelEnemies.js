class BarrelMonster extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 2;
    this.w = BLOCK_SIZE * 0.65;
    this.h = BLOCK_SIZE * 0.8;

    this.attackedAngle = 0;
    this.isAttacked = false;

    this.speed = 5.1; //3.4

    this.knockbackTimes = 6;
    this.knockbackCount = this.knockbackTimes;

    this.hiding = true;
    this.loadSprite();
  }
  loadSprite() {
    //this.sprite.left = new PIXI.AnimatedSprite(
    //  enemiesSheet.animations["batLeft"]
    //);
    this.sprite.right = new PIXI.AnimatedSprite(
      enemiesSheet.animations["barrelMonsterR"]
    );
    this.sprite.hide = new PIXI.AnimatedSprite([
      terrainSheet.textures["barril.png"],
    ]);

    for (let state in this.sprite) {
      this.sprite[state].visible = false;
      this.sprite[state].x = this.x;
      this.sprite[state].y = this.y;
      this.sprite[state].width = this.w;
      this.sprite[state].height = this.h;
      this.sprite[state].animationSpeed = 0.3;
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
        if (this.hide) {
          this.sprite.hide.x = this.x - offset.x;
          this.sprite.hide.y = this.y - offset.y;
          this.sprite.hide.visible = true;
          this.sprite.right.visible = false;
        } else {
          this.sprite.right.x = this.x - offset.x;
          this.sprite.right.y = this.y - offset.y;
          this.sprite.right.visible = true;
          this.sprite.hide.visible = false;
        }

        this.checkIfHit();
      } else {
        this.sprite.right.x = this.x - offset.x;
        this.sprite.right.y = this.y - offset.y;
        this.sprite.right.visible = true;
        this.knockback();
      }
    } else {
      this.checkIfOnLoadedChunks();
      this.sprite.right.visible = false;
      this.sprite.hide.visible = false;
    }
  }
  move() {
    if (
      Math.hypot(this.screenX - player.x, this.screenY - player.y) <
      BLOCK_SIZE * 4.8
    ) {
      this.hide = false;
      this.angle = calculateAngle(
        this.screenX,
        this.screenY,
        player.x,
        player.y
      );
      this.xMovement = Math.cos(this.angle) * this.speed;
      this.yMovement = Math.sin(this.angle) * this.speed;

      this.x += this.xMovement;
      if (this.detectWallCollisions()) {
        this.x -= this.xMovement;
      }
      this.y += this.yMovement;
      if (this.detectWallCollisions()) {
        this.y -= this.yMovement;
      }
    } else {
      this.hide = true;
    }
  }
}
//Pyramid
class Pyramid extends Enemy {
  constructor(x, y, chunkX, chunkY) {
    super(x, y, chunkX, chunkY);
    this.life = 2;
    this.w = BLOCK_SIZE * 1.1;
    this.h = BLOCK_SIZE * 1.1;

    this.attackedAngle = 0;
    this.isAttacked = false;

    //Movement
    this.movingToDestination = true;
    this.travelCount = 0;
    this.travelMax = 28; //32
    this.speed = 3.6; //2;
    this.angle = this.seed % (2 * Math.PI);

    this.knockbackTimes = 6;
    this.knockbackCount = this.knockbackTimes;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite.left = new PIXI.AnimatedSprite(
      enemiesSheet.animations["pyramid"]
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
        this.sprite.left.visible = true;
        this.sprite.left.x = this.x - offset.x;
        this.sprite.left.y = this.y - offset.y;
        this.checkIfHit();
      } else {
        this.sprite.left.visible = true;
        this.sprite.left.x = this.x - offset.x;
        this.sprite.left.y = this.y - offset.y;
        this.knockback();
      }
    } else {
      this.checkIfOnLoadedChunks();
      this.sprite.left.visible = false;
    }
  }
  move() {
    if (this.movingToDestination) {
      this.xMovement = Math.cos(this.angle) * this.speed;
      this.yMovement = Math.sin(this.angle) * this.speed;

      this.x += this.xMovement;
      this.y += this.yMovement;

      this.travelCount++;
      if (this.travelCount > this.travelMax && Math.random() > 0.89) {
        this.movingToDestination = false;
        this.travelCount = 0;

        enemies.push(
          new Projectile(this.x + this.w / 2, this.y + this.h / 2, this.angle)
        );
        enemies.push(
          new Projectile(
            this.x + this.w / 2,
            this.y + this.h / 2,
            this.angle - Math.PI / 3
          )
        );
        enemies.push(
          new Projectile(
            this.x + this.w / 2,
            this.y + this.h / 2,
            this.angle + Math.PI / 3
          )
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
