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

    undo() {
        // TODO
    }
}
