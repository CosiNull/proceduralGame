let dashIndicator;

function loadDashIndicator() {
  dashIndicator = new PIXI.Text("DASH", {
    fontFamily: "Press Start 2P, cursive",
    fontSize: BLOCK_SIZE * 0.3,
    fill: 0xdddddd,
    align: "center",
  });
  dashIndicator.anchor.set(0.5, 0);
  dashIndicator.x = canvas.width / 2;
  dashIndicator.y = canvas.height * 0.09;
  dashIndicator.alpha = 0.9;
  dashIndicator.zIndex = 25;

  mainContainer.addChild(dashIndicator);
}

function updateDashIndicator() {
  if (new Date().getTime() - player.lastDash < player.dashTimeout) {
    dashIndicator.alpha = 0.1;
  } else {
    dashIndicator.alpha = 0.95;
  }
}
