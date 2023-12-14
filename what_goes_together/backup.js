document.addEventListener("DOMContentLoaded", function () {
    const columns = 5; // Declare columns here

    const cardPairs = [
        { card: "cow.jpeg", match: "grass.jpeg" },
        { card: "sun.jpeg", match: "flower.jpeg" },
        { card: "coffee.jpeg", match: "donut.jpeg" },
        { card: "moon.jpeg", match: "star.jpeg" },
        { card: "pen.jpeg", match: "pad.jpeg" },
        { card: "grass.jpeg", match: "cow.jpeg" },
        { card: "flower.jpeg", match: "sun.jpeg" },
        { card: "donut.jpeg", match: "coffee.jpeg" },
        { card: "star.jpeg", match: "moon.jpeg" },
        { card: "pad.jpeg", match: "pen.jpeg" }
    ];

    const shuffledCardPairs = shuffleArray(cardPairs);

    const gameContainer = document.getElementById("game-container");
    const timerElement = document.getElementById("timer");
    let seconds = 0;
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(function () {
            seconds++;
            updateTimer();
        }, 1000);
    }

    function updateTimer() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    startTimer();

    for (let i = 0; i < shuffledCardPairs.length; i += columns * 2) {
        for (let j = 0; j < columns; j++) {
            const cardRow = document.createElement("div");
            cardRow.className = "card-row";

            for (let k = 0; k < 2; k++) {
                const pair = shuffledCardPairs[i + j * 2 + k];

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

            gameContainer.appendChild(cardRow);
        }
    }

    let selectedCard = null;

    function onCardClick(event) {
        const clickedCard = event.currentTarget;
        const clickedIndex = parseInt(clickedCard.dataset.index);

        if (selectedCard === null) {
            selectedCard = { element: clickedCard, index: clickedIndex };
            clickedCard.style.backgroundColor = "#ddd";
        } else {
            const selectedPair = shuffledCardPairs[selectedCard.index];
            const clickedPair = shuffledCardPairs[clickedIndex];

            if (selectedPair.match === clickedPair.card && clickedIndex !== selectedCard.index) {
                console.log("Match found: " + selectedPair.card + " and " + clickedPair.card);
                displayMatchMessage(selectedPair.card, clickedPair.card);

                selectedCard.element.classList.add("matched");
                clickedCard.classList.add("matched");

                selectedCard.element.removeEventListener("click", onCardClick);
                clickedCard.removeEventListener("click", onCardClick);

                selectedCard = null;
            } else {
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
        matchMessage.textContent = `Match found: ${card1} and ${card2}`;

        document.body.appendChild(matchMessage);

        setTimeout(() => {
            matchMessage.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(matchMessage);
            }, 1000);
        }, 2000);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
