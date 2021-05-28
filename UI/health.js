let health = {
  maxTimer: 30,
  displayCount: 0,
  sprite: null,
  timerSpeed: 23, //miliseconds
  scoredCount: 0,
  newBiomeCount: 0,
  timerCount: 0.06,
};
//let maxTimer = 30;
//let healthTimer = maxTimer;
//let healthDisplayCount = 0;
//let healthText = null;
//let timerSpeed = 0.09;

function loadHealthBar() {
  health.timer = health.maxTimer;
  health.sprite = new PIXI.Text(health.timer.toFixed(2), {
    fontFamily: "Press Start 2P, cursive",
    fontSize: BLOCK_SIZE * 0.7,
    fill: 0xffffff,
    align: "center",
  });
  health.sprite.anchor.set(0.5, 0);
  health.sprite.x = canvas.width / 2;
  health.sprite.y = canvas.height * 0.022;
  health.sprite.alpha = 0.9;
  health.sprite.zIndex = 25;

  mainContainer.addChild(health.sprite);

  timerInterval = setInterval(timerFunction, health.timerSpeed);
}

function updateHealthBar() {
  if (health.newBiomeCount > 0) {
    health.sprite.style.fill = 0xaa00aa;
    health.sprite.style.fontSize = BLOCK_SIZE * 0.78;
    health.sprite.y = canvas.height * 0.03;
    health.newBiomeCount--;
  } else if (health.scoredCount > 0) {
    health.sprite.style.fill = 0x00ff00;
    health.sprite.style.fontSize = BLOCK_SIZE * 0.74;
    health.sprite.y = canvas.height * 0.027;
    health.scoredCount--;
  } else if (health.scoredCount < 0) {
    health.sprite.style.fill = 0xff0000;
    health.sprite.style.fontSize = BLOCK_SIZE * 0.65;
    health.sprite.y = canvas.height * 0.027;
    health.scoredCount++;
  } else {
    health.sprite.style.fill = 0xffffff;
    health.sprite.style.fontSize = BLOCK_SIZE * 0.7;
    health.sprite.y = canvas.height * 0.022;
  }

  if (health.displayCount > 0) {
    health.sprite.text = health.timer.toFixed(2);
    health.displayCount = 0;
  } else {
    health.displayCount++;
  }
  if (health.timer < 0) {
    gameOver();
  }
}
let timerInterval;

let timerFunction = () => {
  if (loaded && gameMode == "play") {
    if (health.timer > health.maxTimer) {
      health.timer = health.maxTimer;
    } else {
      health.timer -= health.timerCount;
      score.time += health.timerSpeed / 1000;
    }
  }
};

let gameOverCount = 0;
function gameOver() {
  gameOverCount = 0;
  health.timer = 0;
  health.sprite.text = health.timer.toFixed(2);
  gameMode = "gameOverTransition";
  player.die();
  player.dead = true;

  for (let i = 0; i < 100; i++) {
    particles.push(
      new Particle(
        player.x + offset.x,
        player.y + offset.y,
        0xffffff,
        2 + Math.random() * 10,
        Math.PI * 2 * Math.random(),
        Math.random() * 7 + 10,
        Math.random() * 10 + 10
      )
    );
    //console.log(particles[particles.length - 1]);
  }

  screenShake.timeLeft = 12;
  screenShake.amplitude = 6;
}
