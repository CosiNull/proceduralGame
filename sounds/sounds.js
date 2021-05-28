let soundNames = [
  "adventureMusic",
  "damage",
  "dash",
  "discovery",
  "money",
  "swing",
  "ouch",
  "wrong",
  "bonusGold",
  "gameOver",
  "hiveMusic",
  "lavaMusic",
  "slimeMusic",
  "templeMusic",
  "UIClick",
  "randomMusic",
  "woodDestroy",
  "specialAttack",
];
let mp3Sounds = {
  adventureMusic: true,
  wrong: true,
  hiveMusic: true,
  slimeMusic: true,
  UIClick: true,
};
let sounds = {};

for (let name of soundNames) {
  sounds[name] = new Audio();

  let fileType = mp3Sounds[name] ? ".mp3" : ".wav";
  if (name == "lavaMusic") fileType = ".ogg";

  sounds[name].src = "./sounds/src/" + name + fileType;
}

function playSound(name, volume = 1) {
  let sound = new Audio();
  sound.src = sounds[name].src;
  sound.volume = volume;
  sound.play();
}
sounds.adventureMusic.loop = true;
