let offset = {
  x: CHUNK_WIDTH,
  y: CHUNK_WIDTH,
};
let cameraFocus = {
  //Go see canvas set up for initialization
  x: null,
  y: null,
};

let cameraSpeed = 10;

let mouse = {
  x: 0,
  y: 0,
  leftClick: false,
};

let keyPressed = {};

//____Events_____//
//Keydown
window.addEventListener("keydown", (e) => {
  keyPressed[e.code] = true;
});
//Keyup
window.addEventListener("keyup", (e) => {
  delete keyPressed[e.code];
});
//Mouse move
myCanvas.addEventListener("mousemove", (e) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});
myCanvas.addEventListener("mousedown", (e) => {
  if (e.which == 3 && !player.isDashing) {
    if (
      new Date().getTime() - player.lastDash > player.dashTimeout &&
      gameMode == "play"
    ) {
      playSound("dash");
      player.isDashing = true;
      player.dashCount = player.dashRepeatCount;
      let angle = calculateAngle(
        player.x + player.w / 2,
        player.y + player.h / 2,
        mouse.x,
        mouse.y
      );
      player.dashDirection = { x: Math.cos(angle), y: Math.sin(angle) };
      player.lastDash = new Date().getTime();
    }
  } else if (e.which == 1) {
    mouse.leftClick = true;
  }
});
myCanvas.addEventListener("mouseup", (e) => {
  if (e.which == 1) mouse.leftClick = false;
});

//keyboard_update
function cameraMovement() {
  if (mode == "player") {
    let cameraMovement = player.speed;
    //if (player.isDashing) return;

    if (player.x + player.w / 2 < cameraFocus.x) {
      let distance = Math.abs(cameraFocus.x - player.w / 2 - player.x);
      //let cameraMovement = (cameraSpeed * distance) / canvas.width + 5;
      if (player.isDashing) cameraMovement = Math.abs(player.xMovement);

      if (distance > cameraSpeed) {
        offset.x -= cameraMovement;
        player.x += cameraMovement;
        //player.previousPos.x += cameraMovement;
        currentPos.x -= cameraMovement;
      }
    } else if (player.x + player.w / 2 > cameraFocus.x) {
      let distance = Math.abs(cameraFocus.x - player.w / 2 - player.x);
      //let cameraMovement = (cameraSpeed * distance) / canvas.width + 5;
      //let cameraMovement = player.speed;
      if (player.isDashing) cameraMovement = Math.abs(player.xMovement);

      if (distance > cameraSpeed) {
        offset.x += cameraMovement;
        player.x -= cameraMovement;
        //player.previousPos.x -= cameraMovement;
        currentPos.x += cameraMovement;
      }
    }
    if (player.y + player.w / 2 < cameraFocus.y) {
      let distance = Math.abs(cameraFocus.y - player.w / 2 - player.y);
      //let cameraMovement = (cameraSpeed * distance) / canvas.width + 5;
      //let cameraMovement = player.speed;
      if (player.isDashing) cameraMovement = Math.abs(player.yMovement);

      if (distance > cameraSpeed) {
        offset.y -= cameraMovement;
        player.y += cameraMovement;
        //player.previousPos.y += cameraMovement;
        currentPos.y -= cameraMovement;
      }
    } else if (player.y + player.w / 2 > cameraFocus.y) {
      let distance = Math.abs(cameraFocus.y - player.w / 2 - player.y);
      //let cameraMovement = (cameraSpeed * distance) / canvas.width + 5;
      //let cameraMovement = player.speed;
      if (player.isDashing) cameraMovement = Math.abs(player.yMovement);

      if (distance > cameraSpeed) {
        offset.y += cameraMovement;
        player.y -= cameraMovement;
        //player.previousPos.y -= cameraMovement;
        currentPos.y += cameraMovement;
      }
    }
  } else if (mode == "spectator") {
    if (keyPressed["ArrowUp"]) {
      offset.y -= cameraSpeed;
      currentPos.y -= cameraSpeed;
      //console.log(currentPos.x, currentPos.y);
    }
    if (keyPressed["ArrowDown"]) {
      offset.y += cameraSpeed;
      currentPos.y += cameraSpeed;
      //console.log(currentPos.x, currentPos.y);
    }
    if (keyPressed["ArrowRight"]) {
      offset.x += cameraSpeed;
      currentPos.x += cameraSpeed;
      //console.log(currentPos.x, currentPos.y);
    }
    if (keyPressed["ArrowLeft"]) {
      offset.x -= cameraSpeed;
      currentPos.x -= cameraSpeed;
      //console.log(currentPos.x, currentPos.y);
    }
  }
}

//___ScreenShake

let screenShake = {
  x: 0,
  y: 0,
  timeLeft: 0,
  amplitude: 2,
};

function handleScreenShake() {
  if (screenShake.timeLeft > 0) {
    let angle = Math.random() * Math.PI * 2;
    let dx = Math.cos(angle) * screenShake.amplitude;
    let dy = Math.sin(angle) * screenShake.amplitude;

    mainContainer.x = dx;
    mainContainer.y = dy;
    screenShake.timeLeft--;
  } else {
    mainContainer.x = 0;
    mainContainer.y = 0;
  }
}
