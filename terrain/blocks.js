function inScreen(x, y) {
  return x < 0 || x >= canvas.width || y < 0 || y >= canvas.height;
}
class Wall {
  constructor(x, y, container, biome = "normal") {
    this.x = x;
    this.y = y;

    this.biome = biome;
    this.identity = 0;

    this.myContainer = container;

    this.loadSprite();

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
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    //this.myContainer.setChildIndex(this.sprite, 0);

    this.sprite.zIndex = 0;
    this.sprite.width = BLOCK_SIZE;
    this.sprite.height = BLOCK_SIZE;

    this.myContainer.addChild(this.sprite);
  }
  loadSprite() {
    this.sprite = new PIXI.Sprite(
      terrainSheet.textures[`${this.biome}Wall.png`]
    );
  }
  draw() {
    //c.strokeStyle = "white";
    //c.beginPath();
    //c.rect(this.x - offset.x, this.y - offset.y, BLOCK_SIZE, BLOCK_SIZE);
    //c.stroke();
    /*
    c.drawImage(
      normalBiome.wall,
      this.x - offset.x,
      this.y - offset.y,
      BLOCK_SIZE,
      BLOCK_SIZE
    );*/
    //this.sprite.x = this.screenX;
    //this.sprite.y = this.screenY;
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
  }
  get screenX() {
    return this.myContainer.x + this.x;
  }
  get screenY() {
    return this.myContainer.y + this.y;
  }
  highlight() {
    //c.globalAlpha = 0.3;
    //c.fillStyle = "yellow";
    //
    //c.fillRect(this.x - offset.x, this.y - offset.y, BLOCK_SIZE, BLOCK_SIZE);
  }
}
class Ground {
  constructor(x, y, container, biome = "normal") {
    this.x = x;
    this.y = y;

    this.biome = biome;
    this.identity = 1;

    this.myContainer = container;

    this.loadSprite();

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
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    //this.myContainer.setChildIndex(this.sprite, 0);

    this.sprite.zIndex = 0;
    //this.sprite.alpha = 0.6;
    this.sprite.width = BLOCK_SIZE;
    this.sprite.height = BLOCK_SIZE;

    this.myContainer.addChild(this.sprite);
  }
  loadSprite() {
    this.sprite = new PIXI.Sprite(
      terrainSheet.textures[`${this.biome}Ground.png`]
    );
  }
  draw() {
    //c.strokeStyle = "white";
    //c.beginPath();
    //c.rect(this.x - offset.x, this.y - offset.y, BLOCK_SIZE, BLOCK_SIZE);
    //c.stroke();
    /*
    c.drawImage(
      normalBiome.wall,
      this.x - offset.x,
      this.y - offset.y,
      BLOCK_SIZE,
      BLOCK_SIZE
    );*/
    //this.sprite.x = this.screenX;
    //this.sprite.y = this.screenY;
    this.sprite.visibility =
      this.screenX > -BLOCK_SIZE &&
      this.screenX <= canvas.width &&
      this.screenY > -BLOCK_SIZE &&
      this.screenY <= canvas.height;
  }
  get screenX() {
    return this.myContainer.x + this.x;
  }
  get screenY() {
    return this.myContainer.y + this.y;
  }
  highlight() {
    c.globalAlpha = 0.3;
    c.fillStyle = "yellow";

    c.fillRect(this.screenX, this.screenY, BLOCK_SIZE, BLOCK_SIZE);
  }
}

class DebuggBlock {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.myContainer = container;

    this.identity = 1;
  }
  get screenX() {
    return this.x + this.myContainer.x;
  }
  get screenY() {
    return this.y + this.myContainer.y;
  }
  draw() {
    c.fillStyle = "green";
    c.fillRect(this.screenX, this.screenY, BLOCK_SIZE, BLOCK_SIZE);
  }
}
