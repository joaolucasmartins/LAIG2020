const BOARD_SIZE = 3;
class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.theme = new MySceneGraph("demo.xml", scene);
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.prolog = new MyPrologInterface();
        this.moving = false;
        this.gameOver = false; // TODO convert this to states

        this.menu = null;


        // 0 - Player, 1 - AI
        let firstPlayer = 0;
        let secondPlayer = 1;
        this.gameState = new MyGameState(firstPlayer, secondPlayer);
    }

    startGame() {
        this.started = true;
    }

    onGraphLoaded() { // Called by scene when XML is parsed
        let whiteTile = this.theme.gameObjects["whiteTile"];
        let whiteTileCreator = new MyNodeCreator(whiteTile);
        let blackTile = this.theme.gameObjects["blackTile"];
        let blackTileCreator = new MyNodeCreator(blackTile);
        let whitePiece = this.theme.gameObjects["whitePiece"];
        let whitePieceCreator = new MyNodeCreator(whitePiece);
        let blackPiece = this.theme.gameObjects["blackPiece"];
        let blackPieceCreator = new MyNodeCreator(blackPiece);
        let gameBoard = this.theme.gameObjects["gameBoard"];
        let menuPanel = this.theme.gameObjects["menuPanel"];
        let sizeCounter = this.theme.gameObjects["sizeCounter"];
        let timeCounter = this.theme.gameObjects["timeCounter"];

        this.menu = new MyMenuPanel(this.scene, menuPanel, sizeCounter, timeCounter);

        this.prolog.getInitialBoard(BOARD_SIZE).then(response => {
            let initial_board = eval(response.target.response);
            this.board = new MyGameBoard(this.scene, gameBoard, initial_board,
                whiteTileCreator, blackTileCreator, whitePieceCreator, blackPieceCreator);

            if (this.gameState.isAITurn())
                this.makeAIMove();
        });
    }

    // TODO Don't register non hihglited pieces for picking
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
        else if (obj instanceof MyButton) {
            this.menu.handleBtnEvent(obj, id);
        }
    }

    selectPossiblePieces(coords) {
        let movePromise = this.prolog.validMoves(this.board, this.gameState, coordToString(coords));
        movePromise.then((response) => {
            let coordList = eval(response.target.response);
            let pieceList = coordList.map((coord) => { return this.board.getPieceAt(coord[0], coord[1]) });
            this.selectPiece.possiblePieces = this.board.selectPieces(pieceList);
        });
    }

    selectPiece(obj) {
        if (!this.animator.isAnimating && this.gameState.isPlayerTurn() && !this.gameOver) {
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

    updateGameScore() {
        let scorePromise = this.prolog.getScore(this.board, this.gameState);
        scorePromise.then((response) => {
            let score = eval(response.target.response);
            let [p1Score, p2Score] = score;
            console.log("P1 Score", p1Score);
            console.log("P2 Score", p2Score);
        })
    }

    checkGameOver() {
        this.prolog.isGameOver(this.board, this.gameState).then((response) => {
            let isGameOver = response.target.response;
            if (isGameOver == "false") {
                this.updateGameScore();
            }
            else {
                let winner = isGameOver
                this.endGame(winner);
            }
            this.moving = false;
        });
    }

    endGame(winner) {
        // TODO Update scoreboard
        console.log(this.gameSequence);
        this.gameOver = true;
        console.log("Winner is " + winner);
    }

    switchPieces(sourceTile, destTile) { // called by animatior when switching animation ends
        this.board.switchPiece(sourceTile, destTile);
        this.gameState.nextPlayer();
        this.checkGameOver();
    }

    makeAIMove() {
        let movePromise = this.prolog.getAIMove(this.board, this.gameState);
        this.moving = true;
        movePromise.then((response) => {
            let move = eval(response.target.response);
            if (move === false)
                this.checkGameOver();
            else {
                let sourceTile = this.board.getTileAt(...move[0])
                let destTile = this.board.getTileAt(...move[1])
                this.makeMove(sourceTile, destTile);
            }
        })
    }

    makeMove(sourceTile, destTile) {
        this.moving = true;
        let prev_coords = sourceTile.getCoords();
        let curr_coords = destTile.getCoords();
        let movePromise = this.prolog.canMove(this.board, this.gameState, coordToString(prev_coords), coordToString(curr_coords));

        movePromise.then((response) => {
            let canMove = eval(response.target.response);
            if (canMove) {
                let gameMove = new MyGameMove(sourceTile, destTile);
                this.gameSequence.addGameMove(gameMove);
                this.animator.addGameMove(gameMove);
                this.animator.reset();
                this.animator.start();
            }
            else
                console.log("nao");

            this.checkGameOver();
        });
    }

    display() {
        if (this.menu != null)
            this.menu.display();

        if (this.started) {
            this.theme.display();
            if (this.board)
                this.board.display();
        }
        //this.animator.display();
    }

    update(time) {
        this.animator.update(time);
    }

    orchestrate() {
        if (!this.moving && !this.animator.isAnimating && this.gameState.isAITurn() && !this.gameOver)
            this.makeAIMove();
    }
}
