//Player class
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.damageMax = 20;
    this.life = 20; //
    //this.previousPos = { x: this.x, y: this.y };

    this.maxSpeed = (BLOCK_SIZE * 8) / BLOCK_SIZE;
    this.diagSpeed = Math.sqrt(this.maxSpeed ** 2 / 2);
    this.speed = this.maxSpeed;

    this.h = BLOCK_SIZE * 0.6;
    this.w = BLOCK_SIZE * 0.6;

    this.currentMovement = null;
    this.acceleration = 0;

    this.animations = {
      idleRight: null,
    };
    this.state = "walkLeft";

    this.swordUp = true;
    this.isAttacking = false;
    this.lastAttack = Date.now();
    this.attackTime = 300;
    this.attackCircle = {
      x: null,
      y: null,
      r: BLOCK_SIZE * 0.72,
    };

    this.dashRepeatCount = 5;
    this.dashSpeed = BLOCK_SIZE * 0.585;
    this.isDashing = false;
    this.dashTimeout = 480;
    this.lastDash = 0;
    this.dashCount = 0;
    this.dashDirection = {};
    this.dashDamage = false;
    this.lastDashParticle = Date.now();

    this.damageCount = 0;

    this.enteredBiome = new Set();

    this.loadSprites();
  }
  setSpeed(speed) {
    this.maxSpeed = speed;
    this.diagSpeed = Math.sqrt(this.maxSpeed ** 2 / 2);
  }
  loadSprites() {
    //Idle right//
    this.animations.idleRight = new PIXI.AnimatedSprite(
      playerSheet.animations["idleRight"]
    );
    this.animations.idleRight.animationSpeed = 0.09;

    //idle left//
    this.animations.idleLeft = new PIXI.AnimatedSprite(
      playerSheet.animations["idleLeft"]
    );
    this.animations.idleLeft.animationSpeed = 0.09;

    //Walk Right//
    this.animations.walkRight = new PIXI.AnimatedSprite([
      playerSheet.textures["idleRight1.png"],
      playerSheet.textures["walkRight1.png"],
      playerSheet.textures["idleRight2.png"],
      playerSheet.textures["walkRight2.png"],
    ]);
    this.animations.walkRight.animationSpeed = 0.16;
    this.animations.walkRight.play();

    //Walk Left//
    this.animations.walkLeft = new PIXI.AnimatedSprite([
      playerSheet.textures["idleLeft1.png"],
      playerSheet.textures["walkLeft1.png"],
      playerSheet.textures["idleLeft2.png"],
      playerSheet.textures["walkLeft2.png"],
    ]);
    this.animations.walkLeft.animationSpeed = 0.16;

    for (let state in this.animations) {
      this.animations[state].loop = true;
      this.animations[state].width = this.w * 1.75;
      this.animations[state].height = this.h * 1.75;
      this.animations[state].x = this.x;
      this.animations[state].y = this.y;
      this.animations[state].anchor.set(0.2, 0.25);
      this.animations[state].zIndex = 10;
      this.animations[state].play();
      this.animations[state].visible = false;
      mainContainer.addChild(this.animations[state]);
    }

    //Swords
    this.sword = new PIXI.Sprite(playerSheet.textures["sword.png"]);
    this.sword.zIndex = 9;
    this.sword.width = this.w * 1.85;
    this.sword.height = this.h * 1.85;
    this.sword.anchor.set(0, 0.5);

    mainContainer.addChild(this.sword);

    //
    this.swordLeft = new PIXI.Sprite(playerSheet.textures["swordLeft.png"]);
    this.swordLeft.zIndex = 9;
    this.swordLeft.width = this.w * 1.85;
    this.swordLeft.height = this.h * 1.85;
    this.swordLeft.anchor.set(1, 0.5);
    mainContainer.addChild(this.swordLeft);

    //Attack
    this.attackRight = new PIXI.AnimatedSprite(
      playerSheet.animations["swipeRight"]
    );
    this.attackRight.zIndex = 9;
    this.attackRight.loop = false;
    this.attackRight.animationSpeed = 0.5;
    this.attackRight.width = this.w * 3;
    this.attackRight.height = this.h * 2.6;
    this.attackRight.anchor.set(0, 0.5);
    this.attackRight.onComplete = function () {
      this.visible = false;
      player.isAttacking = false;
      player.lastAttack = Date.now();
      player.dashDamage = false;
    };
    this.attackRight.visible = false;

    mainContainer.addChild(this.attackRight);

    this.attackLeft = new PIXI.AnimatedSprite(
      playerSheet.animations["swipeLeft"]
    );
    this.attackLeft.zIndex = 9;
    this.attackLeft.loop = false;
    this.attackLeft.animationSpeed = 0.5;
    this.attackLeft.width = this.w * 3;
    this.attackLeft.height = this.h * 2.6;
    this.attackLeft.anchor.set(1, 0.5);
    this.attackLeft.onComplete = function () {
      this.visible = false;
      player.isAttacking = false;
      player.lastAttack = Date.now();
      player.dashDamage = false;
    };

    mainContainer.addChild(this.attackLeft);

    //Dash
    this.animations.dashRight = new PIXI.Sprite(
      playerSheet.textures["walkRight1.png"]
    );
    this.animations.dashRight.width = this.w * 1.75;
    this.animations.dashRight.height = this.h * 1.75;
    this.animations.dashRight.x = this.x;
    this.animations.dashRight.y = this.y;
    this.animations.dashRight.anchor.set(0.2, 0.25);
    this.animations.dashRight.zIndex = 10;
    this.animations.dashRight.tint = 0x333333;
    this.animations.dashRight.visible = false;

    mainContainer.addChild(this.animations.dashRight);

    this.animations.dashLeft = new PIXI.Sprite(
      playerSheet.textures["walkLeft1.png"]
    );
    this.animations.dashLeft.width = this.w * 1.75;
    this.animations.dashLeft.height = this.h * 1.75;
    this.animations.dashLeft.x = this.x;
    this.animations.dashLeft.y = this.y;
    this.animations.dashLeft.anchor.set(0.2, 0.25);
    this.animations.dashLeft.zIndex = 10;
    this.animations.dashLeft.tint = 0x444444;
    this.animations.dashLeft.visible = false;

    mainContainer.addChild(this.animations.dashLeft);
  }
  draw() {
    c.fillStyle = "cyan";
    c.fillRect(this.x, this.y, this.w, this.h);

    for (let animationState in this.animations) {
      this.animations[animationState].visible = false;
    }
    this.animations[this.state].visible = true;
    this.animations[this.state].x = this.x;
    this.animations[this.state].y = this.y;
  }
  move() {
    let keys = {};

    if (keyPressed["KeyW"]) {
      //cameraFocus.y = canvas.height / 2 + BLOCK_SIZE * 1.5;
      keys.w = true;
    }
    if (keyPressed["KeyS"]) {
      //cameraFocus.y = canvas.height / 2 - BLOCK_SIZE * 1.5;
      keys.s = true;
    }
    if (keyPressed["KeyD"]) {
      //cameraFocus.x = canvas.width / 2 - BLOCK_SIZE * 1.5;
      keys.d = true;
    }
    if (keyPressed["KeyA"]) {
      //cameraFocus.x = canvas.width / 2 + BLOCK_SIZE * 1.5;
      keys.a = true;
    }

    let keysArr = Object.keys(keys);
    let numOfKeys = keysArr.length;
    this.xMovement = 0;
    this.yMovement = 0;

    if (numOfKeys == 1) {
      this.speed = this.maxSpeed;
      if (keys.w) {
        this.yMovement = -this.maxSpeed;
      } else if (keys.s) {
        this.yMovement = this.maxSpeed;
      } else if (keys.a) {
        this.xMovement = -this.maxSpeed;
      } else if (keys.d) {
        this.xMovement = this.maxSpeed;
      }
    } else if (numOfKeys == 2) {
      if (movKeys[keysArr[0]] != movKeys[keysArr[1]]) {
        this.speed = this.diagSpeed;
        if (keys.w) {
          this.yMovement = -this.diagSpeed;
        } else if (keys.s) {
          this.yMovement = this.diagSpeed;
        }
        if (keys.a) {
          this.xMovement = -this.diagSpeed;
        } else if (keys.d) {
          this.xMovement = this.diagSpeed;
        }
      }
    } else if (numOfKeys == 3) {
      let oddIndex;
      //3 iterations max to see the odd one out
      if (movKeys[keysArr[0]] == movKeys[keysArr[1]]) {
        oddIndex = 2;
      } else if (movKeys[keysArr[1]] == movKeys[keysArr[2]]) {
        oddIndex = 0;
      } else if (movKeys[keysArr[0]] == movKeys[keysArr[2]]) {
        oddIndex = 1;
      }

      this.speed = this.maxSpeed;
      if (keysArr[oddIndex] == "w") {
        this.yMovement = -this.maxSpeed;
      } else if (keysArr[oddIndex] == "s") {
        this.yMovement = this.maxSpeed;
      } else if (keysArr[oddIndex] == "a") {
        this.xMovement = -this.maxSpeed;
      } else if (keysArr[oddIndex] == "d") {
        this.xMovement = this.maxSpeed;
      }
    }

    this.x += this.xMovement;
    if (this.handleCollisions()) {
      this.x -= this.xMovement;
    }
    this.y += this.yMovement;
    if (this.handleCollisions()) {
      this.y -= this.yMovement;
    }
  }
  handleCollisions() {
    //Knowing which chunk it exists in
    let chunkIndexX = Math.floor((offset.x + player.x) / CHUNK_WIDTH);
    let chunkIndexY = Math.floor((offset.y + player.y) / CHUNK_WIDTH);

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

    let blockPosX = Math.floor((player.x - (chunkX - offset.x)) / BLOCK_SIZE);
    let blockPosY = Math.floor((player.y - (chunkY - offset.y)) / BLOCK_SIZE);

    let collidingBlocks = [];
    for (let x = blockPosX - 1; x <= blockPosX + 1; x++) {
      for (let y = blockPosY - 1; y <= blockPosY + 1; y++) {
        let addBlock = true;
        if (x == -1) {
          collidingBlocks.push(
            loadedMap[chunkMapIndexY][chunkMapIndexX - 1].map[y][CHUNK_SIZE - 1]
          );
          addBlock = false;
        } else if (x == CHUNK_SIZE) {
          collidingBlocks.push(
            loadedMap[chunkMapIndexY][chunkMapIndexX + 1].map[y][0]
          );
          addBlock = false;
        }
        if (y == -1) {
          collidingBlocks.push(
            loadedMap[chunkMapIndexY - 1][chunkMapIndexX].map[CHUNK_SIZE - 1][x]
          );
          addBlock = false;
        } else if (y == CHUNK_SIZE) {
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
      //if (block.identity == 1) {
      //  block.highlight();
      //}

      if (block.identity == 0) {
        if (
          rectRectCollision(
            this.x,
            this.y,
            this.w,
            this.h,
            block.screenX,
            block.screenY,
            BLOCK_SIZE,
            BLOCK_SIZE
          )
        ) {
          //block.highlight();
          //Check its movement

          //if (horizontal) {
          //  //if (this.xMovement < 0) {
          //  //  this.x = block.x - offset.x + BLOCK_SIZE;
          //  //} else if (this.xMovement > 0) {
          //  //  this.x = block.x - offset.x - this.w;
          //  //}
          //  this.x -= this.xMovement;
          //} else {
          //  //if (this.yMovement < 0) {
          //  //  this.y = block.y - offset.y + BLOCK_SIZE;
          //  //} else if (this.yMovement > 0) {
          //  //  this.y = block.y - offset.y - this.h;
          //  //}
          //  this.y -= this.yMovement;
          //}
          return true;
        }
      }
    }
    return false;
  }
  updateState() {
    let movementType = "walk";
    if (this.xMovement == 0 && this.yMovement == 0) {
      movementType = "idle";
    } else if (this.isDashing) {
      movementType = "dash";
    }

    let goingRight = true;
    if (mouse.x > this.x + this.h / 2) {
      movementType += "Right";
    } else {
      movementType += "Left";
      goingRight = false;
    }
    this.state = movementType;

    //Sword and dash
    if (this.isDashing) {
      this.swordLeft.visible = false;
      this.sword.visible = false;
      this.xMovement = Math.floor(this.dashDirection.x * this.dashSpeed);
      this.yMovement = Math.floor(this.dashDirection.y * this.dashSpeed);

      //console.log(this.xMovement, this.yMovement);

      this.x += this.xMovement;
      if (this.handleCollisions()) {
        this.x -= this.xMovement;
        this.dashCount = 0;
      }
      this.y += this.yMovement;
      if (this.handleCollisions()) {
        this.y -= this.yMovement;
        this.dashCount = 0;
      }

      this.dashCount--;
      if (this.dashCount <= 0) {
        this.isDashing = false;
        player.dashDamage = true;
      }
      dashShadows.push(new DashShadow(this.x, this.y, goingRight));
    } else {
      this.drawSword(goingRight);
    }
  }
  drawSword(goingRight) {
    this.swordLeft.visible = false;
    this.sword.visible = false;
    let angle = calculateAngle(
      this.x + this.w / 2,
      this.y + this.h / 2,
      mouse.x,
      mouse.y
    );

    if (goingRight) {
      if (!this.isAttacking) {
        if (this.swordUp) {
          //I am Here
          this.sword.zIndex = 9;
          this.sword.visible = true;
          this.sword.x =
            this.x + BLOCK_SIZE * 0.58 + Math.cos(angle) * BLOCK_SIZE * 0.25;
          this.sword.y = this.y + Math.sin(angle) * BLOCK_SIZE * 0.25;

          this.sword.rotation = -Math.PI * 0.86 - -angle * 0.5;
        } else {
          this.swordLeft.zIndex = 11;
          this.swordLeft.visble = true;
          this.swordLeft.x =
            this.x + BLOCK_SIZE * 0.51 + Math.cos(angle) * BLOCK_SIZE * 0.22;
          this.swordLeft.y =
            this.y + this.h * 0.92 + Math.sin(angle) * BLOCK_SIZE * 0.22;
          this.swordLeft.rotation = -0.1 * 0.86 - -angle * 0.5;
          this.swordLeft.visible = true;
        }
      } else {
        if (Math.abs(this.attackAngle) <= Math.PI / 2) {
          this.attackRight.visible = true;
          this.sword.visible = false;
          let angle = this.attackAngle;
          this.attackRight.x =
            this.x + this.w * 0.2 - Math.cos(angle) * BLOCK_SIZE * 0.2;
          this.attackRight.y =
            this.y + this.h * 0.5 - Math.sin(angle) * BLOCK_SIZE * 0.2;

          this.attackRight.rotation = angle;
        }
      }

      //___________________________________________________________________________
    } else {
      if (!this.isAttacking) {
        if (this.swordUp) {
          //I am Here
          this.swordLeft.zIndex = 9;
          this.swordLeft.visible = true;
          this.swordLeft.x =
            this.x + BLOCK_SIZE * 0.06 + Math.cos(angle) * BLOCK_SIZE * 0.25;
          this.swordLeft.y = this.y + Math.sin(angle) * BLOCK_SIZE * 0.25;

          let calculatedAngle = angle > 0 ? angle - Math.PI : angle + Math.PI;
          this.swordLeft.rotation = Math.PI * 0.86 + calculatedAngle * 0.5;
        } else {
          this.sword.zIndex = 11;
          this.sword.visble = true;
          this.sword.x =
            this.x + BLOCK_SIZE * -0.01 + Math.cos(angle) * BLOCK_SIZE * 0.22;
          this.sword.y =
            this.y + this.h * 0.92 + Math.sin(angle) * BLOCK_SIZE * 0.22;
          let calculatedAngle = angle > 0 ? angle - Math.PI : angle + Math.PI;
          this.sword.rotation = -0.1 * 0.86 - -calculatedAngle * 0.5;
          this.sword.visible = true;
        }
      } else {
        if (Math.abs(this.attackAngle) >= Math.PI / 2) {
          this.attackLeft.visible = true;
          this.swordLeft.visible = false;
          let angle = this.attackAngle + Math.PI;
          this.attackLeft.x =
            this.x + this.w * 0.8 + Math.cos(angle) * BLOCK_SIZE * 0.2;
          this.attackLeft.y =
            this.y + this.h * 0.5 + Math.sin(angle) * BLOCK_SIZE * 0.2;

          this.attackLeft.rotation = angle;
        }
      }
    }

    if (this.isAttacking) {
      c.fillStyle = "red";
      c.beginPath();
      if (goingRight) {
        this.attackCircle.x =
          this.attackRight.x + Math.cos(this.attackAngle) * BLOCK_SIZE * 0.9;
        this.attackCircle.y =
          this.attackRight.y + Math.sin(this.attackAngle) * BLOCK_SIZE * 0.9;
      } else {
        this.attackCircle.x =
          this.attackLeft.x + Math.cos(this.attackAngle) * BLOCK_SIZE * 0.9;
        this.attackCircle.y =
          this.attackLeft.y + Math.sin(this.attackAngle) * BLOCK_SIZE * 0.9;
      }
      c.arc(
        this.attackCircle.x,
        this.attackCircle.y,
        this.attackCircle.r,
        0,
        Math.PI * 2
      );
      c.fill();
    }
  }
  damaged() {
    this.damageCount--;
    let number = this.damageCount % 3;
    this.animations[this.state].alpha = number == 0 ? 0 : 1;
    this.animations[this.state].tint = 0xff0000;

    if (this.damageCount == 0) {
      for (let state in this.animations) {
        this.animations[state].alpha = 1;
        this.animations[state].tint = 0xffffff;
      }
    }
  }
  attack() {
    if (
      !player.isAttacking &&
      mouse.leftClick &&
      Date.now() - this.lastAttack > this.attackTime
    ) {
      if (this.dashDamage) {
        playSound("specialAttack");
      } else {
        playSound("swing");
      }
      player.isAttacking = true;
      player.attackAngle = calculateAngle(
        player.x + player.w / 2,
        player.y + player.h / 2,
        mouse.x,
        mouse.y
      );
      player.swordUp = player.swordUp == false;

      //console.log(player.attackAngle);

      player.attackRight.gotoAndPlay(0);
      player.attackLeft.gotoAndPlay(0);
    }
  }
  //Biome Entrance
  checkEnteredNewBiome() {
    //Which Chunk
    let chunkIndexX = Math.floor((offset.x + player.x) / CHUNK_WIDTH);
    let chunkIndexY = Math.floor((offset.y + player.y) / CHUNK_WIDTH);

    //Their position in the map
    let chunkMapIndexX = Math.round(
      chunkIndexX - loadedMap[1][1].x / CHUNK_WIDTH + 1
    );
    let chunkMapIndexY = Math.round(
      chunkIndexY - loadedMap[1][1].y / CHUNK_WIDTH + 1
    );

    if (
      !this.enteredBiome.has(loadedMap[chunkMapIndexY][chunkMapIndexX].biome)
    ) {
      this.enteredBiome.add(loadedMap[chunkMapIndexY][chunkMapIndexX].biome);
      //health.maxTimer += 1;
      health.timer += 16;
      health.newBiomeCount = 20;
      if (loadedMap[chunkMapIndexY][chunkMapIndexX].biome != "normal") {
        playSound("discovery");
      }
    }
  }

  dashParticles() {
    if (this.dashDamage) {
      this.sword.tint = 0x333333;
      this.swordLeft.tint = 0x333333;
      this.attackRight.tint = 0x222222;
      this.attackLeft.tint = 0x222222;
      this.attackRight.width = this.w * 3.8;
      this.attackLeft.width = this.w * 3.8;
      this.attackRight.height = this.h * 2.7;
      this.attackLeft.height = this.h * 2.7;
      this.attackCircle.r = BLOCK_SIZE * 0.88;
    } else {
      this.sword.tint = 0xffffff;
      this.swordLeft.tint = 0xffffff;
      this.attackRight.tint = 0xffffff;
      this.attackLeft.tint = 0xffffff;
      this.attackRight.width = this.w * 3;
      this.attackLeft.width = this.w * 3;
      this.attackRight.height = this.h * 2.6;
      this.attackLeft.height = this.h * 2.6;
      this.attackCircle.r = BLOCK_SIZE * 0.72;
    }
  }

  update() {
    if (player.dead) {
      this.die();
      return;
    }
    if (!this.isDashing) {
      this.move();
      this.attack();
      this.dashParticles();
    }

    this.updateState();
    this.checkEnteredNewBiome();

    if (this.damageCount > 0) {
      this.damaged();
    }
  }
  die() {
    for (let state in this.animations) {
      this.animations[state].visible = false;
    }
    this.sword.visible = false;
    this.swordLeft.visible = false;
    playSound("gameOver");
  }
  destroySprites() {
    for (let state in this.animations) {
      this.animations[state].destroy();
    }
    this.sword.destroy();
    this.swordLeft.destroy();
    this.attackLeft.destroy();
    this.attackRight.destroy();
  }
}
let player; //go check load.js

//Movement
let movKeys = {
  w: 1, //v
  s: 1, //v
  a: 0, //h
  d: 0, //h
};
