let gameRunning = false; // Variable to track whether the game is running
let timerInterval;
let seconds = 0;
let score = 0;
let selectedCard = null;
let cardPairs;

let lock = "https://drive.google.com/uc?export=view&id=1Qn1NIC_IEnTYu8Iq7P1oAqc9nJc--cbr";
let ball = "https://drive.google.com/uc?export=view&id=1GQ4Yx7pfsnLvaAhXpW5NaKWSwob3DcHx";
let bat = "https://drive.google.com/uc?export=view&id=10FWIE0hrFE-RKMWmRQ7IT0l0zYAaC3jF";
let key = "https://drive.google.com/uc?export=view&id=1x_z04xnHgA6ZeVeQm3uVjjx9fFGLyxHd";
let cow = "https://drive.google.com/uc?export=view&id=1EgeBIoGfkEiPG86rQ7l9NNP_6SMmmK5r";
let umb = "https://drive.google.com/uc?export=view&id=1I-MU_otJfDrh6n4aNzBd7xJX2VEvqP5Y";
let rain = "https://drive.google.com/uc?export=view&id=1VRjLM82IlJa-MOcB61A3moeGxdLUrKve";
let sun = "https://drive.google.com/uc?export=view&id=1q2J8bvYIbBYXiXTrZWAGvvFlsbsdz7wH";
let star = "https://drive.google.com/uc?export=view&id=167XlfSpCziDs4M8qsxW2RuKt2Rx73JB_";
let pen = "https://drive.google.com/uc?export=view&id=1tHZsSLedPWMyq9m-kkkmDjKVlgIKTYq5";
let moon = "https://drive.google.com/uc?export=view&id=1UJdLAWhWHsbHFQpGegCd1BEkPu2yEWqm";
let pad = "https://drive.google.com/uc?export=view&id=1lj50krlTmoBRrS78yXp7J0zI-k8Uarx7";
let coffee = "https://drive.google.com/uc?export=view&id=1tKi6zknDOqO3t5vK6jFX21Pxo1kNcIN4";
let flower = "https://drive.google.com/uc?export=view&id=1LjTSSUBkszoYa4IXeoxBCvk8Hkjm8y0_";
let donut = "https://drive.google.com/uc?export=view&id=1kNR7cAIj7Zb2x2X0DBji6efCzFAUyAnI";
let grass = "https://drive.google.com/uc?export=view&id=1S9Ta6wYguOEUbkbAzdQFjkD-bzOQQa41";

const cardPairs1 = [
    { card: cow, match: grass },
    { card: sun, match: flower },
    { card: coffee, match: donut },
    { card: grass, match: cow },
    { card: flower, match: sun },
    { card: donut, match: coffee },
];

const cardPairs2 = [
    { card: moon, match: star },
    { card: pen, match: pad },
    { card: star, match: moon },
    { card: pad, match: pen },
    { card: key, match: lock },
    { card: bat, match: ball },
    { card: umb, match: rain },
    { card: lock, match: key },
    { card: ball, match: bat },
    { card: rain, match: umb }
];

const cardPairs3 = [
    { card: cow, match: grass },
    { card: sun, match: flower },
    { card: coffee, match: donut },
    { card: moon, match: star },
    { card: pen, match: pad },
    { card: grass, match: cow },
    { card: flower, match: sun },
    { card: donut, match: coffee },
    { card: star, match: moon },
    { card: pad, match: pen },
    { card: key, match: lock },
    { card: bat, match: ball },
    { card: umb, match: rain },
    { card: lock, match: key },
    { card: ball, match: bat },
    { card: rain, match: umb }
];

function closeCustomAlert() {
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    customAlertOverlay.style.display = 'none';

    // Reset and start a new game with the next difficulty level
    if (cardPairs === cardPairs1) {
        resetAndStartNewGame('medium');
    } else if (cardPairs === cardPairs2) {
        resetAndStartNewGame('hard');
    }
}

const music = document.getElementById("clickSound");
const flip = document.getElementById("flipSound");
const winner = document.getElementById("winner");

function playClickSound() {
    music.currentTime = 0; // Reset audio to the beginning
    music.play();
}
function playFlipSound() {
    flip.currentTime = 0; // Reset audio to the beginning
    flip.play();
}
function playWinnerSound() {
    winner.currentTime = 0; // Reset audio to the beginning
    winner.play();
}
document.addEventListener("DOMContentLoaded", function () {
    const columns = 5;
    const gameContainer = document.getElementById("game-container");
    const timerElement = document.getElementById("timer");
    const scoreElement = document.getElementById("score");
    const stopButton = document.getElementById("stopButton");
    const backButton = document.getElementById("backButton");
    const startButton = document.querySelector('.difficulty-button');
    window.resetAndStartNewGame = resetAndStartNewGame;


    function resetAndStartNewGame(difficulty) {
        stopGame(); // Stop the current game if running

        // Reset game variables
        gameRunning = false;
        seconds = 0;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        timerElement.textContent = "Timer: 0:00";

        // Start a new game with the specified difficulty
        startGame(difficulty);
    }

    function startGame(difficulty) {
        startButton.style.display = "none";
        stopButton.style.display = "inline-block";
        backButton.style.display = "none";
        if (!gameRunning) {
            gameRunning = true;
            seconds = 0;
            score = 0;
            scoreElement.textContent = `Score: ${score}`;
            gameContainer.innerHTML = ''; // Clear the game container
            selectedCard = null; // Reset selected card

            switch (difficulty) {
                case 'easy':
                    cardPairs = cardPairs1;
                    break;
                case 'medium':
                    cardPairs = cardPairs2;
                    break;
                case 'hard':
                default:
                    cardPairs = cardPairs3;
                    break;
            }

            const shuffledCardPairs = shuffleArray(cardPairs);

            for (let i = 0; i < shuffledCardPairs.length; i += columns * 2) {
                for (let j = 0; j < columns; j++) {
                    const cardRow = document.createElement("div");
                    cardRow.className = "card-row";

                    for (let k = 0; k < 2; k++) {
                        const pair = shuffledCardPairs[i + j * 2 + k];

                        // Add a check for undefined pair
                        if (pair) {
                            const cardElement = document.createElement("div");
                            cardElement.className = "card";
                            cardElement.dataset.index = i + j * 2 + k;

                            const imgElement = document.createElement("img");
                            imgElement.src = pair.card;
                            imgElement.alt = pair.match;
                            cardElement.appendChild(imgElement);

                            cardElement.addEventListener("click", onCardClick);
                            cardRow.appendChild(cardElement);
                        }
                    }
                    gameContainer.appendChild(cardRow);
                }
            }
            // Move startTimer() here after the game setup is complete
            startTimer();
        }
    }

    function stopGame() {
        playClickSound();
        gameRunning = false;
        stopTimer();
        clearGameContainer();

        // Show the backButton
        backButton.style.display = "inline-block";
        stopButton.style.display = "none";
        startButton.style.display = "inline-block";
    }

    function clearGameContainer() {
        gameContainer.innerHTML = ''; // Clear the game container
        timerElement.textContent = "";
        scoreElement.textContent = "";
    }

    function startTimer() {
        seconds = 0;  // Reset seconds to zero
        timerInterval = setInterval(function () {
            seconds++;
            updateTimer();
        }, 1000);
    }


    function updateTimer() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerElement.textContent = `Timer:${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function onCardClick(event) {
        const clickedCard = event.currentTarget;
        const clickedIndex = parseInt(clickedCard.dataset.index);
        playFlipSound();

        if (selectedCard === null) {
            selectedCard = { element: clickedCard, index: clickedIndex };
            clickedCard.style.backgroundColor = "#ddd";
        } else {
            playFlipSound();
            const selectedPair = cardPairs[selectedCard.index];
            const clickedPair = cardPairs[clickedIndex];

            if (selectedPair.match === clickedPair.card && clickedIndex !== selectedCard.index) {
                console.log("Match found: " + selectedPair.card + " and " + clickedPair.card);
                displayMatchMessage(selectedPair.card, clickedPair.card);

                selectedCard.element.classList.add("matched");
                clickedCard.classList.add("matched");

                selectedCard.element.removeEventListener("click", onCardClick);
                clickedCard.removeEventListener("click", onCardClick);

                score += 10;
                scoreElement.textContent = `Score: ${score}`;

                selectedCard = null;

                // Check if all cards are matched
                const matchedCards = document.querySelectorAll('.matched');
                if (score == cardPairs.length * 5) {

                    stopTimer();
                    showGameCompletionMessage();
                }
            } else {
                console.log("Oops! Incorrect match: " + selectedPair.card + " and " + clickedPair.card);
                displayWrongMatchMessage(selectedPair.card, clickedPair.card);

                setTimeout(() => {
                    selectedCard.element.style.backgroundColor = "";
                    clickedCard.style.backgroundColor = "";
                    selectedCard = null;
                }, 1000);
            }
        }
    }

    function displayMatchMessage(card1, card2) {
        const matchMessage = document.createElement("div");
        matchMessage.className = "match-message";
        matchMessage.textContent = `+10 points!`;
        document.body.appendChild(matchMessage);

        setTimeout(() => {
            matchMessage.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(matchMessage);
            }, 200);
        }, 500);
    }

    function displayWrongMatchMessage() {
        const matchMessage = document.createElement("div");
        matchMessage.className = "match-message";
        matchMessage.textContent = `Oops! Incorrect match. Try again!`;

        document.body.appendChild(matchMessage);
        matchMessage.style.backgroundColor = "lightcoral";

        setTimeout(() => {
            matchMessage.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(matchMessage);
            }, 200);
        }, 500);
    }

    function showGameCompletionMessage() {
        const allCards = document.querySelectorAll('.card');
        const matchedCards = document.querySelectorAll('.matched');

        if (allCards.length === matchedCards.length) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            const customAlertOverlay = document.getElementById('custom-alert-overlay');
            const customAlertMessage = document.getElementById('custom-alert-message');

            const totalTimeContent = `<span style="color: blue;"><br>Your score is ${score} points.<br>Total time: ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}</span>`;
            const messageContent = `Congratulations!<br><br>You have completed the game!<br><br>${totalTimeContent}`;

            // Use innerHTML to interpret HTML tags
            customAlertMessage.innerHTML = messageContent;

            customAlertOverlay.style.display = 'flex';
            playWinnerSound();
        }


    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Expose functions to the global scope for button click events
    window.startGame = startGame;
    window.stopGame = stopGame;
});
