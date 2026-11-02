function gameBoard() {
    let board = []
    
    for (let i = 0; i < 9; i++) {
        const newSquare = square(i)
        board.push(newSquare);
    }

    const getBoard = () => {
        return board
    }

    const displayBoard = () => {
        for (i = 0; i < 9; i += 3) {
            firstItem = i
            lastItem = firstItem + 3
            const row = board.slice(firstItem, lastItem);
        }
    }
    const placeOnBoard = (piece, selectedSquare) => {
        let square = board.find((s) => s.getContent() == selectedSquare)
        square.changeContent(piece);
    };
    const emptyBoardSquares = () => {
        return board.filter((square) => boardRange.includes(square.getContent()))
    }
    const checkBoardForWinner = () => {
        const isConsecutiveThree = (combo) => {
            if (combo.some(square => square.getContent() === null)) {
                return false
            } else {
                return combo.every((square) => square.getContent() === combo[0].getContent())
            }
        }
        const inARow = () => {
            for (i = 0; i < 9; i += 3) {
                const firstItem = i
                const lastItem = firstItem + 3
                const row = board.slice(firstItem, lastItem);
                if (isConsecutiveThree(row)) {
                    return true
                }
            }
        }

        const inAColumn = () => {
            for (i = 0; i < 3; i++) {
                const squares = [i, i + 3, i + 6]
                const column = board.filter((square, index) => {
                    if (squares.includes(index)) {
                        return square
                    }
                } );
                if (isConsecutiveThree(column)) {
                    return true
                }
            }
        }

        const inADiagonal = () => {
            for (i = 0; i < 3; i += 2) {
                const squares = i == 0 ? [i, i + 4, i + 8] : [i, i + 2, i + 4]
                const diagonal = board.filter((square, index) => {
                    if (squares.includes(index)) {
                        return square
                    }
                } );
                if (isConsecutiveThree(diagonal)) {
                    return true
                }
            }
        }
        if (inARow() || inAColumn() || inADiagonal()) {
            return true
        }
        return  null
    }
    const deleteBoard = () => {
        while (target.hasChildNodes()) {
            target.removeChild(target.firstChild);
        }
    };

    return {
        getBoard,
        displayBoard,
        emptyBoardSquares,
        placeOnBoard,
        checkBoardForWinner,
        deleteBoard
    };
}

function square(position) {
    let boardPosition = position
    let content = null;
    
    const getContent = () => content;
    const changeContent = (newContent) => {
        content = newContent
    }
    const isEmpty = () => {
        if (content === null) {
            return true
        }

        return false
    }

    return {
        getContent,
        changeContent,
        isEmpty
    }
}



function Player(name, piece) {
    this.name = name
    this.piece = piece
}

function Game(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {

    let winner = null;
    let playerTurn = null
    const board = gameBoard();
    let turn = 0;
    let gameFinished = false

    const players = [
        new Player(playerOneName, "X"),
        new Player(playerTwoName, "O")
    ];

    const turnIndicator = document.createElement("p");
    turnIndicator.classList.add("turn-indicator");

    
    const changeTurn = () => {
        turn += 1

        if ((turn % 2) === 0 ) {
            playerTurn = players[1]
        } else {
            playerTurn = players[0]
        }

        return playerTurn
    }

    const playTurn = (square) => {
        if (square) {
            placePiece(square)
        }
        
        if (turn > 3) {
            if (board.checkBoardForWinner()) {
                winner = playerTurn
                return endGame(winner)
            } else if (turn === 9 && winner == null) {
                return endGame()
            } else {
                changeTurn()
            }
        } else {
            changeTurn()
        }
    }

    const placePiece = (square) => {
        square.changeContent(playerTurn.piece);
    }

    const endGame = () => {
        return gameFinished = true;
    }

    const getGameFinished = () => gameFinished; 

    const getWinner = () => winner;

    const getBoard = () => board.getBoard();

    const getTurn = () => turn;

    const getPlayerTurn = () => playerTurn;

    return {
        getBoard,
        getTurn,
        getPlayerTurn,
        playTurn,
        getGameFinished,
        getWinner
    }

}

function ScreenController() {
    startGame()
    
    function startGame() {
        const game = Game()
        const board = game.getBoard()
        const gameUI = UI()
        

        game.playTurn()
        updateScreen(game, board, gameUI)

        return game
    }

    function UI() {
        const main = document.querySelector("main");
        main.replaceChildren();

        const gameContainer = createElement("section", "game-container");

        const gameInfo = createElement("div", "game-info");
        const gameBoardContainer = createElement("div", "game-board-container");
        
        gameContainer.append(gameInfo, gameBoardContainer);
        main.append(gameContainer);

        return {
            main,
            gameContainer,
            gameInfo,
            gameBoardContainer
        }

    }


    function updateScreen(game, board, gameUI) {
        const player = game.getPlayerTurn()

        gameUI.gameBoardContainer.replaceChildren()

        updateText(game, player, gameUI)

        const boardEl = updateBoardDisplay(game, board, gameUI)
        gameUI.gameBoardContainer.appendChild(boardEl)

        if (game.getGameFinished()) {
            createPlayAgainBtn(gameUI)
        }
    }

    function createPlayAgainBtn(gameUI) {
        const playAgainBtn = createElement("button", "play-button");
        playAgainBtn.addEventListener("click", () => {
            startGame()
        });
        playAgainBtn.textContent = "Play Again";
        gameUI.main.appendChild(playAgainBtn);
    }

    function updateBoardDisplay(game, board, gameUI) {
        const boardEl = document.createElement("div");
        boardEl.classList.add("game-board");

        updateSquaresDisplay(game, board, boardEl, gameUI);

        return boardEl
    }

    function updateSquaresDisplay(game, board, boardEl, gameUI) {
        for (let i = 0; i < board.length; i++) {
            const squareEl = document.createElement("div");
            squareEl.classList.add("square")
            if (board[i].isEmpty() && !game.getGameFinished()) {
                squareEl.classList.add("empty")
                squareEl.addEventListener("click", () => {
                    playTurn(game, board, board[i], gameUI);
                })
            } else {
                squareEl.classList.add("occupied")
                squareEl.textContent = board[i].getContent()
            }
            boardEl.appendChild(squareEl)
        }
    }

    function updateText(game, player, gameUI) {

        const finishedGame = () => {
            const playerIndicator = document.querySelector(".player-indicator");
            
            if (game.getWinner()) {
                playerIndicator.textContent = `${game.getWinner().name} WON!`
            } else {
                playerIndicator.textContent = "IT'S A TIE!"
            }
        }

        const ongoingGame = () => {
            gameUI.gameInfo.replaceChildren();

            const turnCount = document.createElement("p");
            turnCount.classList.add("turnCount");
            turnCount.textContent = `Turn #${game.getTurn()}`

            const playerIndicator = document.createElement("p");
            playerIndicator.classList.add("player-indicator");
            playerIndicator.textContent = `${player.name}'s turn! (${player.piece}'s)`

            gameUI.gameInfo.append(turnCount, playerIndicator);
        }

        if (game.getGameFinished()) {
            return finishedGame();
        } else {
            return ongoingGame();
        }
        
    }

    function playTurn(game, board, square, gameUI) {
        game.playTurn(square)
        updateScreen(game, board, gameUI)
    }
}

function gameInitializer() {
    const main = document.querySelector("main");
    const startScreen = createElement("div", "start-screen");
    main.append(startScreen)
    const playBtn = createElement("button", "play-button");
    playBtn.addEventListener("click", ScreenController);
    playBtn.textContent = "PLAY"
    startScreen.append(playBtn)
}

function createElement (type, elementClass) {
    element = document.createElement(`${type}`)
    element.classList.add(`${elementClass}`)
    return element
}

const newGame = gameInitializer()
