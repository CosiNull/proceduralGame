const CHUNK_SIZE = 29;
const BLOCK_SIZE =
  window.innerWidth <= 1366 ? 48 : (window.innerWidth * 48) / 1366;
console.log(window.innerWidth);
const CHUNK_WIDTH = CHUNK_SIZE * BLOCK_SIZE;

//Lexique
//0: Ground
//1: Empty space
//2: Core of a hole

class Chunk {
  constructor(x, y, generatePassages = true, biome = "normal", spawn = false) {
    //Coordinates
    this.x = x;
    this.y = y;
    this.biome = biome;

    //Randomness //DONT FORGET TO DEAL WITH NEGATIVES
    let tempX = x > 0 ? (x / BLOCK_SIZE) * 2 : (x / BLOCK_SIZE) * -2 + 1;
    let tempY = y > 0 ? (y / BLOCK_SIZE) * 2 : (y / BLOCK_SIZE) * -2 + 1;

    this.seed = hash3d(tempX, tempY);

    this.biome2 =
      this.biome == "random"
        ? BIOMES[randomRangeInt(0, 4, this.seed)]
        : this.biome;
    //if (this.biome == "random") console.log(this.biome2);

    this.tempSeed = this.seed;

    //Generation
    this.holes = [];
    this.draft = Array(CHUNK_SIZE)
      .fill(null)
      .map(() => Array(CHUNK_SIZE).fill(0));
    this.map = Array(CHUNK_SIZE)
      .fill(null)
      .map(() => Array(CHUNK_SIZE).fill(0));

    this.regions = [];
    this.edgeRegions = [];
    this.connections = [];

    if (generatePassages) {
      this.generatePassageways();
    }

    this.generateSpawn = spawn;

    //this.generate();
  }
  setSpawn() {
    for (let i = 9; i < CHUNK_SIZE - 9; i++) {
      for (let j = 9; j < CHUNK_SIZE - 9; j++) {
        if (this.draft[j][i] == 1) {
          this.spawn = { x: i, y: j };
          return;
        }
      }
    }
  }
  visualize() {
    c.strokeWidth = 2;
    c.strokeStyle = "red";
    c.beginPath();
    c.rect(this.x - offset.x, this.y - offset.y, CHUNK_WIDTH, CHUNK_WIDTH);
    c.stroke();
    c.strokeWidth = 1;

    c.fillStyle = "blue";
    c.strokeStyle = "white";
    for (let i = 0; i < CHUNK_SIZE; i++) {
      for (let j = 0; j < CHUNK_SIZE; j++) {
        if (
          this.x + BLOCK_SIZE * i - offset.x > canvas.width &&
          this.y + BLOCK_SIZE * j - offset.y > canvas.height &&
          this.x + BLOCK_SIZE * i - offset.x < -BLOCK_SIZE &&
          this.y + BLOCK_SIZE * i - offset.y < -BLOCK_SIZE
        )
          continue;
        c.beginPath();
        c.rect(
          this.x + BLOCK_SIZE * i - offset.x,
          this.y + BLOCK_SIZE * j - offset.y,
          BLOCK_SIZE,
          BLOCK_SIZE
        );

        if (this.draft[j][i] == 1) {
          c.globalAlpha = 0.3;
          c.fillStyle = "white";
          c.fill();
          c.fillStyle = "blue";
          c.globalAlpha = 1;
        } else if (this.draft[j][i] == 2) {
          c.globalAlpha = 0.3;
          c.fillStyle = "yellow";
          c.fill();
          c.fillStyle = "blue";
          c.globalAlpha = 1;
        }

        c.stroke();

        //holes
      }
    }
    /*
    c.strokeStyle = "red";
    for (let connection of this.connections) {
      c.beginPath();
      c.moveTo(
        connection[0].x * BLOCK_SIZE + this.x - offset.x,
        connection[0].y * BLOCK_SIZE + this.y - offset.y
      );
      c.lineTo(
        connection[1].x * BLOCK_SIZE + this.x - offset.x,
        connection[1].y * BLOCK_SIZE + this.y - offset.y
      );
      c.stroke();
    }
    */
  }
  draw() {
    if (this.destroyed) return;

    this.container.x = this.x - offset.x;
    this.container.y = this.y - offset.y;
    for (let i = 0; i < CHUNK_SIZE; i++) {
      for (let j = 0; j < CHUNK_SIZE; j++) {
        this.map[j][i].draw();
      }
    }
  }
  generate() {
    //Terrain
    this.digPassageWays();
    if (random(this.seed) > 0.5) {
      this.generateMiniHoles();
    } else {
      this.generateHoles();
    }

    this.saveRegions();
    this.connectRegions();

    if (this.generateSpawn) this.setSpawn();

    //Overworld Objects
    this.generateOverworld();

    this.convertDraft();

    this.generateEnemies();
  }
  convertDraft() {
    this.container = new PIXI.Container();
    this.container.x = this.x;
    this.container.y = this.y;
    //this.container.sortableChildren = true;
    mainContainer.addChild(this.container);

    for (let i = 0; i < CHUNK_SIZE; i++) {
      for (let j = 0; j < CHUNK_SIZE; j++) {
        let blockIdentity = this.draft[j][i];
        if (blockIdentity == -1) {
          this.map[j][i] = new DebuggBlock(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container
          );
        } else if (blockIdentity == 1) {
          this.map[j][i] = new Ground(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container,
            this.biome2
          );
        } else if (blockIdentity == 0) {
          this.map[j][i] = new Wall(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container,
            this.biome2
          );
        } else if (blockIdentity == 2) {
          new Ground(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container,
            this.biome2
          );
          this.map[j][i] = new Chest(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container
          );
        } else if (blockIdentity == 3) {
          new Ground(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container,
            this.biome2
          );
          this.map[j][i] = new Barril(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container
          );
        } else if (blockIdentity == 4) {
          new Ground(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container,
            this.biome2
          );
          this.map[j][i] = new Barril(
            i * BLOCK_SIZE,
            j * BLOCK_SIZE,
            this.container
          );
          this.map[j][i].destroy();
        }
      }
    }
  }
  deleteContainer() {
    this.container.destroy();
    this.destroyed = true;
  }
  //________________________________________________Hole generation
  generatePassageways() {
    //Filling in
    this.tempSeed = fastRandom2.rand(this.tempSeed);
    this.westPassage = Math.abs(this.tempSeed % (CHUNK_SIZE - 6)) + 3;
    //this.draft[this.westPassage][0] = 2;

    this.tempSeed = fastRandom2.rand(this.tempSeed);
    this.eastPassage = Math.abs(this.tempSeed % (CHUNK_SIZE - 6)) + 3;
    //this.draft[this.eastPassage][CHUNK_SIZE - 1] = 2;

    this.tempSeed = fastRandom2.rand(this.tempSeed);
    this.northPassage = Math.abs(this.tempSeed % (CHUNK_SIZE - 6)) + 3;
    //this.draft[0][this.northPassage] = 2;

    this.tempSeed = fastRandom2.rand(this.tempSeed);
    this.southPassage = Math.abs(this.tempSeed % (CHUNK_SIZE - 6)) + 3;
    //this.draft[CHUNK_SIZE - 1][this.southPassage] = 2;
  }
  digPassageWays() {
    for (let i = -1; i <= 1; i++) {
      this.draft[this.westPassage + i][0] = 1;
      this.draft[this.eastPassage + i][CHUNK_SIZE - 1] = 1;
      this.draft[0][this.northPassage + i] = 1;
      this.draft[CHUNK_SIZE - 1][this.southPassage + i] = 1;
    }
  }

  generateHoles() {
    //Generate holes//
    //1. The number
    let numOfHolesMin = 18;
    let numOfHolesMax = 30;
    let numOfHoles = randomRangeInt(numOfHolesMin, numOfHolesMax, this.seed);
    //console.log(numOfHoles);
    //2. Determining them and determing them
    for (let i = 0; i < numOfHoles; i++) {
      this.tempSeed = fastRandom.rand(this.tempSeed);
      let x =
        Math.floor(fastRandom.toDecimal(this.tempSeed) * (CHUNK_SIZE - 8)) + 4;
      this.tempSeed = fastRandom.rand(this.tempSeed);
      let y =
        Math.floor(fastRandom.toDecimal(this.tempSeed) * (CHUNK_SIZE - 8)) + 4;

      let holeState = randomRangeInt(0, 5, this.tempSeed + numOfHoles);
      holeState = holeProbIndexes[holeState];
      let coordsToDig = digOutHoleNormal(x, y, this.tempSeed + i, holeState);

      for (let hole of coordsToDig) {
        if (
          this.draft[hole.y][hole.x] === 0 &&
          hole.x >= 0 &&
          hole.x < CHUNK_SIZE
        ) {
          this.draft[hole.y][hole.x] = 1;
        }
      }
    }
  }
  generateMiniHoles() {
    let numOfHolesMin = 24;
    let numOfHolesMax = 42;
    let numOfHoles = randomRangeInt(numOfHolesMin, numOfHolesMax, this.seed);
    for (let count = 0; count < numOfHoles; count++) {
      this.tempSeed = fastRandom2.rand(this.tempSeed);
      let x =
        Math.floor(fastRandom2.toDecimal(this.tempSeed) * (CHUNK_SIZE - 6)) + 3;
      this.tempSeed = fastRandom2.rand(this.tempSeed);
      let y =
        Math.floor(fastRandom2.toDecimal(this.tempSeed) * (CHUNK_SIZE - 6)) + 3;

      for (let i = x; i <= x + 2; i++) {
        for (let j = y; j <= y + 2; j++) {
          this.draft[j][i] = 1;
        }
      }
    }
  }

  //_______________________________Detecting and connecting regions
  getRegion(x, y) {
    let mapFlagged = new Array(CHUNK_SIZE)
      .fill(null)
      .map(() => Array(CHUNK_SIZE).fill(false));
    let queue = [{ x, y }];
    mapFlagged[y][x] = true;
    let selectedCells = [];

    while (queue.length > 0) {
      for (let i = queue[0].x - 1; i <= queue[0].x + 1; i++) {
        for (let j = queue[0].y - 1; j <= queue[0].y + 1; j++) {
          if (
            (i == queue[0].x || j == queue[0].y) &&
            tileInMap(i, j) &&
            !mapFlagged[j][i] &&
            this.draft[j][i] == 1
          ) {
            mapFlagged[j][i] = true;
            queue.push({ x: i, y: j });
          }
        }
      }
      selectedCells.push(queue.shift());
    }
    return selectedCells;
  }
  saveRegions() {
    this.regions = [];
    let mapFlagged = new Array(CHUNK_SIZE)
      .fill(null)
      .map(() => new Array(CHUNK_SIZE).fill(false));

    for (let i = 0; i < CHUNK_SIZE; i++) {
      for (let j = 0; j < CHUNK_SIZE; j++) {
        if (this.draft[j][i] == 1 && !mapFlagged[j][i]) {
          let retrievedRegion = this.getRegion(i, j);

          this.regions.push(new Room(retrievedRegion, this.draft));

          for (let cell of retrievedRegion) {
            mapFlagged[cell.y][cell.x] = true;

            if (
              (cell.x == 0 && cell.y == this.westPassage) ||
              (cell.x == CHUNK_SIZE - 1 && cell.y == this.eastPassage) ||
              (cell.x == this.northPassage && cell.y == 0) ||
              (cell.x == this.southPassage && cell.y == CHUNK_SIZE - 1)
            ) {
              this.regions[this.regions.length - 1].isPassage = true;
            }
          }
        }
      }
    }
  }
  connectRegions() {
    this.sortRooms();
    let bestDistance = Infinity;
    let bestTileA, bestTileB, bestRoomA, bestRoomB;

    for (let roomA of this.regions) {
      bestDistance = Infinity;
      for (let roomB of this.regions) {
        if (roomA === roomB) continue;
        if (roomA.isConnected(roomB)) {
          continue;
        }

        for (let tileA of roomA.edges) {
          for (let tileB of roomB.edges) {
            let distance = (tileA.x - tileB.x) ** 2 + (tileA.y - tileB.y) ** 2;
            if (tileA.x == tileB.x) distance += 2;
            if (distance < bestDistance) {
              bestDistance = distance;
              bestTileA = tileA;
              bestTileB = tileB;
              bestRoomA = roomA;
              bestRoomB = roomB;
            }
          }
        }
      }
      if (bestDistance != Infinity) {
        if (bestRoomA.isAccessibleMainRoom) bestRoomB.setAccessibleMainRoom();
        if (bestRoomB.isAccessibleMainRoom) bestRoomA.setAccessibleMainRoom();
        bestRoomA.connections.set(bestRoomB, true);
        bestRoomB.connections.set(bestRoomA, true);

        this.connections.push([bestTileA, bestTileB]);
      }
    }
    this.forceMainRoomConnect();
    this.digLines();
  }
  sortRooms() {
    this.regions = this.regions.sort((a, b) => {
      return b.roomSize - a.roomSize;
    });
    this.regions[0].isMainRoom = true;
    this.regions[0].isAccessibleMainRoom = true;
  }
  forceMainRoomConnect() {
    let roomsA = [];
    let roomsB = [];
    for (let region of this.regions) {
      if (region.isAccessibleMainRoom) roomsB.push(region);
      else roomsA.push(region);
    }

    let bestDistance = Infinity;
    let bestTileA, bestTileB, bestRoomA, bestRoomB;

    for (let roomA of roomsA) {
      for (let roomB of roomsB) {
        if (roomA.isConnected(roomB)) {
          continue;
        }

        for (let tileA of roomA.edges) {
          for (let tileB of roomB.edges) {
            let distance = (tileA.x - tileB.x) ** 2 + (tileA.y - tileB.y) ** 2;
            if (tileA.x == tileB.x) distance += 2;
            if (distance < bestDistance) {
              bestDistance = distance;
              bestTileA = tileA;
              bestTileB = tileB;
              bestRoomA = roomA;
              bestRoomB = roomB;
            }
          }
        }
      }
    }
    if (bestDistance != Infinity) {
      if (bestRoomA.isAccessibleMainRoom) bestRoomB.setAccessibleMainRoom();
      if (bestRoomB.isAccessibleMainRoom) bestRoomA.setAccessibleMainRoom();
      bestRoomA.connections.set(bestRoomB, true);
      bestRoomB.connections.set(bestRoomA, true);

      this.connections.push([bestTileA, bestTileB]);
    }
    for (let region of this.regions) {
      if (!region.isAccessibleMainRoom) {
        this.forceMainRoomConnect();
        break;
      }
    }
  }
  digLines() {
    for (let connection of this.connections) {
      let tilesToFill = getLineTiles(
        connection[0].x,
        connection[0].y,
        connection[1].x,
        connection[1].y
      );
      for (let tile of tilesToFill) {
        for (let i = tile.x - 1; i <= tile.x + 1; i++) {
          for (let j = tile.y - 1; j <= tile.y + 1; j++) {
            //dont forget the ladders
            if (tileInMap(i, j)) this.draft[j][i] = 1;
          }
        }
      }
    }
  }
  //_______________________________________________________________Generate Enemies and objects

  generateOverworld() {
    this.groundTiles = this.getRegion(0, this.westPassage);
    if (this.spawn) {
      for (let i = 0; i < this.groundTiles.length; i++) {
        if (
          this.groundTiles[i].x == this.spawn.x &&
          this.groundTiles[i].y == this.spawn.y
        ) {
          this.groundTiles.splice(i, 1);
          break;
        }
      }
    }
    //console.log(this.groundTiles);
    this.generateBarrils();
    this.generateChests();
    //this.generateEnemies();
  }
  generateChests() {
    for (let room of this.regions) {
      this.tempSeed = Math.abs(fastRandom2.rand(this.tempSeed));
      if (
        room.connections.size == 1 &&
        !room.isPassage &&
        this.tempSeed % 10 < 7
      ) {
        //console.log("NEW CHEST", this.x, this.y);
        //for (let tile of room.tiles) {
        //  this.draft[tile.y][tile.x] = -1;
        //}

        this.tempSeed = Math.abs(fastRandom2.rand(this.tempSeed));
        let chestLocation = this.tempSeed % room.tiles.length;

        this.draft[room.tiles[chestLocation].y][
          room.tiles[chestLocation].x
        ] = 2;
      }
    }
    //console.table(this.draft);
  }
  generateBarrils() {
    let minBarrils = 9;
    let maxBarrils = 26;

    this.tempSeed = fastRandom2.rand(this.tempSeed);
    let numOfBarrils = randomRange(minBarrils, maxBarrils, this.tempSeed);

    for (let i = 0; i < numOfBarrils; i++) {
      this.tempSeed = Math.abs(fastRandom2.rand(this.tempSeed));
      let coordInd = this.tempSeed % this.groundTiles.length;

      this.draft[this.groundTiles[coordInd].y][
        this.groundTiles[coordInd].x
      ] = 3;
      this.groundTiles.splice(coordInd, 1);
    }

    minBarrils = 1;
    maxBarrils = 9;
    this.tempSeed = fastRandom2.rand(this.tempSeed);
    numOfBarrils = randomRange(minBarrils, maxBarrils, this.tempSeed);

    for (let i = 0; i < numOfBarrils; i++) {
      this.tempSeed = Math.abs(fastRandom2.rand(this.tempSeed));
      let coordInd = this.tempSeed % this.groundTiles.length;

      this.draft[this.groundTiles[coordInd].y][
        this.groundTiles[coordInd].x
      ] = 4;
    }
  }
  generateEnemies() {
    generateBiomeEnemies[this.biome](
      this.x,
      this.y,
      this.groundTiles,
      this.seed,
      this.spawn
    );
  }
}
