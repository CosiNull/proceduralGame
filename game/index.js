//Fps manipulation
let fps = 30;
let fpsInterval = 1000 / fps;
let then = Date.now();

function draw() {
  //Basic stuff
  requestAnimationFrame(draw);

  now = Date.now();
  let elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    //Drawing code______________________________________________________________
    c.clearRect(0, 0, canvas.width, canvas.height);

    if (loaded) {
      if (gameMode == "play") {
        //loaded map
        for (let y of loadedMap) {
          for (let x of y) {
            x.draw();
          }
        }
        //player
        player.update();
        player.draw();
        drawShadows();

        //enemies
        updateEnemies();

        //Effects
        handleScreenShake();
        updateParticles();
        cameraMovement();

        //UI
        updateHealthBar();
        updateDashIndicator();
        updateBiomeIndicator();
      } else if (gameMode == "gameOverTransition") {
        //loaded map
        for (let y of loadedMap) {
          for (let x of y) {
            x.draw();
          }
        }

        //enemies
        updateEnemies();

        //Effects
        handleScreenShake();
        updateParticles();
        cameraMovement();
        drawShadows();

        gameOverCount++;
        if (gameOverCount > 50) {
          gameMode = "gameOver";
          setGameOver();
        }
      } else if (gameMode == "gameOver") {
      }
    }
  }
}

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

async function mapLoop() {
  await wait(22);
  if (loaded) {
    updateLoadedMap();
  }
  mapLoop();
}
//let screen = new Path2D();
//screen.rect(0, 0, canvas.width, canvas.height);
//c.clip(screen);

mapLoop();
draw();
