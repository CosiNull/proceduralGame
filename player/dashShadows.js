class DashShadow {
  constructor(x, y, facingRight) {
    this.oriX = x + offset.x;
    this.oriY = y + offset.y;

    this.x = x;
    this.y = y;
    this.h = player.h;
    this.w = player.w;

    this.facingRight = facingRight;
    this.life = player.dashRepeatCount;
    this.loadSprite();
  }
  loadSprite() {
    if (this.facingRight)
      this.sprite = new PIXI.Sprite(playerSheet.textures["walkRight1.png"]);
    else this.sprite = new PIXI.Sprite(playerSheet.textures["walkLeft1.png"]);

    this.sprite.width = this.w * 1.75;
    this.sprite.height = this.h * 1.75;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.anchor.set(0.2, 0.25);
    this.sprite.zIndex = 8;
    this.sprite.tint = 0x2222222;
    this.sprite.alpha = 0.1 + this.life * 0.1;

    mainContainer.addChild(this.sprite);
  }
  draw() {
    this.x = this.oriX - offset.x;
    this.y = this.oriY - offset.y;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.alpha = 0.3 + this.life * 0.1;
    this.life--;
  }
  delete() {
    this.sprite.destroy();
  }
}

let dashShadows = [];

function drawShadows() {
  for (let i = 0; i < dashShadows.length; i++) {
    if (dashShadows[i].life < 0) {
      dashShadows[i].delete();
      dashShadows.splice(i, 1);
      i--;
    } else {
      dashShadows[i].draw();
    }
  }
}

class Money {
  constructor(x, y, amount) {
    this.oriX = x + offset.x;
    this.oriY = y + offset.y;

    this.amount = amount;

    this.x = x;
    this.y = y;
    this.h = BLOCK_SIZE;
    this.w = BLOCK_SIZE;

    this.maxLife = 20;
    this.life = this.maxLife;
    this.loadSprite();
  }
  loadSprite() {
    this.sprite = new PIXI.Text("+" + this.amount + "$!", {
      fontFamily: "Press Start 2P, cursive",
      fontSize: BLOCK_SIZE * (0.3 + this.amount / 190),
      fill: 0xffd700,
      align: "center",
    });

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.zIndex = 100;

    mainContainer.addChild(this.sprite);
  }
  draw() {
    this.x = this.oriX - offset.x;
    this.y = this.oriY - offset.y;

    this.sprite.x = this.x;
    this.sprite.y = this.y - (this.maxLife - this.life) * BLOCK_SIZE * 0.01;
    this.sprite.alpha = 0.4 + (this.maxLife - this.life) / this.maxLife;

    this.life--;
  }
  delete() {
    this.sprite.destroy();
  }
}
