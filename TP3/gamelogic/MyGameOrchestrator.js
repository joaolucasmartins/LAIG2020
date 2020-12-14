const BOARD_SIZE = 3;
class MyGameOrchestrator {
    constructor(scene) {
        //this.gameSequence= new MyGameSequence(...);
        //this.animator= new MyAnimator(...);
        //this.theme= new MyScenegraph(...);
        this.scene = scene;
        this.prolog = new MyPrologInterface();
        let initial_board = this.prolog.getInitialBoard(BOARD_SIZE);
        this.board = new MyGameBoard(scene, 0, 0, 0, 0, initial_board);
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
        if (obj instanceof MyTile) {
            console.log("selected", obj.getCoords());
            this.selectTile(obj);
        }
    }

    // TODO Move this to utils class along with gameState to String
    coordToString(coord) {
        return "[" + coord.join(",") + "]";
    }

    selectTile(obj) {
        if (this.selectedTile == null)
            this.selectedTile = obj;
        else { // Second piece selected
            var prev_coords = this.selectedTile.getCoords();
            var curr_coords = obj.getCoords();
            if (this.prolog.canMove(this.board, this.coordToString(prev_coords), this.coordToString(curr_coords)))
                this.board.switchPiece(this.selectedTile, obj);
            else
                console.log("nao");
            this.selectedTile = null;
        }
    }

    //update(time) {this.animator.update(time);}

    display() {
        //this.theme.display();
        this.board.display();
        //this.animator.display();
    }
}
