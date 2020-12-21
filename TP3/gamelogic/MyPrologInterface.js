const PORT = 8082;

class MyPrologInterface {
    constructor() {
    }


    async getPrologRequest(requestString) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', 'http://0.0.0.0:' + PORT + '/' + requestString, true);

            request.onload = resolve;
            request.onerror = reject;
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send();
        });
    }

    // TODO Guardar isto all the time algures
    getGameStateFromBoard(gameBoard, gameState) {
        let board = tilesToString(gameBoard.tiles);
        let length = gameBoard.tiles.length;
        let player = gameState.currentPlayer;
        let settings = coordToString(gameState.gameSettings);
        console.log(settings);
        console.log(player);

        return "gameState(_," + length + "," + board + "," + player + ")";
    }

    getInitialBoard(length) {
        return this.getPrologRequest("genInitBoard(" + (length + 1) + ")");
        //let result = eval(this.getPrologRequest("genInitBoard(" + (length + 1) + ")"));
        //return result;
    }

    getAIMove(gameBoard, gameState) {
        let state = this.getGameStateFromBoard(gameBoard, gameState);
        let aiDifficulty = gameState.getCurrentAIDifficulty();

        return this.getPrologRequest("getAIMove(" + state + "," + aiDifficulty + ")");
    }

    canMove(gameBoard, gameState, source, dest) {
        let state = this.getGameStateFromBoard(gameBoard, gameState);
        //console.log("Req", "isValidMove(" + state + "," + source + "," + dest + ")");
        return this.getPrologRequest("isValidMove(" + state + "," + source + "," + dest + ")");
        //let result = eval(this.getPrologRequest("isValidMove(" + state + "," + source + "," + dest + ")"));
        //return result;
    }

    validMoves(gameBoard, gameState, source) {
        let state = this.getGameStateFromBoard(gameBoard, gameState);
        return this.getPrologRequest("validMoves(" + state + "," + source + ")");
    }

    isGameOver(gameBoard, gameState) {
        let state = this.getGameStateFromBoard(gameBoard, gameState);
        return this.getPrologRequest("isGameOver(" + state + ")");
    }
}
