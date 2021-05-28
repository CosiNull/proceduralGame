let distanceGO = document.getElementById("distanceGO");
let enemiesGO = document.getElementById("enemiesGO");
let timeGO = document.getElementById("timeGO");
let lootGO = document.getElementById("lootGO");
let totalGO = document.getElementById("totalGO");
let seedSettings = {
  random: document.getElementById("random"),
  custom: document.getElementById("custom"),
  popUp: document.getElementById("seedPopUp"),
  input: document.getElementById("seedInput"),
};
let shopUpgrades = {
  attack: document.getElementById("moreattackButt"),
  speed: document.getElementById("morespeedButt"),
  dash: document.getElementById("moredashButt"),
  timer: document.getElementById("moretimerButt"),
};
let questNotif = document.getElementById("questCompleted");
let questBounties = {};
let questClaims = {};
let questClaimable = {};
//
let moneyShop = document.getElementById("money");

function addText(element, text, color = "white", size = 28) {
  let span = document.createElement("span");
  span.innerHTML = text;
  span.className = "scoreText";
  span.style.color = color;
  span.style.fontSize = size + "px";

  element.appendChild(span);
}
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}
//Create bounties for quests
let questButtons = {};
function createBountiesDiv() {
  let questList = document.getElementsByClassName("questDes");
  for (let elem of questList) {
    let elemStyle = getComputedStyle(elem);
    let elemID = elem.id.substr(0, elem.id.length - 5); //
    //Bounties
    let newElem = document.createElement("div");
    newElem.style.top = elemStyle.top;
    newElem.className = "quests questBounty";

    newElem.innerHTML = `+${bounties[elemID]}$`;
    questBounties[elemID] = newElem;

    document.body.appendChild(newElem);
    //Claims
    let newElem2 = document.createElement("div");
    newElem2.style.top = elemStyle.top;
    newElem2.className = "quests questClaim";

    newElem2.innerHTML = `UNDONE`;
    questClaims[elemID] = newElem2;

    document.body.appendChild(newElem2);

    //Claimable
    let newElem3 = document.createElement("div");
    newElem3.style.top = elemStyle.top;
    newElem3.className = "quests questClaimable";

    newElem3.innerHTML = `CLAIM`;
    newElem3.onclick = () => {
      getQuestReward(elemID);
    };
    questClaimable[elemID] = newElem3;

    document.body.appendChild(newElem3);
  }
}
createBountiesDiv();
setUpgradesShop();
drawQuestNotif();
if (sessionStorage.getItem("seedNum")) {
  savedSeed = Number(sessionStorage.getItem("seedNum"));
  seedSettings.input.value = savedSeed;
}
if (sessionStorage.getItem("random")) {
  randomSeedSetting = sessionStorage.getItem("random").toLowerCase() === "true";
  console.log(randomSeedSetting);
  setSeedSetting(randomSeedSetting);

  if (randomSeedSetting) {
    seedSettings.custom.style.color = "rgb(56,56,56)";
    seedSettings.random.style.color = "white";
  } else {
    seedSettings.custom.style.color = "white";
    seedSettings.random.style.color = "rgb(56,56,56)";
  }
}
