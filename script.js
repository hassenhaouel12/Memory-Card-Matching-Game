document.addEventListener("DOMContentLoaded", () => {
  const cardsArray = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
  ];

  let moves = 0;
  let timer;
  let timeElapsed = 0;
  let matchedPairs = 0;
  let firstCard, secondCard;
  let lockBoard = false;

  const movesDisplay = document.getElementById("moves");
  const timerDisplay = document.getElementById("timer");
  const gameBoard = document.getElementById("game-board");
  const congratsMessage = document.getElementById("congrats-message");
  const finalMovesDisplay = document.getElementById("final-moves");
  const finalTimeDisplay = document.getElementById("final-time");
  const restartBtn = document.getElementById("restart-btn");
  const playAgainBtn = document.getElementById("play-again-btn");

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function createBoard() {
    const shuffledCards = shuffle(cardsArray);
    shuffledCards.forEach((cardValue) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${cardValue}</div>
                    <div class="card-back"></div>
                </div>`;
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    });
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!firstCard) {
      firstCard = this;
      startTimer();
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.innerText === secondCard.innerText;
    isMatch ? disableCards() : unflipCards();
    moves++;
    movesDisplay.textContent = moves;
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
    matchedPairs++;
    if (matchedPairs === cardsArray.length / 2) {
      endGame();
    }
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function startTimer() {
    if (!timer) {
      timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = formatTime(timeElapsed);
      }, 1000);
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  function endGame() {
    clearInterval(timer);
    congratsMessage.classList.remove("hidden");
    finalMovesDisplay.textContent = moves;
    finalTimeDisplay.textContent = formatTime(timeElapsed);
  }

  function resetGame() {
    gameBoard.innerHTML = "";
    congratsMessage.classList.add("hidden");
    moves = 0;
    timeElapsed = 0;
    matchedPairs = 0;
    timer = null;
    movesDisplay.textContent = moves;
    timerDisplay.textContent = "00:00";
    createBoard();
  }

  restartBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", resetGame);

  createBoard();
});
