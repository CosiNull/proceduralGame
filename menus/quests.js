function setQuests() {
  let menuElements = document.getElementsByClassName("menu");

  for (let elem of menuElements) {
    elem.style.display = "none";
  }
  menuSlime.visible = false;

  for (let elem of document.getElementsByClassName("quests")) {
    elem.style.display = "flex";
  }

  playSound("UIClick");

  updateMoney();

  updateQuestsStatus();
}
function backToMenuQuests() {
  for (let elem of document.getElementsByClassName("quests")) {
    elem.style.display = "none";
  }
  backToMainMenu();
  playSound("UIClick");
}

let bounties = {
  temple: 55,
  slime: 65,
  bee: 75,
  lava: 85,
  travel: 100,
  kill: 105,
  time: 95,
};

let questStatus = {
  temple: 0,
  slime: 0,
  bee: 0,
  lava: 0,
  travel: 0,
  kill: 0,
  time: 0,
};
if (sessionStorage.getItem("quests")) {
  questStatus = JSON.parse(sessionStorage.getItem("quests"));
}
function updateQuestStatusSave() {
  sessionStorage.setItem("quests", JSON.stringify(questStatus));
}

function updateQuestsStatus() {
  for (let elem of document.getElementsByClassName("questClaimable")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("questClaim")) {
    elem.style.display = "none";
  }
  for (let status in questStatus) {
    if (questStatus[status] == 0) {
      questClaims[status].style.display = "flex";
    } else if (questStatus[status] == 1) {
      questClaimable[status].style.display = "flex";
    } else if (questStatus[status] == 2) {
      questClaims[status].style.display = "flex";
      questClaims[status].innerHTML = "CLAIMED";
      questClaims[status].style.color = "cyan";
      questClaims[status].style.border = "2px solid cyan";
    }
  }
}

function getQuestReward(questID) {
  totalGold += bounties[questID];
  questStatus[questID] = 2;
  questClaims[questID].innerHTML = "CLAIMED";
  questClaims[questID].style.color = "cyan";
  questClaims[questID].style.border = "2px solid cyan";
  playSound("bonusGold");
  updateQuestsStatus();
  updateQuestStatusSave();
  updateMoney();
}

function drawQuestNotif() {
  for (let quest in questStatus) {
    if (questStatus[quest] == 1) {
      questNotif.style.display = "flex";
      return;
    }
  }
  questNotif.style.display = "none";
}
