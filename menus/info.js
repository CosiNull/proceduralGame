function setInfo() {
  playSound("UIClick");
  let menuElements = document.getElementsByClassName("menu");

  for (let elem of menuElements) {
    elem.style.display = "none";
  }
  menuSlime.visible = false;

  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "flex";
  }
}
function backToMenuInfo() {
  playSound("UIClick");
  let menuElements = document.getElementsByClassName("menu");

  for (let elem of menuElements) {
    elem.style.display = "flex";
  }
  menuSlime.visible = true;

  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "none";
  }
  drawQuestNotif();
}

function setProceduralGen() {
  playSound("UIClick");
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("proceduralGen")) {
    elem.style.display = "flex";
  }
}

function resetConfirm() {
  playSound("UIClick");
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("resetConfirmation")) {
    elem.style.display = "flex";
  }
}

function clearProgress() {
  playSound("UIClick");
  sessionStorage.clear();
  location = location;
}
function backToInfoReset() {
  playSound("UIClick");
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "flex";
  }
  for (let elem of document.getElementsByClassName("resetConfirmation")) {
    elem.style.display = "none";
  }
}

function showThanks() {
  playSound("UIClick");
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("thanks")) {
    elem.style.display = "flex";
  }
}

function backToInfo() {
  playSound("UIClick");
  //___________________________________________________________________HELLO
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "flex";
  }
  for (let elem of document.getElementsByClassName("proceduralGen")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("thanks")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("end")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("worldMap")) {
    elem.style.display = "none";
  }
}

function showEndText() {
  playSound("UIClick");
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("end")) {
    elem.style.display = "flex";
  }
}

function showWorldMap() {
  playSound("UIClick");
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "none";
  }
  for (let elem of document.getElementsByClassName("worldMap")) {
    elem.style.display = "flex";
  }
}

function showTutorial() {
  for (let elem of document.getElementsByClassName("info")) {
    elem.style.display = "none";
  }
  tutorialPage = 0;
  drawTutorialPage();
}
let tutorialPage = 0;

function drawTutorialPage() {
  for (let i = 0; i < 3; i++) {
    let displayState = tutorialPage == i ? "flex" : "none";
    for (let elem of document.getElementsByClassName("tutorial" + i)) {
      elem.style.display = displayState;
    }
  }
}

let tutorialFromInfo = true;
let firstTutorial = sessionStorage.getItem("firstTutorial") ? false : true;

function tutorialPageNext() {
  tutorialPage++;
  drawTutorialPage();
  playSound("UIClick");
}
function tutorialPageBack() {
  tutorialPage--;
  drawTutorialPage();
  playSound("UIClick");
}
function finishTutorial() {
  for (let elem of document.getElementsByClassName("tutorial2")) {
    elem.style.display = "none";
  }
  if (tutorialFromInfo) {
    for (let elem of document.getElementsByClassName("info")) {
      elem.style.display = "flex";
    }
  } else {
    tutorialFromInfo = true;
    firstTutorial = false;
    sessionStorage.setItem("firstTutorial", "true");
    play();
  }
  playSound("UIClick");
}
//TO DO
//-
//ALMOST DONE
// :)
//UI sound
//FAvicon
//Boss
