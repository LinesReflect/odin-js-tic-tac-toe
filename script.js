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

    const endGame = (winningPlayer) => {
        if (winningPlayer) {
            console.log(`Congrats ${winningPlayer.name}, YOU WIN!`)
        } else {
            console.log("It's a tie!")
        }
        return gameFinished = true;
    }

    const getWinner = () => winner;

    const getBoard = () => {
        return board.getBoard()
    }

    const getTurn = () => {
        return turn
    }

    const getPlayerTurn = () => {
        return playerTurn
    }

    return {
        getBoard,
        getTurn,
        getPlayerTurn,
        playTurn
    }

}

function ScreenController() {
    const game = Game()
    const board = game.getBoard()
    const gameUI = createGameUI()

    function createGameUI() {
        const main = document.querySelector("main");
        const startScreen = document.querySelector(".start-screen");
        const playBtn = createElement("button", "play-button");
        playBtn.addEventListener("click", () => {
            main.replaceChildren(gameContainer);
            game.playTurn()
            updateScreen()
        })
        playBtn.textContent = "PLAY"
        startScreen.append(playBtn)
        
        const gameContainer = createElement("section", "game-container");

        const gameInfo = createElement("div", "game-info");
        const gameBoardContainer = createElement("div", "game-board-container");
        
        gameContainer.append(gameInfo, gameBoardContainer);

        return {
            main,
            gameContainer,
            gameInfo,
            gameBoardContainer
        }

    }


    const updateScreen = () => {
        player = game.getPlayerTurn()

        gameUI.gameBoardContainer.replaceChildren()

        updateText(player)

        const boardEl = updateBoardDisplay()
        gameUI.gameBoardContainer.appendChild(boardEl)
    }

    const updateBoardDisplay = () => {
        const boardEl = document.createElement("div");
        boardEl.classList.add("game-board");

        updateSquaresDisplay(boardEl);

        return boardEl
    }

    const updateSquaresDisplay = (boardEl) => {
        for (let i = 0; i < board.length; i++) {
            const squareEl = document.createElement("div");
            squareEl.classList.add("square")
            if (board[i].isEmpty()) {
                squareEl.classList.add("empty")
                squareEl.addEventListener("click", () => {
                    playTurn(board[i]);
                })
            } else {
                squareEl.classList.add("occupied")
                squareEl.textContent = board[i].getContent()
            }
            boardEl.appendChild(squareEl)
        }
    }

    const updateText = (player) => {
        gameUI.gameInfo.replaceChildren();

        const turnCount = document.createElement("p");
        turnCount.textContent = `Turn #${game.getTurn()}`

        const playerIndicator = document.createElement("p");
        playerIndicator.textContent = `${player.name}'s turn! (${player.piece}'s)`

        gameUI.gameInfo.append(turnCount, playerIndicator);
    }

    const playTurn = (square) => {
        game.playTurn(square)
        updateScreen()
    }

    function createElement (type, elementClass) {
        element = document.createElement(`${type}`)
        element.classList.add(`${elementClass}`)
        return element
    }

}

const newGame = ScreenController()
