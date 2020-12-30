const BOARD_SIZE = 3;
const AI_DELAY = 1000; // In ms
const FILENAMES = ["demo.xml", "demo2.xml", "demo.xml"];
const INITIAL_THEME = 0;
class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.currentTheme = INITIAL_THEME;
        this.applyTheme();
        // 0 - Player, 1 - AI
        let firstPlayer = 0;
        let secondPlayer = 1;
        this.gameState = new MyGameState(firstPlayer, secondPlayer);
    }

    applyTheme() {
        this.theme = new MySceneGraph(FILENAMES[this.currentTheme], this.scene);
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.prolog = new MyPrologInterface();
        // TODO mover estas vars para o gameState
        this.scene.sceneInited = false;
        this.moving = false;
        this.gameOver = false;
        this.isReplaying = false;
        this.waitingForTimeout = false;

        this.board = null;
        this.menu = null;
        this.scoreboard = null;
    }

    startGame() {
        this.started = true;
        this.gameOver = false;
        this.gameState.reset(); // set current player to 0
        this.generateBoard(); //get board from prolog server with the size selected in menu
        this.scoreboard.startCount();
    }

    applyChanges() {
        this.scoreboard.setTimeout(this.menu.getTimeout());
        if (this.currentTheme != (this.menu.getTheme() - 1)) {
            this.currentTheme = this.menu.getTheme() - 1;
            this.applyTheme();
        }
    }

    generateBoard() {
        let whiteTile = this.theme.gameObjects["whiteTile"];
        let whiteTileCreator = new MyNodeCreator(whiteTile);
        let blackTile = this.theme.gameObjects["blackTile"];
        let blackTileCreator = new MyNodeCreator(blackTile);
        let whitePiece = this.theme.gameObjects["whitePiece"];
        let whitePieceCreator = new MyNodeCreator(whitePiece);
        let blackPiece = this.theme.gameObjects["blackPiece"];
        let blackPieceCreator = new MyNodeCreator(blackPiece);
        let gameBoard = this.theme.gameObjects["gameBoard"];

        this.prolog.getInitialBoard(this.menu.getBoardSize()).then(response => {
            let initial_board = eval(response.target.response);
            this.board = new MyGameBoard(this.scene, gameBoard, initial_board,
                whiteTileCreator, blackTileCreator, whitePieceCreator, blackPieceCreator);
        });
    }

    onGraphLoaded() { // Called by scene when XML is parsed
        let menuPanel = this.theme.gameObjects["menuPanel"];
        let scoreboard = this.theme.gameObjects["scoreBoard"];

        this.menu = menuPanel.primitives[0];
        this.menu.updateSeletion(THEME_SEL_INDEX, this.currentTheme + 1);
        this.scoreboard = scoreboard.primitives[0];
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
            this.menu.handleBtnEvent(obj);
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
            this.scoreboard.updateScores(p1Score[0], p2Score[0]);
            console.log("P1 Score", p1Score);
            console.log("P2 Score", p2Score);
        })
    }

    checkGameOver() {
        this.prolog.isGameOver(this.board, this.gameState).then((response) => {
            let isGameOver = response.target.response;
            if (isGameOver != "false") {
                this.endGame(isGameOver);
            }

            this.updateGameScore();
        });
    }

    endGame(winner) {
        this.scoreboard.endGame(winner);
        this.gameOver = true;
        console.log("Winner is " + winner);
        this.scoreboard.endGame();
        if (!this.isReplaying)
            this.replay();
    }

    switchPieces(sourceTile, destTile) { // called by animatior when switching animation ends
        this.board.switchPiece(sourceTile, destTile);
        this.gameState.nextPlayer();
        this.checkGameOver();
        this.scoreboard.startCount();
    }

    makeAIMove() {
        this.waitingForTimeout = true;
        if (this.makeAIMove.a != undefined)
            this.makeAIMove.a += 1
        else
            this.makeAIMove.a = 0;
        let undoTimeout = new Promise((resolve) => {setTimeout(resolve, AI_DELAY);});
        undoTimeout.then(() => {
            // Undo be made in timeout and turn is no longer AI
            this.waitingForTimeout = false;
            if (!this.gameState.isAITurn())
                return;
            this.moving = true;
            let movePromise = this.prolog.getAIMove(this.board, this.gameState);

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
        })
    }

    makeMove(sourceTile, destTile) { // TODO Subst with game sequence?
        this.moving = true;
        let prev_coords = sourceTile.getCoords();
        let curr_coords = destTile.getCoords();
        let movePromise = this.prolog.canMove(this.board, this.gameState, coordToString(prev_coords), coordToString(curr_coords));

        movePromise.then((response) => {
            let canMove = eval(response.target.response);
            if (canMove) {
                this.scoreboard.stopCount();
                let gameMove = new MyGameMove(sourceTile, destTile, this.gameState.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                this.animator.addGameMove(gameMove);
                this.animator.reset();
                this.animator.start();
            }
            else
                console.log("nao");

            this.checkGameOver();
            this.moving = false;
        });
    }

    canMakeMove() {
        return this.board && !this.moving && !this.animator.isAnimating;
    }

    canUndo() {
        return this.board && !this.gameOver &&
            ((this.gameState.isAITurn() && this.waitingForTimeout) || (this.gameState.isPlayerTurn() && !this.moving));
    }

    undo() {
        if (this.canUndo())
            this.gameSequence.undo(this.board, this.gameState);
    }

    replay() {
        if (this.gameOver) {
            this.board.reset();
            this.gameState.reset();
            this.isReplaying = true;
        }
    }

    replayNextMove() {
        if (this.gameSequence.isEmpty()) {
            this.gameOver = true;
            return;
        }

        let move = this.gameSequence.popFirstMove();
        this.makeMove(move.sourceTile, move.destTile)
    }

    display() {
        this.theme.display();

        if (this.started) {
            if (this.board)
                this.board.display();
        }
        //this.animator.display();
    }

    update(time) {
        this.animator.update(time);
        if (this.scoreboard.update(time) != null) {
            //TODO: skip turn
        };
    }

    orchestrate() {
        if (this.canMakeMove() && this.gameState.isAITurn() && !this.waitingForTimeout && !this.gameOver)
            this.makeAIMove();
        if (this.isReplaying && this.canMakeMove())
            this.replayNextMove();
    }
}
