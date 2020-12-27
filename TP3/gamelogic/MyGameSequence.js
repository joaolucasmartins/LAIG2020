class MyGameSequence {
    constructor() {
        this.gameMoves = [];
    }

    addGameMove(gameMove) {
        this.gameMoves.push(gameMove);
    }

    getLastGameMove() {
        return this.gameMoves[this.gameMoves.length - 1];
    }

    popLastMove() {
        if (this.gameMoves.length == 0)
            return;

        let res = this.gameMoves[this.gameMoves.length - 1];
        this.gameMoves.pop();
        return res;
    }

    undo(currentBoard, gameState) {
        console.log(this.gameMoves)
        let lastMove = this.popLastMove();
        if (!lastMove)
            return;


        let sourceTile = lastMove.getDestTile();
        let destTile = lastMove.getSourceTile();
        currentBoard.switchPiece(sourceTile, destTile); // Inverted switch to go backwards

        gameState.currentPlayer = lastMove.player;
    }
}
