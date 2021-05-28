let biomeIndicator;

function loadBiomeIndicator() {
  biomeIndicator = new PIXI.Text("YOOO", {
    fontFamily: "Press Start 2P, cursive",
    fontSize: BLOCK_SIZE * 0.36,
    fill: 0xeeeeee,
    align: "center",
  });
  biomeIndicator.anchor.set(1, 1);
  biomeIndicator.x = canvas.width * 0.98;
  biomeIndicator.y = canvas.height * 0.99;
  biomeIndicator.alpha = 0.9;
  biomeIndicator.zIndex = 25;

  mainContainer.addChild(biomeIndicator);
}

let currentBiome;
let backgroundMusic = new Audio();

function updateBiomeIndicator() {
  //Knowing which chunk it exists in
  let chunkIndexX = Math.floor((offset.x + player.x) / CHUNK_WIDTH);
  let chunkIndexY = Math.floor((offset.y + player.y) / CHUNK_WIDTH);

  //Their position in the map
  let chunkMapIndexX = chunkIndexX - loadedMap[1][1].x / CHUNK_WIDTH + 1;
  let chunkMapIndexY = chunkIndexY - loadedMap[1][1].y / CHUNK_WIDTH + 1;

  //Now need to know in which block it lives in
  let chunkX = loadedMap[chunkMapIndexY][chunkMapIndexX].x;
  let chunkY = loadedMap[chunkMapIndexY][chunkMapIndexX].y;

  let biome = setBiome(chunkX / CHUNK_WIDTH, chunkY / CHUNK_WIDTH);

  biomeIndicator.text = biomeFullNames[biome];

  if (currentBiome != biome) {
    currentBiome = biome;
    backgroundMusic.src = biomeMusicSrc[biome];
    backgroundMusic.loop = true;
    backgroundMusic.play();
  }
}

let biomeFullNames = {
  normal: "DEEP CAVES",
  barrel: "LOST TEMPLE",
  slime: "SLIME DUNGEON",
  hive: "BLUE HIVE",
  lava: "PARASITIC FLAMES",
  random: "RANDOM WASTLANDS",
};
let biomeMusicSrc = {
  normal: sounds.adventureMusic.src,
  barrel: sounds.templeMusic.src,
  slime: sounds.slimeMusic.src,
  hive: sounds.hiveMusic.src,
  lava: sounds.lavaMusic.src,
  random: sounds.randomMusic.src,
};
