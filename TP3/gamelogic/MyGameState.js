const state = {
    STARTED: 0,
    SPAWN_BOARD: 1,
    CAMERA_MOVING: 2,
    MOVING: 3,
    ANIMATING: 4,
    IDLE: 5,
    WAITING_FOR_TIMEOUT: 6,
    GAME_OVER: 7,
    END: 8,
}

const gamemode = {
    PvB: 1,
    PvP: 2,
    BvB: 3,
}

class MyGameState {
    constructor(firstPlayer, secondPlayer) {
        this.gameSettings = [firstPlayer, secondPlayer];
        this.currentPlayer = 0;
        this.state = state.STARTED;
        this.replaying = false;
        this.gameMode = gamemode.PvB;
    }

    reset() {
        this.currentPlayer = 0;
        this.state = state.STARTED;
        this.replaying = false;
    }

    updateAIDifficulty(val) {

        if (this.gameMode != gamemode.PvP)
            this.gameSettings[1] = val;

        if (this.gameMode == gamemode.BvB)  // for BvB
            this.gameSettings[0] = val;

    }

    updateGameMode(val) {
        if (this.state == state.STARTED || this.state == state.END || this.state == state.GAME_OVER) {
            this.gameMode = val;

            console.log(this.gamemode);
            // change game settings to default values when changing gamemode
            if (this.gameMode == gamemode.PvB) //PvB
                this.gameSettings = [0, 1];
            else if (this.gameMode == gamemode.PvP) //PvP
                this.gameSettings = [0, 0];
            else if (this.gameMode == gamemode.BvB) //BvB
                this.gameSettings = [1, 1];

        }
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

    setToCameraMoving() {this.state = state.CAMERA_MOVING}
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

    isWaitingForTimeout() {
        return this.state == state.WAITING_FOR_TIMEOUT;
    }

    canSelect() {
        console.log(this.state);
        return (this.state == state.IDLE || this.state == state.SPAWN_BOARD) && this.isPlayerTurn() && !this.isReplaying();
    }

    canIncreaseTime() {
        return (this.state == state.IDLE || this.state == state.SPAWN_BOARD) && this.isPlayerTurn();
    }

    gameHasEnded() {
        return this.state >= state.GAME_OVER;
    }
}
