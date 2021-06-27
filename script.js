const field = [[null,null,null],
               [null,null,null],
               [null,null,null]];
const drawnField = document.querySelector("#field");
let player = 1;
let gameOver = false;
let turns = 0;
const svg = document.querySelector('svg');
const pt = svg.createSVGPoint();
const turnStatus = document.querySelector("#turn-status");

const getMouseCoordinates = (event) => {
  let row = null;
  let column = null;

  pt.x = event.clientX;
  pt.y = event.clientY;
  const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());

  // rows
  if (cursorPt.y >= 0 && cursorPt.y < 65) {
    row = 0;
  }
  if (cursorPt.y > 75 && cursorPt.y < 140) {
    row = 1;
  }
  if (cursorPt.y > 150 && cursorPt.y < 215) {
    row = 2;
  }

  // columns
  if (cursorPt.x >= 0 && cursorPt.x < 65) {
    column = 0;
  }
  if (cursorPt.x > 75 && cursorPt.x < 140) {
    column = 1;
  }
  if (cursorPt.x > 150 && cursorPt.x < 215) {
    column = 2;
  }

  return [row, column];
}

const changeThePlayer = () => {
  if (player === 1) {
    turnStatus.textContent = "Player 2, it's your turn!";
    player = 2;
  } else {
    turnStatus.textContent = "Player 1, it's your turn!";
    player = 1;
  }
}

const drawAFigure = (row, column) => {
  let x = 32.5 + 75 * column;
  let y = 32.5 + 75 * row;
  let figure = null;

   if (player === 1) {
    figure = `<g>
       <line x1=${x-27.5} y1=${y-27.5} x2=${x+27.5} y2=${y+27.5} stroke="#EB6935" stroke-width="5"/>
       <line x1=${x+27.5} y1=${y-27.5} x2=${x-27.5} y2=${y+27.5} stroke="#EB6935" stroke-width="5"/>
    </g>`;
   } else {
     figure = `<circle cx=${x} cy=${y} r="25"
     fill="#FFF" stroke="#A4E549" stroke-width="5"/>`;
   }

   drawnField.innerHTML += figure;
}

const endGame = (playerName) => {
  turnStatus.textContent = `Player ${player} won!`;
  gameOver = true;
  setTimeout(() => {
      document.querySelector("#restart").style.display = "block";
  }, 500);
}

const checkForWinner = () => {
 for (let i = 0; i < field.length; i++) {
    if (
    // check rows
    (field[i][0] == "x" && field[i][1] == "x" && field[i][2] == "x") ||
    (field[i][0] == "0" && field[i][1] == "0" && field[i][2] == "0") ||
    // check columns
    (field[0][i] == "x" && field[1][i] == "x" && field[2][i] == "x") ||
    (field[0][i] == "0" && field[1][i] == "0" && field[2][i] == "0")
    ) {
          endGame(player);
      }
 }
   // check diagonals
   if (
     (field[0][0] == "x" && field[1][1] == "x" && field[2][2] == "x") ||
     (field[0][2] == "x" && field[1][1] == "x" && field[2][0] == "x") ||
     (field[0][0] == "0" && field[1][1] == "0" && field[2][2] == "0") ||
     (field[0][2] == "0" && field[1][1] == "0" && field[2][0] == "0")
   ) {
     endGame(player);
   }

   // check for a draw
   if (turns === 9 && gameOver === false) {
     turnStatus.textContent = `A draw!`;
     gameOver = true;
     setTimeout(() => {
         document.querySelector("#restart").style.display = "block";
     }, 500);
   }

   if (turns < 9 && gameOver === false) {
       changeThePlayer();
   }
}

const fillTheCell = () => {
  const coordinates = getMouseCoordinates(event);
  if (field[coordinates[0]][coordinates[1]] === null
    && gameOver === false) {
    turns++;
    drawAFigure(coordinates[0],coordinates[1]);
    if (player == 1) {
      field[coordinates[0]][coordinates[1]] = "x";
    } else {
      field[coordinates[0]][coordinates[1]] = "0";
    }
    checkForWinner();
  }
}

const restartGame = () => {
  gameOver = false;
  turns = 0;
  turnStatus.textContent = "Player 1, it's your turn!";
  player = 1;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      field[i][j] = null;
    }
  }

  drawnField.innerHTML = `
  <line x1="70" y1="0" x2="70" y2="215" stroke="black" stroke-width="10" />
  <line x1="145" y1="0" x2="145" y2="215" stroke="black" stroke-width="10" />
  <line x1="0" y1="70" x2="215" y2="70" stroke="black" stroke-width="10" />
  <line x1="0" y1="145" x2="215" y2="145" stroke="black" stroke-width="10" />`;

  document.querySelector("#restart").style.display = "none";
}

document.querySelector("#field").addEventListener('click', fillTheCell);
document.querySelector("#restart").addEventListener('click', restartGame);
