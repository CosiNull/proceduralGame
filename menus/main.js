let menuSlime;

function startGame() {
  menuSlime.visible = false;
  player = null;
  if (randomSeedSetting) {
    seed = Date.now(); //1621054328066;
  } else {
    seed = savedSeed;
  }

  currentBiome = null;
  currentPos = {
    x: 0,
    y: 0,
  };
  offset.x = CHUNK_WIDTH;
  offset.y = CHUNK_WIDTH;
  generateMap();

  //
  player = new Player(
    BLOCK_SIZE * loadedMap[1][1].spawn.x,
    BLOCK_SIZE * loadedMap[1][1].spawn.y
  );

  mode = "player";

  player.speed = BLOCK_SIZE;
  for (let i = 0; i < 33; i++) {
    cameraMovement();
  }
  player.speed = player.maxSpeed;

  //Upgrades
  player.setSpeed((BLOCK_SIZE * (7 + upgrades.speed * 0.61)) / BLOCK_SIZE);
  player.attackTime = 390 - upgrades.attack * 48;
  player.dashSpeed = BLOCK_SIZE * (0.45 + upgrades.dash / 8);
  health.maxTimer = 31 + 3.33 * upgrades.timer;

  loadHealthBar();
  loadDashIndicator();
  loadBiomeIndicator();

  score = {
    enemies: 0,
    time: 0,
    loot: 0,
  };

  mainContainer.sortChildren();
}

let gameMode = "menu";

function play() {
  startGame();
  gameMode = "play";
  //sounds.adventureMusic.play();

  let menuElements = document.getElementsByClassName("menu");

  for (let elem of menuElements) {
    elem.style.display = "none";
  }
}
function backToMainMenu() {
  gameMode = "menu";

  let menuElements = document.getElementsByClassName("menu");

  for (let elem of menuElements) {
    elem.style.display = "flex";
  }
  menuSlime.visible = true;
  drawQuestNotif();

  backgroundMusic.pause();
}

function reset() {
  while (enemies.length > 0) {
    if (enemies[0].isDead) {
      enemies.splice(0, 1);
      continue;
    }
    enemies[0].die();
    enemies.splice(0, 1);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      loadedMap[i][j].deleteContainer();
    }
  }
  g.clear();
  health.sprite.destroy();
  dashIndicator.destroy();
  biomeIndicator.destroy();
  player.destroySprites();
  clearInterval(timerInterval);

  //backToMainMenu();
  //sounds.adventureMusic.pause();
}

function setMenuSlime() {
  menuSlime = new PIXI.AnimatedSprite(enemiesSheet.animations["slimeL"]);
  menuSlime.play();
  menuSlime.visible = true;
  menuSlime.anchor.set(0.5, 0.5);
  menuSlime.width = BLOCK_SIZE * 7;
  menuSlime.height = BLOCK_SIZE * 7;
  menuSlime.x = canvas.width * 0.76;
  menuSlime.y = canvas.height * 0.58;
  menuSlime.zIndex = 15;
  menuSlime.animationSpeed = 0.15;
  menuSlime.loop = true;
  mainContainer.addChild(menuSlime);
}

function playFromMenu() {
  playSound("UIClick");
  if (firstTutorial) {
    tutorialFromInfo = false;
    menuSlime.visible = false;

    let menuElements = document.getElementsByClassName("menu");
    for (let elem of menuElements) {
      elem.style.display = "none";
    }
    tutorialPage = 0;
    drawTutorialPage();
  } else {
    play();
  }
}
