//let normalBiome = {
//  wall: new Image(),
//};
//
//normalBiome.wall.src = "";
let loaded = false;

//Pixi js
let playerSheet;
let terrainSheet;
let enemiesSheet;

app.loader
  .add("./images/enemies/enemies.json")
  .add("./images/map/terrain.json")
  .add("./images/player/player.json");

app.loader.load();

app.loader.onComplete.add(doneLoading);

function doneLoading(e) {
  playerSheet = app.loader.resources["./images/player/player.json"].spritesheet;
  terrainSheet = app.loader.resources["./images/map/terrain.json"].spritesheet;
  enemiesSheet =
    app.loader.resources["./images/enemies/enemies.json"].spritesheet;
  loaded = true;
  setMenuSlime();
}
