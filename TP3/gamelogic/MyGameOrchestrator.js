const BOARD_SIZE = 3;
class MyGameOrchestrator {
    constructor(scene) {
        //this.gameSequence= new MyGameSequence(...);
        //this.animator= new MyAnimator(...);
        this.theme = new MySceneGraph("demo.xml", scene);
        this.scene = scene;
        this.prolog = new MyPrologInterface();

        // 0 - Player, 1 - AI
        let firstPlayer = 0;
        let secondPlayer = 1;
        this.gameState = new MyGameState(firstPlayer, secondPlayer);

        this.prolog.getInitialBoard(BOARD_SIZE).then(response => {
            let initial_board = eval(response.target.response);
            this.board = new MyGameBoard(scene, 0, 0, 0, 0, initial_board);

            if (this.gameState.isAITurn())
                this.makeAIMove();
        });
    }

    managePick(mode, results) {
        if (mode == false) {
            if (results != null && results.length > 0) {
                for (let i = 0; i < results.length; ++i) {
                    let obj = results[i][0];
                    if (obj) {
                        var uniqueId = results[i][1];
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                results.splice(0, results.length);
            }
        }
    }

    onObjectSelected(obj, id) {
        if (obj instanceof MyPiece) {
            console.log("selected", obj.getTile().getCoords());
            this.selectPiece(obj);
        }
    }

    selectPossiblePieces(coords) {
        let movePromise = this.prolog.validMoves(this.board, this.gameState, coordToString(coords));
        movePromise.then((response) => {
            let coordList = eval(response.target.response);
            let pieceList = coordList.map((coord) => {return this.board.getPieceAt(coord[0], coord[1])});
            this.selectPiece.possiblePieces = this.board.selectPieces(pieceList);
        });
    }

    makeAIMove() {
        let movePromise = this.prolog.getAIMove(this.board, this.gameState);
        movePromise.then((response) => {
            let move = eval(response.target.response);
            let sourceTile = this.board.getTileAt(...move[0])
            let destTile = this.board.getTileAt(...move[1])
            this.makeMove(sourceTile, destTile);
        })

    }

    makeMove(sourceTile, destTile) {
        let prev_coords = sourceTile.getCoords();
        let curr_coords = destTile.getCoords();
        let movePromise = this.prolog.canMove(this.board, this.gameState, coordToString(prev_coords), coordToString(curr_coords));

        movePromise.then((response) => {
            let canMove = eval(response.target.response);
            if (canMove) {
                this.board.switchPiece(sourceTile, destTile);

                this.gameState.nextPlayer();
            }
            else
                console.log("nao");

            console.log(tilesToString(this.board.tiles));
            return this.prolog.isGameOver(this.board, this.gameState);
        }).then((response) => {
            let isGameOver = response.target.response;
            if (isGameOver == "false") {
                console.log("Still going")
                if (this.gameState.isAITurn())
                    this.makeAIMove();
            }
            else
                console.log("Winner is " + isGameOver);
        });
    }

    selectPiece(obj) {

        if (this.gameState.isPlayerTurn()) {
            if (this.selectedPiece == null) {
                this.selectedPiece = obj;
                this.selectedPiece.selected = true;
                let coords = this.selectedPiece.getTile().getCoords();
                this.selectPossiblePieces(coords);
            }
            else { // Second piece selected
                let sourceTile = this.selectedPiece.getTile();
                let destTile = obj.getTile();
                this.makeMove(sourceTile, destTile);

                this.board.deselectPieces(this.selectPiece.possiblePieces);
                this.selectPiece.possiblePieces = [];
                this.selectedPiece.selected = false;
                this.selectedPiece = null;
            }
        }
    }

    //update(time) {this.animator.update(time);}

    display() {
        this.theme.display();
        if (this.board)
            this.board.display();
        //this.animator.display();
    }

    update(time) {}
}
