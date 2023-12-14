const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const levelText = document.querySelector(".level-text");
const funFacts = [
  "Did you know? Koalas sleep for about 20 hours a day!",
  "Lions are the only cats that live in groups.",
  "Foxes are known for their intelligence and cunning.",
  "Elephants are the only animals that can't jump.",
  "Giraffes only need 5 to 30 minutes of sleep in a 24-hour period.",
  "Cats can jump up to six times their length.",
  "Cheetahs can accelerate from 0 to 60 mph in just a few seconds."
];

let cards;
let interval;
let firstCard = false;
let secondCard = false;
let currentLevel = "easy";
let nextLevel = null;

function updateLevelText(level) {
  // Set the level text based on the current level
  switch (level) {
      case "easy":
          levelText.innerText = "Easy Level";
          break;
      case "medium":
          levelText.innerText = "Medium Level";
          break;
      case "hard":
          levelText.innerText = "Hard Level";
          break;
      default:
          levelText.innerText = "";
          break;
  }
}

// Call this function to show the modal alert
function showModalAlert(nextLevel) {
  const modal = document.getElementById("custom-alert");
  const modalContent = document.getElementById("modal-content");
  const music = document.getElementById("backgroundMusic");
  const testFact = document.getElementById("test-fact"); // Reference to the test fact element

  // Create a container for the fun facts
  const funFactsContainer = document.createElement("div");
  funFactsContainer.classList.add("fun-facts-container");

  if (!music.paused) {
    music.pause();
  }

  // Play the "winner.mp3" song
  const winnerSound = document.getElementById("winner");
  winnerSound.play();

  // Display the modal
  modal.style.display = "block";

  // Display the game stats in the modal content
  modalContent.innerHTML = `<br>Time: ${minutes}:${seconds}<br>Moves: ${movesCount}`;

  // Set the test fun fact
  testFact.innerText = "Absolutely amazing! \n Fun Facts:";

  // Choose a random fun fact
  const randomFactIndex = Math.floor(Math.random() * funFacts.length);
  const randomFact = funFacts[randomFactIndex];

  // Create a div for the random fun fact
  const factBox = document.createElement("div");
  factBox.classList.add("fun-fact-box");
  factBox.innerText = randomFact;

  funFactsContainer.appendChild(testFact); // Append the test fact
  funFactsContainer.appendChild(factBox); // Append the random fun fact

  // Append the fun facts container to the modal content
  modalContent.appendChild(funFactsContainer);

  // Close the modal when clicking the close (X) button
  const closeBtn = document.querySelector(".close");
  closeBtn.onclick = function () {
    modal.style.display = "none";
    winnerSound.pause();
    music.play();

    // If next level is provided, start the game for the next level
    if (nextLevel) {
      initializeGame(nextLevel);
      currentLevel = nextLevel;
    }
  };

  // Close the modal when clicking anywhere outside the modal content
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      winnerSound.pause();
      music.play();
    }
  };
}


// Define levels with corresponding card counts
const levels = {
  easy: { cardCount: 12 },
  medium: { cardCount: 20 },
  hard: { cardCount: 28 },
};
// Items array
const items = [
  { name: "koala", image: "https://drive.google.com/uc?export=view&id=13qRpYEDPBrIwKBmINK8plClMp58SIXYC" },
  { name: "lion", image: "https://drive.google.com/uc?export=view&id=1aK2sLOPmbgTH_vQmA3sgitTBg4LiRpwM" },
  { name: "fox", image: "https://drive.google.com/uc?export=view&id=1MAS-1zlTUi_7boy2-uBAe-s54VGxB_8G" },
  { name: "cat", image: "https://drive.google.com/uc?export=view&id=1KpeleKh_2Cr3DP4K_ozbb5_qRJABIrET" },
  { name: "rab", image: "https://drive.google.com/uc?export=view&id=1gCcWQeC7V1SdxFf0VMQaNHSxCmfUr9Tu" },
  { name: "hen", image: "https://drive.google.com/uc?export=view&id=1FmjEk0KdFsKTidMSYsI0f9lgMndhYbl8" },
  { name: "dol", image: "https://drive.google.com/uc?export=view&id=14ewLM6JMwSq815SwdNL0wftAuANdRNCY" },
  { name: "crab", image: "https://drive.google.com/uc?export=view&id=1FZ_PMUDBLXiA17JAuLCF3a31Xklq7Qvb" },
  { name: "ele", image: "https://drive.google.com/uc?export=view&id=144XLbxsVCRvNryy-6Y5RsYNZUmCBzYxH" },
  { name: "dog", image: "https://drive.google.com/uc?export=view&id=1x4JAObRjn6vRC2GineFbqeFTYuD8-iXG" },
  { name: "panda", image: "https://drive.google.com/uc?export=view&id=156oO6y22kyTcs4gqBK3fuD8VOZoJQpix" },
  { name: "horse", image: "https://drive.google.com/uc?export=view&id=1pj-WxcarAUH93nJ31X72xYHgdp_uglqq" },
  { name: "tiger", image: "https://drive.google.com/uc?export=view&id=1VgNTtbbaS06edvKPLYQQHsWT4MKYiuX8" },
  { name: "pen", image: "https://drive.google.com/uc?export=view&id=1oE7fh1tTaxLYYR0yPBqvjnQqKYtNWsIY" }
];

// Initial Time
let seconds = 0,
  minutes = 0;
// Initial moves and win count
let movesCount = 0,
  winCount = 0;

// For timer
const timeGenerator = () => {
  seconds += 1;
  // Minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  // Format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Pick random objects from the items array
const generateRandom = (cardCount) => {
  // Temporary array
  let tempArray = [...items];
  // Initializes cardValues array
  let cardValues = [];
  // Random object selection
  for (let i = 0; i < cardCount / 2; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // Push two identical cards
    cardValues.push(tempArray[randomIndex]);
    // Once selected, remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  // Shuffle the card values
  cardValues.sort(() => Math.random() - 0.5);
  return cardValues;
};

function stopGame(nextLevel) {
  if (nextLevel === null) {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    levelText.classList.add("hide");
    clearInterval(interval);

    // Reset all matched cards to their default state
    cards.forEach(card => {
      if (card.classList.contains("matched")) {
        card.classList.remove("matched");
        card.classList.remove("flipped");
      }
    });

    // Reset game state variables
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    winCount = 0;
    firstCard = false;
    secondCard = false;
    result.innerText = "";

    // Reset moves and time display
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    timeValue.innerHTML = "<span>Time:</span>00:00";
  } else {
    clearInterval(interval);
    // Reset all matched cards to their default state
    cards.forEach((card) => {
      if (card.classList.contains("matched")) {
        card.classList.remove("matched");
        card.classList.remove("flipped");
      }
    });

    // Reset game state variables
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    winCount = 0;
    firstCard = false;
    secondCard = false;
    result.innerText = "";

    // Reset moves and time display
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    timeValue.innerHTML = "<span>Time:</span>00:00";


  }
}


const matrixGenerator = (cardValues) => {
  gameContainer.innerHTML = "";
  const cols = 4; // Fixed number of columns
  const rows = Math.ceil(cardValues.length / cols); // Calculate the number of rows
  const successSound = document.getElementById('successSound');

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j;
      if (index < cardValues.length) {
        // Create Cards
        gameContainer.innerHTML += `
          <div class="card-container" data-card-value="${cardValues[index].name}">
            <div class="card-before">?</div>
            <div class="card-after">
              <img src="${cardValues[index].image}" class="image"/>
            </div>
          </div>
        `;
      }
    }
  }

  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  gameContainer.style.gridTemplateRows = `repeat(${rows}, auto)`;

  // Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            successSound.currentTime = 0;
            successSound.play();
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            // Check for win condition
            console.log("Succesfully completed");
            // Inside your win condition check:
            if (winCount === Math.floor(cardValues.length / 2)) {
              showModalAlert(nextLevel);
              stopGame(nextLevel);
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

function initializeGame(level) {
  // Reset the game state
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  winCount = 0;
  firstCard = false;
  secondCard = false;
  updateLevelText(level);

  // Clear the previous interval (if any)
  clearInterval(interval);

  // Start timer
  interval = setInterval(timeGenerator, 1000);

  // Hide the result message
  result.innerText = "";

  // Generate card values based on the selected level
  const { cardCount } = levels[level];
  const cardValues = generateRandom(cardCount);

  // Generate the game matrix with a fixed number of columns (4) and calculated rows
  matrixGenerator(cardValues);

  // Check the current level and set the next level accordingly
  if (level === "easy") {
    nextLevel = "medium";
  } else if (level === "medium") {
    nextLevel = "hard";
  } else {
    // If the current level is hard, return to the main menu
    nextLevel = null;
  }

  // Update the win condition check inside the matrixGenerator function
  if (winCount === Math.floor(cardValues.length / 2)) {
    showModalAlert(nextLevel);
    stopGame(nextLevel);
  }
}


// Start the game initially with the default level (easy)
initializeGame("easy");

// Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  // Controls and buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");

  // Initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializeGame("easy");
});

// Stop game
stopButton.addEventListener("click", () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);

  // Reset all matched cards to their default state
  cards.forEach(card => {
    if (card.classList.contains("matched")) {
      card.classList.remove("matched");
      card.classList.remove("flipped");
    }
  });

  // Reset game state variables
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  winCount = 0;
  firstCard = false;
  secondCard = false;
  result.innerText = "";

  // Reset moves and time display
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  timeValue.innerHTML = "<span>Time:</span>00:00";
});

document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const clickSound = document.getElementById('clickSound');
  const flipSound = document.getElementById('flipSound');
  const backButton = document.getElementById("back");

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('matched')) {
        // Play flip sound when a card is clicked
        flipSound.currentTime = 0;
        flipSound.play();
      }
    });
  });

  function playClickSound() {
    clickSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
    clickSound.play();
  }
  backButton.addEventListener("click", function () {
    playClickSound();
    setTimeout(function () {
      window.location.href = "http://127.0.0.1:5500/main.html";
    }, 400);
  });

  startButton.addEventListener('click', function () {
    playClickSound();
    // Additional code for starting the game
  });

  stopButton.addEventListener('click', function () {
    playClickSound();
    // Additional code for stopping the game
  });

});
