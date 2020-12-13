class MyGameOrchestrator {
    constructor(scene) {
        //this.gameSequence= new MyGameSequence(...);
        //this.animator= new MyAnimator(...);
        //this.theme= new MyScenegraph(...);
        this.prolog = new MyPrologInterface();
        let initial_board = this.prolog.getInitialBoard(10).then(() => {
            console.log("-", initial_board);
            this.board = new MyGameBoard(scene, 0, 0, 0, 0, initial_board);
        }
        );
    }

    //update(time) {this.animator.update(time);}

    display() {
        //this.theme.display();
        this.board.display();
        //this.animator.display();
    }
}
