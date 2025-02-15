const FRAME_SIZE = 64;
const ROWS = 54;
const COLS = 13;
const frameNums = [];
let cellNum = 0;
for (let i = 0; i < ROWS; i++) {
  const temp = [];
  for (let j = 0; j < 13; j++) {
    temp.push(cellNum);
    cellNum++;
  }
  frameNums.push(temp);
}

console.log(frameNums);
