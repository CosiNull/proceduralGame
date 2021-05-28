function setGameOver() {
  reset();
  for (let elem of document.getElementsByClassName("gamOv")) {
    elem.style.display = "flex";
  }

  //Distance Score
  removeAllChildren(distanceGO);
  let distance = Math.floor(
    Math.hypot(
      (offset.x - CHUNK_WIDTH) / BLOCK_SIZE,
      (offset.y - CHUNK_WIDTH) / BLOCK_SIZE
    )
  );
  let distanceScore = Math.floor(distance / 8.3);
  addText(distanceGO, `DISTANCE TRAVELED:  ${distance} BLOCKS.....`, "white");
  addText(distanceGO, `+${distanceScore}$`, "yellow");

  //Enemies killed
  removeAllChildren(enemiesGO);
  let kills = score.enemies;
  let killsScore = Math.round(score.enemies / 4.2);
  addText(enemiesGO, `ENEMIES DEFEATED:  ${kills} ENEMIES.....`, "white");
  addText(enemiesGO, `+${killsScore}$`, "yellow");

  //Time
  removeAllChildren(timeGO);
  let time = score.time.toFixed(1);
  let timeScore = Math.round(score.enemies / 8.8);
  addText(timeGO, `TIME SURVIVED:  ${time} SECONDS.....`, "white");
  addText(timeGO, `+${timeScore}$`, "yellow");

  //Loot
  removeAllChildren(lootGO);
  let loot = score.loot;
  addText(lootGO, `CHEST LOOT:....................`, "white");
  addText(lootGO, `+${loot}$`, "yellow");

  //Total
  removeAllChildren(totalGO);
  let total = loot + timeScore + killsScore + distanceScore;
  addText(totalGO, `TOTAL: ..........`, "rgb(23, 135, 143)", 42);
  addText(totalGO, ` +${total}$`, "gold", 42);

  //
  totalGold += total;
  sessionStorage.setItem("gold", totalGold);

  //Quests handling
  if (questStatus.temple == 0 && player.enteredBiome.has("barrel")) {
    questStatus.temple = 1;
  }
  if (questStatus.slime == 0 && player.enteredBiome.has("slime")) {
    questStatus.slime = 1;
  }
  if (questStatus.bee == 0 && player.enteredBiome.has("hive")) {
    questStatus.bee = 1;
  }
  if (questStatus.lava == 0 && player.enteredBiome.has("lava")) {
    questStatus.lava = 1;
  }
  if (questStatus.travel == 0 && distance >= 450) {
    questStatus.travel = 1;
  }
  if (questStatus.kill == 0 && kills >= 308) {
    questStatus.kill = 1;
  }
  if (questStatus.time == 0 && Number(time) >= 109) {
    questStatus.time = 1;
  }
  updateQuestStatusSave();
}

let score = {
  enemies: 0,
  time: 0,
  loot: 0,
};

function gameOverToMenu() {
  playSound("UIClick");
  for (let elem of document.getElementsByClassName("gamOv")) {
    elem.style.display = "none";
    backToMainMenu();
  }
}

//seed to test chests 1621044443668
