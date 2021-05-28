const BIOMES = ["normal", "barrel", "slime", "hive", "lava"];

let generateBiomeEnemies = {
  normal: (chunkX, chunkY, groundTiles, seed, spawn) => {
    let tempSeed = seed;

    //console.log(chunkX, chunkY);
    //Dont forget to set difficulty

    let minEnemies = 17;
    let maxEnemies = 24;

    let numOfEnemies = randomRange(minEnemies, maxEnemies, tempSeed);

    if (spawn) {
      for (let i = 0; i < groundTiles.length; i++) {
        if (
          Math.max(
            Math.abs(groundTiles[i].x - spawn.x),
            Math.abs(groundTiles[i].y - spawn.y)
          ) < 9
        ) {
          //console.log(3);
          groundTiles.splice(i, 1);
          i--;
        }
      }
      //console.log(groundTiles);
    }

    for (let i = 0; i < numOfEnemies; i++) {
      tempSeed = Math.abs(fastRandom2.rand(tempSeed));
      let coordInd = tempSeed % groundTiles.length;

      let x = groundTiles[coordInd].x * BLOCK_SIZE + chunkX;
      let y = groundTiles[coordInd].y * BLOCK_SIZE + chunkY;

      groundTiles.splice(coordInd, 1);

      let decimalSeed = fastRandom2.toDecimal(tempSeed);

      if (decimalSeed > 0.55) {
        enemies.push(new RockBeetle(x, y, chunkX, chunkY));
      } else {
        enemies.push(new Bat(x, y, chunkX, chunkY));
      }
    }
  },
  barrel: (chunkX, chunkY, groundTiles, seed) => {
    let tempSeed = seed;
    //Dont forget to set difficulty

    let minEnemies = 19;
    let maxEnemies = 27;

    let numOfEnemies = randomRange(minEnemies, maxEnemies, tempSeed);

    for (let i = 0; i < numOfEnemies; i++) {
      tempSeed = Math.abs(fastRandom2.rand(tempSeed));
      let coordInd = tempSeed % groundTiles.length;

      let x = groundTiles[coordInd].x * BLOCK_SIZE + chunkX;
      let y = groundTiles[coordInd].y * BLOCK_SIZE + chunkY;

      groundTiles.splice(coordInd, 1);

      let decimalSeed = fastRandom2.toDecimal(tempSeed);

      if (decimalSeed > 0.36) {
        enemies.push(new BarrelMonster(x, y, chunkX, chunkY));
      } else {
        enemies.push(new Pyramid(x, y, chunkX, chunkY));
      }
    }
  },
  slime: (chunkX, chunkY, groundTiles, seed) => {
    let tempSeed = seed;
    //Dont forget to set difficulty

    let minEnemies = 24;
    let maxEnemies = 32;

    let numOfEnemies = randomRange(minEnemies, maxEnemies, tempSeed);

    for (let i = 0; i < numOfEnemies; i++) {
      tempSeed = Math.abs(fastRandom2.rand(tempSeed));
      let coordInd = tempSeed % groundTiles.length;

      let x = groundTiles[coordInd].x * BLOCK_SIZE + chunkX;
      let y = groundTiles[coordInd].y * BLOCK_SIZE + chunkY;

      groundTiles.splice(coordInd, 1);

      let decimalSeed = fastRandom2.toDecimal(tempSeed);

      if (decimalSeed < 0.3) {
        enemies.push(new BigSlime(x, y, chunkX, chunkY));
      } else {
        enemies.push(new MiniSlime(x, y, chunkX, chunkY));
      }
    }
  },
  hive: (chunkX, chunkY, groundTiles, seed) => {
    let tempSeed = seed;
    //Dont forget to set difficulty

    let minEnemies = 25;
    let maxEnemies = 33;

    let numOfEnemies = randomRange(minEnemies, maxEnemies, tempSeed);

    for (let i = 0; i < numOfEnemies; i++) {
      tempSeed = Math.abs(fastRandom2.rand(tempSeed));
      let coordInd = tempSeed % groundTiles.length;

      let x = groundTiles[coordInd].x * BLOCK_SIZE + chunkX;
      let y = groundTiles[coordInd].y * BLOCK_SIZE + chunkY;

      groundTiles.splice(coordInd, 1);

      let decimalSeed = fastRandom2.toDecimal(tempSeed);

      if (decimalSeed < 0.44) {
        enemies.push(new Worm(x, y, chunkX, chunkY));
      } else {
        enemies.push(new Bee(x, y, chunkX, chunkY));
      }
    }
  },
  lava: (chunkX, chunkY, groundTiles, seed) => {
    let tempSeed = seed;
    //Dont forget to set difficulty

    let minEnemies = 26;
    let maxEnemies = 34;

    let numOfEnemies = randomRange(minEnemies, maxEnemies, tempSeed);

    for (let i = 0; i < numOfEnemies; i++) {
      tempSeed = Math.abs(fastRandom2.rand(tempSeed));
      let coordInd = tempSeed % groundTiles.length;

      let x = groundTiles[coordInd].x * BLOCK_SIZE + chunkX;
      let y = groundTiles[coordInd].y * BLOCK_SIZE + chunkY;

      groundTiles.splice(coordInd, 1);

      let decimalSeed = fastRandom2.toDecimal(tempSeed);

      if (decimalSeed < 0.2) {
        enemies.push(new Flame(x, y, chunkX, chunkY));
      } else if (decimalSeed < 0.35) {
        enemies.push(new MiniFlame(x, y, chunkX, chunkY));
        enemies.push(new MiniFlame(x, y, chunkX, chunkY));
      } else {
        enemies.push(new Skull(x, y, chunkX, chunkY));
      }
    }
  },
  random: (chunkX, chunkY, groundTiles, seed) => {
    let tempSeed = seed;
    //Dont forget to set difficulty VERY IMPORTANT FOR RANDOM

    let minEnemies = 26;
    let maxEnemies = 48;

    let numOfEnemies = randomRange(minEnemies, maxEnemies, tempSeed);

    let examinedChunk = Math.max(
      Math.abs(chunkX / CHUNK_WIDTH - 1),
      Math.abs(chunkY / CHUNK_WIDTH - 1),
      0
    );
    let biomeNum = Math.floor(examinedChunk / 3);

    for (let i = 0; i < numOfEnemies; i++) {
      tempSeed = Math.abs(fastRandom2.rand(tempSeed));
      let coordInd = tempSeed % groundTiles.length;

      let x = groundTiles[coordInd].x * BLOCK_SIZE + chunkX;
      let y = groundTiles[coordInd].y * BLOCK_SIZE + chunkY;

      groundTiles.splice(coordInd, 1);

      let enemy;

      let enemyNum = fastRandom2.rangeInt(0, 10, tempSeed);

      switch (enemyNum) {
        case 0:
          enemy = new RockBeetle(x, y, chunkX, chunkY);
          break;
        case 1:
          enemy = new Bat(x, y, chunkX, chunkY);
          break;
        case 2:
          enemy = new BarrelMonster(x, y, chunkX, chunkY);
          break;
        case 3:
          enemy = new Pyramid(x, y, chunkX, chunkY);
          break;
        case 4:
          enemy = new BigSlime(x, y, chunkX, chunkY);
          break;
        case 5:
          enemy = new MiniSlime(x, y, chunkX, chunkY);
          enemy = new MiniSlime(x, y, chunkX, chunkY);
          break;
        case 6:
          enemy = new Worm(x, y, chunkX, chunkY);
          break;
        case 7:
          enemy = new Bee(x, y, chunkX, chunkY);
          break;
        case 8:
          enemy = new Skull(x, y, chunkX, chunkY);
          break;
        case 9:
          enemy = new Flame(x, y, chunkX, chunkY);
          break;
        case 10:
          enemy = new MiniFlame(x, y, chunkX, chunkY);
          enemy = new MiniFlame(x, y, chunkX, chunkY);
          break;
      }

      enemy.life += biomeNum - (BIOMES.length - 1);
      //console.log(biomeNum - (BIOMES.length - 1));
      enemies.push(enemy);
    }
  },

  test: () => {
    console.log("OUt of bounds");
  },
};
