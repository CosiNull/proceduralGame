function digOutHoleNormal(x, y, seed, type = 0) {
  let savedCoordinates = [];
  switch (type) {
    case 0: //Square
      let diagonal = fastRandom2.rangeInt(1, 3, fastRandom2.rand(seed));
      for (let i = x - diagonal; i <= x + diagonal; i++) {
        for (let j = y - diagonal; j <= y + diagonal; j++) {
          savedCoordinates.push({ x: i, y: j });
        }
      }
      break;
    case 1: //Rectangle
      let halfWidth = fastRandom2.rangeInt(2, 4, fastRandom2.rand(seed));
      let fullHeight = fastRandom2.rangeInt(2, 4, fastRandom2.rand(seed + x));
      let dH = fastRandom2.rangeInt(
        0,
        fullHeight + 1,
        fastRandom2.rand(seed + y)
      );
      for (let i = x - halfWidth; i <= x + halfWidth; i++) {
        for (let j = y - dH; j <= y - dH + fullHeight; j++) {
          savedCoordinates.push({ x: i, y: j });
        }
      }

      break;
    case 2: //Double Diagonal Rect Pieces
      let fullWidth = randomRangeInt(2, 4, seed);

      let fullHeight1 = fastRandom2.rangeInt(1, 3, fastRandom2.rand(seed + x));
      let fullHeight2 = fastRandom2.rangeInt(1, 3, fastRandom2.rand(seed + y));

      let leftUpper = fastRandom.rand(seed) > 0.5;

      if (leftUpper) {
        for (let i = x - fullWidth; i <= x; i++) {
          for (let j = y - fullHeight1; j <= y; j++) {
            savedCoordinates.push({ x: i, y: j });
          }
        }
        for (let i = x; i <= x + fullWidth; i++) {
          for (let j = y; j <= y + fullHeight2; j++) {
            savedCoordinates.push({ x: i, y: j });
          }
        }
      } else {
        for (let i = x - fullWidth; i <= x; i++) {
          for (let j = y; j <= y + fullHeight1; j++) {
            savedCoordinates.push({ x: i, y: j });
          }
        }
        for (let i = x; i <= x + fullWidth; i++) {
          for (let j = y - fullHeight2; j <= y; j++) {
            savedCoordinates.push({ x: i, y: j });
          }
        }
      }
      break;
  }
  return savedCoordinates;
}

let holeProbIndexes = {
  0: 0,
  1: 1,
  2: 1,
  3: 2,
  4: 2,
};

//Useful functions
function tileInMap(x, y) {
  if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_SIZE) {
    return false;
  } else {
    return true;
  }
}

//Room management
class Room {
  constructor(tiles, map) {
    //
    this.tiles = tiles;
    this.roomSize = tiles.length;
    this.edges = [];

    //this.ceilings = new Map();
    //this.leftWall = new Map();
    //this.rightWall = new Map();
    //this.floors = new Map();

    this.connections = new Map();
    this.tileConnections = [];

    this.isAccessibleMainRoom = false;
    this.isMainRoom = false;
    this.isPassage = false;

    this.findEdges(map);
  }
  isConnected(room) {
    if (this.connections.get(room)) {
      return true;
    } else {
      return false;
    }
  }
  setAccessibleMainRoom() {
    //console.log(1);
    if (!this.isAccessibleMainRoom) {
      this.isAccessibleMainRoom = true;
      for (let key of this.connections) {
        //console.log(key);
        key[0].setAccessibleMainRoom();
      }
    }
  }
  findEdges(map) {
    //it can also find edges outside the map
    for (let tile of this.tiles) {
      if (
        tile.y == CHUNK_SIZE - 1 ||
        map[tile.y + 1][tile.x] == 0 ||
        tile.y == 0 ||
        map[tile.y - 1][tile.x] == 0 ||
        tile.x == 0 ||
        map[tile.y][tile.x - 1] == 0 ||
        tile.x == CHUNK_SIZE - 1 ||
        map[tile.y][tile.x + 1] == 0
      ) {
        this.edges.push(tile);
      }
    }
  }
  findWalls() {
    for (let tile of tiles) {
      if (tile.y == CHUNK_SIZE - 1 || map[tile.y + 1][tile.x] == 0) {
        this.floors.set([tile.x, tile.y + 1], true);
      }
      if (tile.y == 0 || map[tile.y - 1][tile.x] == 0) {
        this.ceilings.set([tile.x, tile.y - 1], true);
      }
      if (tile.x == 0 || map[tile.y][tile.x - 1] == 0) {
        this.leftWall.set([tile.x - 1, tile.y], true);
      }
      if (tile.x == CHUNK_SIZE - 1 || map[tile.y][tile.x + 1] == 0) {
        this.rightWall.set([tile.x + 1, tile.y], true);
      }
    }
  }
}
