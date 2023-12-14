// Array to track active game difficulties
let activeDifficulties = [];

// Function to start the game for each difficulty level
function startGame(difficulty) {
    // Check if the difficulty is already active
    if (activeDifficulties.includes(difficulty)) {
        console.log('Game is already running for difficulty: ' + difficulty);
        return;
    }

    // Set the URL based on the difficulty level
    let gameUrl;
    switch (difficulty) {
        case 'easy':
            gameUrl = 'spot-the-difference-easy/index.html'; // Replace with your easy game URL
            break;
        case 'medium':
            gameUrl = 'spot-the-difference-medium/index.html'; // Replace with your medium game URL
            break;
        case 'hard':
            gameUrl = 'spot-the-difference hard/index.html'; // Replace with your hard game URL
            break;
        default:
            console.error('Invalid difficulty level');
            return;
    }

    // Open the game link in a new tab
    const gameWindow = window.open(gameUrl, '_blank');

    // Add the difficulty to the active list
    activeDifficulties.push(difficulty);

    // Set up an event listener to detect if the game window is closed
    if (gameWindow) {
        gameWindow.addEventListener('beforeunload', function () {
            stopGame(difficulty);
        });
    }
}

// Function to stop the game and remove from active list
function stopGame(difficulty) {
    const index = activeDifficulties.indexOf(difficulty);
    if (index !== -1) {
        console.log('Game stopped for difficulty: ' + difficulty);
        activeDifficulties.splice(index, 1);
    }

    // Additional logic to stop the game if needed
}

// Event listener for Easy button
document.getElementById('easyButton').addEventListener('click', function() {
    console.log('Easy difficulty selected');
    startGame('easy');
});

// Event listener for Medium button
document.getElementById('mediumButton').addEventListener('click', function() {
    console.log('Medium difficulty selected');
    startGame('medium');
});

// Event listener for Hard button
document.getElementById('hardButton').addEventListener('click', function() {
    console.log('Hard difficulty selected');
    startGame('hard');
});

// Event listener for Stop Game button
document.getElementById('stopButton').addEventListener('click', function() {
    // Stop all active games
    activeDifficulties.forEach(function (difficulty) {
        stopGame(difficulty);
    });
});
