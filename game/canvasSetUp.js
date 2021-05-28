let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  cameraFocus.x = canvas.width / 2;
  cameraFocus.y = canvas.height / 2;

  if (gameMode == "play") {
    health.sprite.x = canvas.width / 2;
    dashIndicator.x = canvas.width / 2;
    biomeIndicator.x = canvas.width * 0.98;
    biomeIndicator.y = canvas.height * 0.99;
  }

  menuSlime.x = canvas.width * 0.76;
  menuSlime.y = canvas.height * 0.58;
});

let c = canvas.getContext("2d");
c.fillStyle = "white";

cameraFocus.x = canvas.width / 2;
cameraFocus.y = canvas.height / 2;

//disable right click
document.oncontextmenu = new Function("return false;");
