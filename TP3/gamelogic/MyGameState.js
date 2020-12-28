class MyGameState {
    constructor(firstPlayer, secondPlayer) {
        this.gameSettings = [firstPlayer, secondPlayer];
        this.currentPlayer = 0;
    }

    reset() {
        this.currentPlayer = 0;
    }
    
    isPlayerTurn() {
        return this.gameSettings[this.currentPlayer] == 0;
    }

    isAITurn() {
        return this.gameSettings[this.currentPlayer] > 0;
    }

    getCurrentAIDifficulty() {
        if (!this.isAITurn())
            return false;
        return this.gameSettings[this.currentPlayer];
    }

    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
    }
}
