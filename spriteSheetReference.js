const FRAME_SIZE = 64;
const ROWS = 54;
const COLS = 13;
const frameNums = [];
let cellNum = 0;
for (let i = 0; i < 35; i++) {
  const temp = [];
  for (let j = 0; j < 9; j++) {
    temp.push(cellNum);
    cellNum++;
  }
  frameNums.push(temp);
}

const buttonFrames = [];
let cellNumber = 0;
for (let i = 0; i < 24; i++) {
  const temp = [];
  for (let j = 0; j < 33; j++) {
    temp.push(cellNumber);
    cellNumber++;
  }
  buttonFrames.push(temp);
}
console.log(frameNums);
