let currentPos = {
  x: 0,
  y: 0,
};

let loadedMap = Array(3)
  .fill(null)
  .map(() => Array(3).fill(0));

function createPassageWays(chunkNumX, chunkNumY) {
  return Math.abs(chunkNumX % 2) == Math.abs(chunkNumY % 2);
}
function setBiome(chunkNumX, chunkNumY) {
  let examinedChunk = Math.max(
    Math.abs(chunkNumX - 1),
    Math.abs(chunkNumY - 1),
    0
  );
  biomeNum = Math.floor(examinedChunk / 3);
  //HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  switch (biomeNum) {
    case 0:
      return "normal";
    case 1:
      return "barrel";
    case 2:
      return "slime";
    case 3:
      return "hive";
    case 4:
      return "lava";
    default:
      //console.log(chunkNumX, chunkNumY, biomeNum);
      return "random";
  }
}

function generateMap() {
  console.time("Generation");
  for (let i = 0; i < loadedMap.length; i++) {
    for (let j = 0; j < loadedMap.length; j++) {
      let digOutHole = createPassageWays(i, j);
      let biome = setBiome(i, j);

      loadedMap[j][i] = new Chunk(
        i * CHUNK_WIDTH,
        j * CHUNK_WIDTH,
        digOutHole,
        biome,
        i == 1 && j == 1
      );

      if (!digOutHole) {
        let tempChunk = new Chunk(
          i * CHUNK_WIDTH,
          (j - 1) * CHUNK_WIDTH,
          true,
          biome
        );
        loadedMap[j][i].northPassage = tempChunk.southPassage;
        tempChunk = new Chunk(
          (i - 1) * CHUNK_WIDTH,
          j * CHUNK_WIDTH,
          true,
          biome
        );
        loadedMap[j][i].westPassage = tempChunk.eastPassage;
        tempChunk = new Chunk(
          (i + 1) * CHUNK_WIDTH,
          j * CHUNK_WIDTH,
          true,
          biome
        );
        loadedMap[j][i].eastPassage = tempChunk.westPassage;
        tempChunk = new Chunk(
          i * CHUNK_WIDTH,
          (j + 1) * CHUNK_WIDTH,
          true,
          biome
        );
        loadedMap[j][i].southPassage = tempChunk.northPassage;
      }

      loadedMap[j][i].generate();
    }
  }

  console.timeEnd("Generation");
}

function updateLoadedMap() {
  if (currentPos.y < -canvas.height) {
    currentPos.y = CHUNK_WIDTH + currentPos.y;
    replaceChunks("north");
  } else if (currentPos.y > CHUNK_WIDTH) {
    currentPos.y = currentPos.y - CHUNK_WIDTH;
    replaceChunks("south");
  }
  if (currentPos.x <= -canvas.width) {
    currentPos.x = CHUNK_WIDTH + currentPos.x;
    replaceChunks("east");
  } else if (currentPos.x >= CHUNK_WIDTH) {
    currentPos.x = currentPos.x - CHUNK_WIDTH;
    replaceChunks("west");
  }
}

function replaceChunks(addDirection) {
  let examinedMap = loadedMap;

  if (addDirection == "north") {
    let newRow = [];

    //Positions
    let currentColumn = examinedMap[1][1].x / CHUNK_WIDTH;
    let addedRow = (examinedMap[0][1].y - CHUNK_WIDTH) / CHUNK_WIDTH;

    //console.log(addedRow, currentColumn);

    //Generating Chunks
    for (let i = currentColumn - 1; i <= currentColumn + 1; i++) {
      let digOutHole = createPassageWays(i, addedRow);
      let biome = setBiome(i, addedRow);

      let newChunk = new Chunk(
        i * CHUNK_WIDTH,
        addedRow * CHUNK_WIDTH,
        digOutHole,
        biome
      );
      if (!digOutHole) {
        let tempChunk = new Chunk(
          i * CHUNK_WIDTH,
          (addedRow - 1) * CHUNK_WIDTH
        );
        newChunk.northPassage = tempChunk.southPassage;
        tempChunk = new Chunk((i - 1) * CHUNK_WIDTH, addedRow * CHUNK_WIDTH);
        newChunk.westPassage = tempChunk.eastPassage;
        tempChunk = new Chunk((i + 1) * CHUNK_WIDTH, addedRow * CHUNK_WIDTH);
        newChunk.eastPassage = tempChunk.westPassage;
        tempChunk = new Chunk(i * CHUNK_WIDTH, (addedRow + 1) * CHUNK_WIDTH);
        newChunk.southPassage = tempChunk.northPassage;
      }
      newRow.push(newChunk);
      newChunk.generate();
    }

    let deletedChunks = examinedMap.pop();
    for (let chunk of deletedChunks) {
      chunk.deleteContainer();
    }

    examinedMap.unshift(newRow);
    //
  } else if (addDirection == "south") {
    let newRow = [];

    //Positions
    let currentColumn = examinedMap[1][1].x / CHUNK_WIDTH;
    let addedRow = (examinedMap[2][1].y + CHUNK_WIDTH) / CHUNK_WIDTH;
    //Generating Chunks
    for (let i = currentColumn - 1; i <= currentColumn + 1; i++) {
      let digOutHole = createPassageWays(i, addedRow);
      let biome = setBiome(i, addedRow);

      let newChunk = new Chunk(
        i * CHUNK_WIDTH,
        addedRow * CHUNK_WIDTH,
        digOutHole,
        biome
      );
      if (!digOutHole) {
        let tempChunk = new Chunk(
          i * CHUNK_WIDTH,
          (addedRow - 1) * CHUNK_WIDTH
        );
        newChunk.northPassage = tempChunk.southPassage;
        tempChunk = new Chunk((i - 1) * CHUNK_WIDTH, addedRow * CHUNK_WIDTH);
        newChunk.westPassage = tempChunk.eastPassage;
        tempChunk = new Chunk((i + 1) * CHUNK_WIDTH, addedRow * CHUNK_WIDTH);
        newChunk.eastPassage = tempChunk.westPassage;
        tempChunk = new Chunk(i * CHUNK_WIDTH, (addedRow + 1) * CHUNK_WIDTH);
        newChunk.southPassage = tempChunk.northPassage;
      }
      newRow.push(newChunk);
      newChunk.generate();
    }
    let deletedChunks = examinedMap.shift();
    for (let chunk of deletedChunks) {
      chunk.deleteContainer();
    }
    examinedMap.push(newRow);
  } else if (addDirection == "east") {
    let newColumn = [];

    //Positions
    let currentRow = examinedMap[1][1].y / CHUNK_WIDTH;
    let addedColumn = (examinedMap[1][0].x - CHUNK_WIDTH) / CHUNK_WIDTH;

    //Generating Chunks
    for (let j = currentRow - 1; j <= currentRow + 1; j++) {
      let digOutHole = createPassageWays(addedColumn, j);
      let biome = setBiome(j, addedColumn);

      let newChunk = new Chunk(
        addedColumn * CHUNK_WIDTH,
        j * CHUNK_WIDTH,
        digOutHole,
        biome
      );
      if (!digOutHole) {
        let tempChunk = new Chunk(
          addedColumn * CHUNK_WIDTH,
          (j - 1) * CHUNK_WIDTH
        );
        newChunk.northPassage = tempChunk.southPassage;
        tempChunk = new Chunk((addedColumn - 1) * CHUNK_WIDTH, j * CHUNK_WIDTH);
        newChunk.westPassage = tempChunk.eastPassage;
        tempChunk = new Chunk((addedColumn + 1) * CHUNK_WIDTH, j * CHUNK_WIDTH);
        newChunk.eastPassage = tempChunk.westPassage;
        tempChunk = new Chunk(addedColumn * CHUNK_WIDTH, (j + 1) * CHUNK_WIDTH);
        newChunk.southPassage = tempChunk.northPassage;
      }
      newColumn.push(newChunk);
      newChunk.generate();
    }

    for (let i = 0; i < 3; i++) {
      examinedMap[i][2].deleteContainer();
      examinedMap[i].pop();
      examinedMap[i].unshift(newColumn[i]);
    }
  } else if (addDirection == "west") {
    let newColumn = [];

    //Positions
    let currentRow = examinedMap[1][1].y / CHUNK_WIDTH;
    let addedColumn = (examinedMap[1][2].x + CHUNK_WIDTH) / CHUNK_WIDTH;

    //Generating Chunks
    for (let j = currentRow - 1; j <= currentRow + 1; j++) {
      let digOutHole = createPassageWays(addedColumn, j);
      let biome = setBiome(j, addedColumn);

      let newChunk = new Chunk(
        addedColumn * CHUNK_WIDTH,
        j * CHUNK_WIDTH,
        digOutHole,
        biome
      );
      if (!digOutHole) {
        let tempChunk = new Chunk(
          addedColumn * CHUNK_WIDTH,
          (j - 1) * CHUNK_WIDTH
        );
        newChunk.northPassage = tempChunk.southPassage;
        tempChunk = new Chunk((addedColumn - 1) * CHUNK_WIDTH, j * CHUNK_WIDTH);
        newChunk.westPassage = tempChunk.eastPassage;
        tempChunk = new Chunk((addedColumn + 1) * CHUNK_WIDTH, j * CHUNK_WIDTH);
        newChunk.eastPassage = tempChunk.westPassage;
        tempChunk = new Chunk(addedColumn * CHUNK_WIDTH, (j + 1) * CHUNK_WIDTH);
        newChunk.southPassage = tempChunk.northPassage;
      }
      newColumn.push(newChunk);
      newChunk.generate();
    }

    for (let i = 0; i < 3; i++) {
      examinedMap[i][0].deleteContainer();
      examinedMap[i].shift();
      examinedMap[i].push(newColumn[i]);
    }
  }
}
