const BOARD_SIZE = 3;
class MyGameOrchestrator {
    constructor(scene) {
        //this.gameSequence= new MyGameSequence(...);
        //this.animator= new MyAnimator(...);
        //this.theme= new MyScenegraph(...);
        this.scene = scene;
        this.prolog = new MyPrologInterface();
        this.prolog.getInitialBoard(BOARD_SIZE).then(response => {
            let initial_board = eval(response.target.response);
            this.board = new MyGameBoard(scene, 0, 0, 0, 0, initial_board);
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

    selectPiece(obj) {

        if (this.selectedPiece == null) {
            this.selectedPiece = obj;
            let coords = this.selectedPiece.getTile().getCoords();
            let movePromise = this.prolog.validMoves(this.board, coordToString(coords));
            movePromise.then((response) => {
                let coordList = eval(response.target.response);
                let pieceList = coordList.map((coord) => {return this.board.getPieceAt(coord[0], coord[1])});
                this.selectPiece.possiblePieces = this.board.selectPieces(pieceList);
            });
            this.selectedPiece.selected = true;
        }
        else { // Second piece selected
            let sourceTile = this.selectedPiece.getTile();
            let destTile = obj.getTile();
            var prev_coords = sourceTile.getCoords();
            var curr_coords = destTile.getCoords();
            let movePromise = this.prolog.canMove(this.board, coordToString(prev_coords), coordToString(curr_coords));

            movePromise.then((response) => {
                let canMove = eval(response.target.response);
                if (canMove)
                    this.board.switchPiece(sourceTile, destTile);
                else
                    console.log("nao");

                console.log(tilesToString(this.board.tiles));
                return this.prolog.isGameOver(this.board);
            }).then((response) => {
                let isGameOver = response.target.response;
                if (isGameOver == "false")
                    console.log("Still going")
                else
                    console.log(isGameOver);
            });

            this.board.deselectPieces(this.selectPiece.possiblePieces);
            this.selectPiece.possiblePieces = [];
            this.selectedPiece.selected = false;
            this.selectedPiece = null;
        }
    }

    //update(time) {this.animator.update(time);}

    display() {
        //this.theme.display();
        this.board.display();
        //this.animator.display();
    }
}
