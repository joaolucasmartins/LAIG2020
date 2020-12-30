const state = {
    STARTED: 0,
    SPAWN_BOARD: 1,
    MOVING: 2,
    ANIMATING: 3,
    IDLE: 4,
    WAITING_FOR_TIMEOUT: 5,
    GAME_OVER: 6,
    END: 7,
}
class MyGameState {
    constructor(firstPlayer, secondPlayer) {
        this.gameSettings = [firstPlayer, secondPlayer];
        this.currentPlayer = 0;
        this.state = state.STARTED;
        this.replaying = false;
    }

    reset() {
        this.currentPlayer = 0;
        this.state = state.STARTED;
        this.replaying = false;
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

    setToMoving() {this.state = state.MOVING;}
    setToAnimating() {this.state = state.ANIMATING;}
    setToIdle() {this.state = state.IDLE;}
    setToTimeout() {this.state = state.WAITING_FOR_TIMEOUT;}
    setToSpawnBoard() {this.state = state.SPAWN_BOARD;}
    setToGameOver() {this.state = state.GAME_OVER}
    setToReplaying() {this.replaying = true}
    setToEnd() {this.state = state.END}

    hasStarted() {return this.state >= state.SPAWN_BOARD}

    canSpawnBoard() {return this.state != state.ANIMATING && this.state != state.MOVING}

    canMakeMove() {
        return this.state != state.MOVING && this.state != state.ANIMATING && this.state < state.GAME_OVER;
    }

    canMakeAIMove() {
        return (this.state == state.IDLE || this.state == this.SPAWN_BOARD) && this.isAITurn() && !this.replaying;
    }

    canReplay() {
        return this.state == state.GAME_OVER && !this.isReplaying();
    }

    isReplaying() {
        return this.replaying;
    }

    canUndo() {
        return !this.replaying && (this.state == state.WAITING_FOR_TIMEOUT || this.state == state.IDLE);
    }

    canSelect() {
        console.log(this.state);
        return (this.state == state.IDLE || this.state == state.SPAWN_BOARD) && this.isPlayerTurn() && !this.isReplaying();
    }

    gameHasEnded() {
        return this.state >= state.GAME_OVER;
    }
}
