const BOARD_SIZE = 25;
class MyGameOrchestrator {
    constructor(scene) {
        //this.gameSequence= new MyGameSequence(...);
        //this.animator= new MyAnimator(...);
        //this.theme= new MyScenegraph(...);
        this.prolog = new MyPrologInterface();
        let initial_board = this.prolog.getInitialBoard(BOARD_SIZE);
        this.board = new MyGameBoard(scene, 0, 0, 0, 0, initial_board);
        let val = this.prolog.validMoves(this.board, "[1,1]");
        console.log(val);
        let a1 = this.board.getTileAt(0, 0);
        let a2 = this.board.getTileAt(1, 0);
        this.board.switchPiece(a1, a2);

    }

    //update(time) {this.animator.update(time);}

    display() {
        //this.theme.display();
        this.board.display();
        //this.animator.display();
    }
}
