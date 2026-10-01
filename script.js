function gameBoard() {
    let board = []
    const boardRange = Array.from({ length: 10 }, (_, index) => index + 1)
    
    for (i = 0; i < 9; i++) {
        const newSquare = square(i)
        board.push(newSquare);
    }

    const getBoard = () => board;
    const displayBoard = () => {
        for (i = 0; i < 9; i += 3) {
            firstItem = i
            lastItem = firstItem + 3
            const row = board.slice(firstItem, lastItem);
            console.log(`${row[0].getContent()} | ${row[1].getContent()} | ${row[2].getContent()}`);
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
            return combo.every((square) => square.getContent() === combo[0].getContent())
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
    const resetBoard = () => board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return {
        getBoard,
        displayBoard,
        emptyBoardSquares,
        placeOnBoard,
        checkBoardForWinner,
        resetBoard
    };
}

function square(position) {
    let boardPosition = position
    let content = boardPosition + 1;
    
    const getContent = () => content;
    const changeContent = (newContent) => {
        content = newContent
    }

    return {
        getContent,
        changeContent
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
    let playerTurn = null;
    const board = gameBoard();
    let turn = 0;
    let gameFinished = false

    const players = [
        new Player(playerOneName, "X"),
        new Player(playerTwoName, "O")
    ];
    
    const changeTurn = () => {
        turn += 1
        console.log(`Turn ${turn}`);

        if ((turn % 2) === 0 ) {
            playerTurn = players[1]
        } else {
            playerTurn = players[0]
        }

        console.log(`${playerTurn.name}'s Move!`)

        return playerTurn
    }

    const choosePiecePlacement = (error) => {
        let emptySquares = board.emptyBoardSquares().map((square) => square.getContent())
        let selectedSquare = null

        if (error) {
            selectedSquare = prompt(`That's not a valid entry, please choose again ${playerTurn.name}! (${emptySquares})`);
        } else {
            selectedSquare = prompt(`${playerTurn.name}, please choose an empty space to place your piece! (${emptySquares})`);
        }

        if (emptySquares.find((emptySquare) => emptySquare == selectedSquare) !== undefined) {
            console.log(emptySquares.find((emptySquare) => emptySquare == selectedSquare))
            board.placeOnBoard(playerTurn.piece, selectedSquare)
        } else {
            choosePiecePlacement("error")
        }
    }

    const endGame = (winningPlayer) => {
        board.displayBoard();
        if (winningPlayer) {
            console.log(`Congrats ${winningPlayer.name}, YOU WIN!`)
        } else {
            console.log("It's a tie!")
        }
        return gameFinished = true;
    }

    while (gameFinished === false) {
        changeTurn();
        board.displayBoard();
        choosePiecePlacement();
        if (turn > 3) {
            if (board.checkBoardForWinner()) {
                winner = playerTurn
                endGame(winner)
            } else if (turn === 9 && winner == null) {
                endGame()
            }
        } 
    }

}

const game = Game();
