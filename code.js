/* Gameboard object */
  
const gameBoard = (function() {
    const board = ["","","","","","","","",""];

    return {
        getBoard: function() {return board},
        setCell: function(index,marker) {
            if (board[index] === "") {
                board[index] = marker;
        }},  
        reset: function() {
            for (let i=0; i<board.length;i++) {
                board[i] = "";
            }
        }
    };
})();


/* Player object */

const player = (name, marker) => {
    return {
        name,
        marker
    };
};

function getSelectedMarker(playerNumber) {
    const radios = document.getElementsByName(`marker-${playerNumber}`);

    for (let radio of radios) {
        if (radio.checked) return radio.value;
    }
    return null;
}

/* Gameplay Object*/
let players = []
let activePlayer;

const gamePlay = (function() {
    const playRound = function(index) {
        gameBoard.setCell(index, activePlayer.marker);
        const winner = checkWinner();

        if (winner) {
            if (winner === "Tie") {
                displayController.showMessage("Its a Tie!");
            } else {
                displayController.showMessage(`${activePlayer.name} wins!`);
            }
            return;
        }
        switchPlayer();
    };

    const switchPlayer = function(){
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0]
    };

    const checkWinner = function() {
        const winningCombinations = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2, 4,6]
        ];

        const board = gameBoard.getBoard();

        for (let combo of winningCombinations) {
            const [a,b,c] = combo;
            
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }};

        if (board.every(cell => cell !== "")) {
            return "Tie";};

        return null;
    };

    return {
        playRound,
        checkWinner
    };

})();

const displayController = (function() {
    const render = function() {
        const board = gameBoard.getBoard();
        const cells = document.querySelectorAll(".cell");

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };
    const init = function() {
        const cells = document.querySelectorAll(".cell");

        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => {
                gamePlay.playRound(index);
                render();
            });
        });
    };

    const showMessage = function(msg) {
        const messageDiv = document.getElementById("message");
        messageDiv.textContent = msg;
    };

    return {render, init, showMessage};
})();

window.addEventListener("DOMContentLoaded", () => {
    displayController.init();
    displayController.render();
});


const startGame = document.getElementById("start-game-btn");
const playerInfo = document.getElementById("player-setup");
const boardContainer = document.getElementById("board-container");

startGame.addEventListener("click", () => {
    const p1Marker = getSelectedMarker(1);
    const p2Marker = p1Marker === "X" ? "O" : "X";

    players = [
        player("Player 1", p1Marker),
        player("Player 2", p2Marker)
    ];

    activePlayer =players[0];

    boardContainer.style.display = "block";
    playerInfo.style.display = "none";

    displayController.render();
})

const reset = document.getElementById("reset");

reset.addEventListener("click", () => {
    gameBoard.reset()
    displayController.render();
    displayController.showMessage("");

    boardContainer.style.display = "none";
    playerInfo.style.display = "block";
})