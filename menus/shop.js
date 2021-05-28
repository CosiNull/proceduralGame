let totalGold = 0;

if (sessionStorage.getItem("gold")) {
  totalGold = Number(sessionStorage.getItem("gold"));
}
function setShop() {
  let menuElements = document.getElementsByClassName("menu");

  for (let elem of menuElements) {
    elem.style.display = "none";
  }
  menuSlime.visible = false;

  for (let elem of document.getElementsByClassName("shop")) {
    elem.style.display = "flex";
  }

  playSound("UIClick");
  updateMoney();
}

function backToMenuShop() {
  for (let elem of document.getElementsByClassName("shop")) {
    elem.style.display = "none";
  }
  backToMainMenu();
  cancelSeed();
  playSound("UIClick");
}

function updateMoney() {
  moneyShop.innerText = `GOLD: ${totalGold}$`;
  sessionStorage.setItem("gold", totalGold);
}

//Seeds
let randomSeedSetting = true;
//Session storage in elements for this// :>

function setSeedTypeSave() {
  sessionStorage.setItem("random", randomSeedSetting);
}

let savedSeed = 0;
//Session storage in elements for this// :>

function saveSeedNum() {
  sessionStorage.setItem("seedNum", savedSeed);
}

let seedPopUp = false;
function setSeedSetting(button) {
  if (seedPopUp) return;
  if (button == "custom") {
    seedSettings.popUp.style.display = "flex";
    seedPopUp = true;

    seedSettings.random.style.color = "rgb(56,56,56)";
    seedSettings.custom.style.color = "white";
  } else if (!randomSeedSetting && button == "random") {
    seedSettings.custom.style.color = "rgb(56,56,56)";
    seedSettings.random.style.color = "white";
    randomSeedSetting = true;
    setSeedTypeSave();
  }
}

function cancelSeed() {
  if (randomSeedSetting) {
    seedSettings.custom.style.color = "rgb(56,56,56)";
    seedSettings.random.style.color = "white";
    randomSeedSetting = true;
    setSeedTypeSave();
  }
  seedSettings.popUp.style.display = "none";
  seedPopUp = false;
}
function confirmSeed() {
  if (seedSettings.input.value.length == 0 || totalGold < 1) {
    playSound("wrong");
    return;
  }
  if (savedSeed != Number(seedSettings.input.value)) {
    totalGold -= 1;
    playSound("money");
  }
  savedSeed = Number(seedSettings.input.value);
  saveSeedNum();

  randomSeedSetting = false;
  setSeedTypeSave();
  seedSettings.popUp.style.display = "none";
  seedPopUp = false;
  updateMoney();
}

//PowerUps
let upgrades = {
  attack: 0,
  speed: 0,
  dash: 0,
  timer: 0,
};
if (sessionStorage.getItem("upgrades")) {
  upgrades = JSON.parse(sessionStorage.getItem("upgrades"));
}
function setUpgradesShop() {
  for (let upgrade in shopUpgrades) {
    let elem = shopUpgrades[upgrade];
    let price = upgrades[upgrade] * 21 + 18;
    elem.innerHTML = `-${price}$`;
    if (upgrades[upgrade] == 3) {
      let elemStyle = getComputedStyle(elem);
      elem.className = "byebye";
      elem.style.display = "none";

      let newElem = document.createElement("div");

      newElem.className = "soldOut shop";
      newElem.style.left = elemStyle.left;
      newElem.style.top = elemStyle.top;
      newElem.style.display = "none";
      newElem.innerHTML = "MAX";
      document.body.appendChild(newElem);
    }
  }
}
function updateUpgradesSave() {
  sessionStorage.setItem("upgrades", JSON.stringify(upgrades));
}

function buyPowerUp(powerUp) {
  let price = upgrades[powerUp] * 21 + 18;
  if (price > totalGold || seedPopUp) {
    playSound("wrong");
    return;
  }

  let elem = document.getElementById(`more${powerUp}Butt`);
  elem.innerHTML = `-${price + 21}$`;
  upgrades[powerUp]++;
  totalGold -= price;
  playSound("money");
  updateMoney();

  if (upgrades[powerUp] == 3) {
    let elemStyle = getComputedStyle(elem);
    elem.className = "byebye";
    elem.style.display = "none";

    let newElem = document.createElement("div");

    newElem.className = "soldOut shop";
    newElem.style.left = elemStyle.left;
    newElem.style.top = elemStyle.top;
    newElem.innerHTML = "MAX";
    document.body.appendChild(newElem);
  }
  updateUpgradesSave();
}

function boss() {
  if (seedPopUp) {
    playSound("wrong");
    return;
  }

  let price = 508;
  if (price > totalGold) {
    playSound("wrong");
    return;
  }
  updateMoney();
  playSound("money");

  setBoss();
}

function setBoss() {
  for (let elem of document.getElementsByClassName("menu")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("shop")) {
    elem.style.display = "none";
  }
  let stuff = document.getElementById("stuff");
  stuff.src = "./sounds/src/stuff.mp4";
  //https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&loop=1&start=9
  stuff.style.display = "block";
}
