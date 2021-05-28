//Affine
function getLineTiles(x1, y1, x2, y2) {
  let result = [];

  let x = x1;
  let y = y1;

  let dx = x2 - x1;
  let dy = y2 - y1;

  let inverted = false;

  let step = Math.sign(dx);
  let gradientStep = Math.sign(dy);

  let longest = Math.abs(dx);
  let shortest = Math.abs(dy);

  if (longest < shortest) {
    [step, gradientStep] = [gradientStep, step];
    [longest, shortest] = [shortest, longest];
    inverted = true;
  }
  let gradientAcc = Math.floor(longest / 2);

  for (let i = 0; i <= longest; i++) {
    result.push({ x, y });
    if (inverted) y += step;
    else x += step;
    gradientAcc += shortest;
    if (gradientAcc >= longest) {
      if (inverted) x += gradientStep;
      else y += gradientStep;

      gradientAcc -= longest;
    }
  }
  return result;
}

function rectRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2) {
    return true;
  } else {
    return false;
  }
}

function calculateAngle(middleX, middleY, x2, y2) {
  let distanceX = x2 - middleX;
  let distanceY = y2 - middleY;

  return Math.atan2(distanceY, distanceX);
}

function circleTouchRect(cX, cY, cR, rX, rY, rW, rH) {
  //Default values
  let testX = cX;
  let testY = cY;

  //Choose closest side
  if (cX < rX) testX = rX;
  else if (cX > rX + rW) testX = rX + rW;

  if (cY < rY) testY = rY;
  else if (cY > rY + rH) testY = rY + rH;

  let distX = cX - testX;
  let distY = cY - testY;

  if (distX ** 2 + distY ** 2 <= cR ** 2) {
    return true;
  } else {
    return false;
  }
}
