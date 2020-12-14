const PORT = 8082;

class MyPrologInterface {
    constructor() {
    }

    piecesToString(pieces) {
        let res = "[";
        for (let i = 0; i < pieces.length - 1; ++i) {
            res += "[";
            res += pieces[i].toString();
            res += "],";
        }

        if (pieces.length != 0) {
            res += "[";
            res += pieces[pieces.length - 1].toString();
            res += "]";
        }
        res += "]";

        return res;
    }

    getPrologRequest(requestString) {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://0.0.0.0:' + PORT + '/' + requestString, false);

        //request.onload = resolve;
        //request.onerror = reject;
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
        if (request.status === 200)
            return request.response;
        else
            throw (new Error('Error getting data'))
    }

    gameBoardToState(gameBoard) {
        let board = this.piecesToString(gameBoard.pieces);
        let player = gameBoard.currentPlayer;

        let result = this.getPrologRequest("getStateFromBoard(_," + board + "," + player + ")");
        return result;
    }

    getInitialBoard(length) {
        let result = eval(this.getPrologRequest("genInitBoard(" + (length + 1) + ")"));
        return result;
    }

    canMove(gameBoard, source, dest) {
        let state = this.gameBoardToState(gameBoard);
        let result = eval(this.getPrologRequest("isValidMove(" + state + "," + source + "," + dest + ")"));
        return result;
    }

    validMoves(gameBoard, source) {
        let state = this.gameBoardToState(gameBoard);
        let result = eval(this.getPrologRequest("validMoves(" + state + "," + source + ")"));
        return result;

    }
}
