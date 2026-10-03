/* FALLING */

const falling = document.getElementById("falling");

for (let i = 0; i < 30; i++) {
  const item = document.createElement("div");

  item.className = "fall " + (Math.random() > 0.5 ? "x" : "o");

  item.textContent = Math.random() > 0.5 ? "X" : "O";

  item.style.left = Math.random() * 100 + "%";

  item.style.animationDuration = 7 + Math.random() * 10 + "s";

  item.style.animationDelay = -Math.random() * 12 + "s";

  item.style.fontSize = 18 + Math.random() * 25 + "px";

  falling.appendChild(item);
}

/* ELEMENTS */

const menuScreen = document.getElementById("menuScreen");

const gameScreen = document.getElementById("gameScreen");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");

const robotBtn = document.getElementById("robotBtn");

const playerXName = document.getElementById("playerXName");

const playerOName = document.getElementById("playerOName");

const playerOTitle = document.getElementById("playerOTitle");

const playBtn = document.getElementById("playBtn");

const themeBtn = document.getElementById("themeBtn");

const xColorPicker = document.getElementById("xColorPicker");

const oColorPicker = document.getElementById("oColorPicker");

const swapBtn = document.getElementById("swapBtn");

const cells = document.querySelectorAll(".cell");

const board = document.getElementById("board");

const winLine = document.getElementById("winLine");

const xScore = document.getElementById("xScore");

const oScore = document.getElementById("oScore");

const timeValue = document.getElementById("timeValue");

const turnName = document.getElementById("turnName");

const turnSymbol = document.getElementById("turnSymbol");

const turnAvatar = document.getElementById("turnAvatar");

const countdownOverlay = document.getElementById("countdownOverlay");

const countdownNumber = document.getElementById("countdownNumber");

const resultOverlay = document.getElementById("resultOverlay");

const resultTitle = document.getElementById("resultTitle");

const resultSub = document.getElementById("resultSub");

const nextRoundBtn = document.getElementById("nextRoundBtn");

const menuBtn = document.getElementById("menuBtn");

const profileOverlay = document.getElementById("profileOverlay");

const profileCloseBtn = document.getElementById("profileCloseBtn");

const avatarX = document.getElementById("avatarX");

const avatarO = document.getElementById("avatarO");

const photoButtonX = document.getElementById("photoButtonX");

const photoButtonO = document.getElementById("photoButtonO");

const adsBtn = document.getElementById("adsBtn");

const adsOverlay = document.getElementById("adsOverlay");

const adsCloseBtn = document.getElementById("adsCloseBtn");

const payBtn = document.getElementById("payBtn");

const realTime = document.getElementById("realTime");

/* VARIABLES */

let mode = "2players";

let targetScore = 6;

let boardState = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameActive = false;

let timer = null;

let countdownTimer = null;

let timeLeft = 60;

let xWins = 0;

let oWins = 0;

let draws = 0;

let xPhoto = "";

let oPhoto = "";

/* WIN COMBINATIONS */

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

/* REAL TIME */

function updateRealTime() {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");

  const m = String(now.getMinutes()).padStart(2, "0");

  const s = String(now.getSeconds()).padStart(2, "0");

  realTime.textContent = h + ":" + m + ":" + s;
}

updateRealTime();

setInterval(updateRealTime, 1000);

/* MODE */

twoPlayerBtn.onclick = () => {
  mode = "2players";

  twoPlayerBtn.classList.add("active");

  robotBtn.classList.remove("active");

  playerOTitle.textContent = "PLAYER O";

  playerOName.value = "";

  playerOName.placeholder = "Enter your name";
};

robotBtn.onclick = () => {
  mode = "robot";

  robotBtn.classList.add("active");

  twoPlayerBtn.classList.remove("active");

  playerOTitle.textContent = "ROBOT O";

  playerOName.value = "Robot";

  playerOName.placeholder = "Robot";
};

/* SCORE */

document.querySelectorAll(".scoreBtn").forEach((btn) => {
  btn.onclick = () => {
    document
      .querySelectorAll(".scoreBtn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    targetScore = Number(btn.dataset.score);
  };
});

/* COLORS */

function applyColors() {
  document.documentElement.style.setProperty("--xColor", xColorPicker.value);

  document.documentElement.style.setProperty("--oColor", oColorPicker.value);
}

xColorPicker.oninput = applyColors;

oColorPicker.oninput = applyColors;

/* SWAP */

swapBtn.onclick = () => {
  const xColor = xColorPicker.value;

  const oColor = oColorPicker.value;

  xColorPicker.value = oColor;

  oColorPicker.value = xColor;

  const xName = playerXName.value;

  const oName = playerOName.value;

  playerXName.value = oName;

  playerOName.value = xName;

  applyColors();

  swapBtn.textContent = "SWAPPED X / O";

  setTimeout(() => {
    swapBtn.textContent = "SWAP X / O";
  }, 1200);
};

/* THEME */

themeBtn.onclick = () => {
  document.body.classList.toggle("light");

  themeBtn.textContent = document.body.classList.contains("light")
    ? "NIGHT MODE"
    : "LIGHT MODE";
};

/* PROFILE */

function showProfile() {
  profileOverlay.classList.add("show");
}

avatarX.onclick = showProfile;

avatarO.onclick = showProfile;

photoButtonX.onclick = showProfile;

photoButtonO.onclick = showProfile;

profileCloseBtn.onclick = () => {
  profileOverlay.classList.remove("show");
};

/* ADS */

adsBtn.onclick = () => {
  adsOverlay.classList.add("show");
};

adsCloseBtn.onclick = () => {
  adsOverlay.classList.remove("show");
};

/* PAY */

payBtn.onclick = () => {
  payBtn.textContent = "COMING SOON";

  setTimeout(() => {
    payBtn.textContent = "PAY";
  }, 1500);
};

/* WINNER */

function checkWinner(state) {
  for (const combo of winCombos) {
    const a = combo[0];

    const b = combo[1];

    const c = combo[2];

    if (state[a] !== "" && state[a] === state[b] && state[b] === state[c]) {
      return {
        winner: state[a],
        combo: combo,
      };
    }
  }

  return null;
}

/* DRAW */

function isDraw() {
  return boardState.every((cell) => cell !== "");
}

/* PLAY */

playBtn.onclick = () => {
  if (playerXName.value.trim() === "") {
    playerXName.value = "Player X";
  }

  if (mode === "2players" && playerOName.value.trim() === "") {
    playerOName.value = "Player O";
  }

  if (mode === "robot") {
    playerOName.value = "Robot";
  }

  menuScreen.style.display = "none";

  gameScreen.style.display = "block";

  restartMatch();
};

/* RESTART */

function restartMatch() {
  clearInterval(timer);

  clearInterval(countdownTimer);

  xWins = 0;

  oWins = 0;

  draws = 0;

  updateScore();

  resetBoard();
}

/* RESET */

function resetBoard() {
  clearInterval(timer);

  clearInterval(countdownTimer);

  boardState = ["", "", "", "", "", "", "", "", ""];

  cells.forEach((cell) => {
    cell.textContent = "";

    cell.className = "cell";
  });

  winLine.style.display = "none";

  winLine.style.width = "0px";

  timeLeft = 60;

  timeValue.textContent = timeLeft;

  gameActive = false;

  currentPlayer = Math.random() < 0.5 ? "X" : "O";

  updateTurn();

  startCountdown();
}

/* COUNTDOWN */

function startCountdown() {
  countdownOverlay.classList.add("show");

  let count = 3;

  countdownNumber.textContent = count;

  countdownTimer = setInterval(() => {
    count--;

    if (count > 0) {
      countdownNumber.textContent = count;
    } else if (count === 0) {
      countdownNumber.textContent = "GO!";
    } else {
      clearInterval(countdownTimer);

      countdownOverlay.classList.remove("show");

      gameActive = true;

      startTimer();

      if (mode === "robot" && currentPlayer === "O") {
        setTimeout(robotMove, 450);
      }
    }
  }, 700);
}

/* TIMER */

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    if (!gameActive) return;

    timeLeft--;

    timeValue.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);

      endRound("DRAW");
    }
  }, 1000);
}

/* TURN */

function updateTurn() {
  const name =
    currentPlayer === "X"
      ? playerXName.value.trim() || "Player X"
      : playerOName.value.trim() || (mode === "robot" ? "Robot" : "Player O");

  turnName.textContent = name;

  turnSymbol.textContent = currentPlayer + " TURN";

  turnAvatar.innerHTML = "";

  const photo = currentPlayer === "X" ? xPhoto : oPhoto;

  if (photo) {
    turnAvatar.innerHTML = `<img src="${photo}">`;
  } else {
    turnAvatar.textContent = currentPlayer;
  }

  turnAvatar.style.color =
    currentPlayer === "X" ? "var(--xColor)" : "var(--oColor)";
}

/* CELLS */

cells.forEach((cell) => {
  cell.onclick = () => {
    if (!gameActive) return;

    const index = Number(cell.dataset.index);

    if (boardState[index] !== "") return;

    if (mode === "robot" && currentPlayer === "O") return;

    makeMove(index, currentPlayer);
  };
});

/* MOVE */

function makeMove(index, player) {
  if (!gameActive || boardState[index] !== "") return;

  boardState[index] = player;

  cells[index].textContent = player;

  cells[index].classList.add(player.toLowerCase());

  cells[index].classList.add("disabled");

  const result = checkWinner(boardState);

  if (result) {
    gameActive = false;

    clearInterval(timer);

    drawWinLine(result.combo);

    setTimeout(() => {
      endRound(result.winner);
    }, 450);

    return;
  }

  if (isDraw()) {
    gameActive = false;

    clearInterval(timer);

    endRound("DRAW");

    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  updateTurn();

  if (mode === "robot" && currentPlayer === "O") {
    setTimeout(robotMove, 400);
  }
}

/* WHITE WIN LINE */

function drawWinLine(combo) {
  if (!combo || combo.length !== 3) return;

  const first = cells[combo[0]];

  const third = cells[combo[2]];

  if (!first || !third) return;

  const boardRect = board.getBoundingClientRect();

  const firstRect = first.getBoundingClientRect();

  const thirdRect = third.getBoundingClientRect();

  const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;

  const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;

  const x2 = thirdRect.left + thirdRect.width / 2 - boardRect.left;

  const y2 = thirdRect.top + thirdRect.height / 2 - boardRect.top;

  const dx = x2 - x1;

  const dy = y2 - y1;

  const length = Math.sqrt(dx * dx + dy * dy);

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  winLine.style.display = "block";

  winLine.style.width = length + "px";

  winLine.style.left = x1 + "px";

  winLine.style.top = y1 + "px";

  winLine.style.transform = `translateY(-50%) rotate(${angle}deg)`;
}

/* REDRAW LINE */

window.addEventListener("resize", () => {
  const result = checkWinner(boardState);

  if (result && winLine.style.display === "block") {
    drawWinLine(result.combo);
  }
});

/* END ROUND */

function endRound(result) {
  gameActive = false;

  clearInterval(timer);

  if (result === "X") {
    xWins++;

    resultTitle.textContent = "X WINS";

    resultSub.textContent = `${getPlayerName("X")} wins the round.`;
  } else if (result === "O") {
    oWins++;

    resultTitle.textContent = "O WINS";

    resultSub.textContent = `${getPlayerName("O")} wins the round.`;
  } else {
    draws++;

    resultTitle.textContent = "DRAW";

    resultSub.textContent = "No player completed a winning line.";
  }

  updateScore();

  if (xWins >= targetScore || oWins >= targetScore) {
    if (xWins > oWins) {
      resultTitle.textContent = "X WINS THE MATCH";

      resultSub.textContent = `${getPlayerName("X")} reached ${targetScore} points.`;
    } else {
      resultTitle.textContent = "O WINS THE MATCH";

      resultSub.textContent = `${getPlayerName("O")} reached ${targetScore} points.`;
    }

    nextRoundBtn.textContent = "PLAY AGAIN";

    nextRoundBtn.dataset.final = "true";
  } else {
    resultSub.textContent += ` Score: X ${xWins} - O ${oWins}.`;

    nextRoundBtn.textContent = "NEXT ROUND";

    nextRoundBtn.dataset.final = "false";
  }

  resultOverlay.classList.add("show");
}

/* NAME */

function getPlayerName(player) {
  if (player === "X") {
    return playerXName.value.trim() || "Player X";
  }

  return playerOName.value.trim() || (mode === "robot" ? "Robot" : "Player O");
}

/* SCORE */

function updateScore() {
  xScore.textContent = xWins;

  oScore.textContent = oWins;
}

/* NEXT */

nextRoundBtn.onclick = () => {
  const final = nextRoundBtn.dataset.final === "true";

  resultOverlay.classList.remove("show");

  if (final) {
    restartMatch();
  } else {
    resetBoard();
  }
};

/* MENU */

menuBtn.onclick = () => {
  clearInterval(timer);

  clearInterval(countdownTimer);

  gameActive = false;

  resultOverlay.classList.remove("show");

  countdownOverlay.classList.remove("show");

  gameScreen.style.display = "none";

  menuScreen.style.display = "block";
};

/* ROBOT */

function randomMove() {
  const empty = [];

  boardState.forEach((value, index) => {
    if (value === "") empty.push(index);
  });

  if (empty.length === 0) return null;

  return empty[Math.floor(Math.random() * empty.length)];
}

function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (boardState[i] !== "") continue;

    boardState[i] = player;

    const result = checkWinner(boardState);

    boardState[i] = "";

    if (result && result.winner === player) {
      return i;
    }
  }

  return null;
}

function mediumMove() {
  const win = findWinningMove("O");

  if (win !== null) return win;

  const block = findWinningMove("X");

  if (block !== null) return block;

  if (boardState[4] === "") return 4;

  const corners = [0, 2, 6, 8].filter((i) => boardState[i] === "");

  if (corners.length) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return randomMove();
}

function robotMove() {
  if (!gameActive || mode !== "robot" || currentPlayer !== "O") return;

  const move = mediumMove();

  if (move !== null && move !== undefined) {
    makeMove(move, "O");
  }
}

/* DEFAULT */

applyColors();
