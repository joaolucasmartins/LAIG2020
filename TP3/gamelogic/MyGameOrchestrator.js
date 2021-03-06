const BOARD_SIZE = 3;
const AI_DELAY = 1000; // In ms
const FILENAMES = ["pirata.xml", "disco.xml", "northpole.xml"];
const INITIAL_THEME = 0;
const INITIAL_GAME_MODE = 0;
class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.currentTheme = INITIAL_THEME;
        // 0 - Player, 1 - AI
        let firstPlayer = 0;
        let secondPlayer = 1;
        this.gameState = new MyGameState(firstPlayer, secondPlayer);
        this.applyTheme();

    }

    // GAME START AND SETUP
    applyTheme() {
        this.theme = new MySceneGraph(FILENAMES[this.currentTheme], this.scene);
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.prolog = new MyPrologInterface();
        this.scene.reset()
        this.gameState.reset();

        this.board = null;
        this.menu = null;
        this.scoreboard = null;
    }

    /* Starts or restarts the game. Called by the start button (can be pressed at anytime) */
    startGame() {
        this.applyChanges();

        if (this.gameState.canSpawnBoard()) {
            this.gameState.reset(); // set current player to 0
            this.possiblePieces = [];
            this.generateBoard(); //get board from prolog server with the size selected in menu
            this.scoreboard.reset();
            this.scoreboard.startCount();
            this.switchToBoardCamera();
        }
    }

    applyChanges() {
        this.scoreboard.setTimeout(this.menu.getTimeout());
        if (this.currentTheme != (this.menu.getTheme() - 1)) {
            this.currentTheme = this.menu.getTheme() - 1;
            this.applyTheme();
            return;
        }

        if (this.gameState.gameMode != this.menu.getMode()) {
            this.gameState.updateGameMode(this.menu.getMode());
        }

        if (this.gameState.getCurrentAIDifficulty() != this.menu.getLevel()) {
            this.gameState.updateAIDifficulty(this.menu.getLevel());
        }
    }

    /* Initializes gameboard with a prolog query. Also gets the pieces/tiles from the theme */
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
            this.updateGameScore();
            //this.gameState.setToSpawnBoard();
        });
    }

    /* Loads game assets from XML. Called by scene when XML is parsed */
    onGraphLoaded() {
        let menuPanel = this.theme.gameObjects["menuPanel"];
        let scoreboard = this.theme.gameObjects["scoreDisplay"];

        this.menu = menuPanel.primitives[0];
        this.menu.updateSeletion(THEME_SEL_INDEX, this.currentTheme + 1);
        this.scoreboard = scoreboard.primitives[0];
    }

    // CAMERAS
    cameraFinished() {
        this.scoreboard.startCount();
        this.gameState.setToIdle();
    }

    switchToBoardCamera() {
        let selectedCamera = this.scene.getSelectedCamera();
        if (selectedCamera.id == "boardCamera") {
            this.gameState.setToIdle();
            return;
        }
        this.gameState.setToCameraMoving();
        this.animator.addCameraAnimation(selectedCamera, this.scene.cameras["boardCamera"]);
    }

    /* Initializes camera animation. Called by any of the change camera buttons. */
    switchCamera() {
        this.gameState.setToCameraMoving();
        let selectedCamera = this.scene.getSelectedCamera();
        let destCameraId;
        selectedCamera.id == "boardCamera" ? destCameraId = "menuCamera" : destCameraId = "boardCamera"
        this.animator.addCameraAnimation(selectedCamera, this.scene.cameras[destCameraId]);
    }

    updateCamera() {
        this.scene.updateCamera();
    }

    // PICKING
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
        else if (obj instanceof MyButton)
            this.selectButton(obj);
    }

    /* Gets possible pieces that can be swiched with the given coord with a prolog query */
    selectPossiblePieces(coords) {
        let movePromise = this.prolog.validMoves(this.board, this.gameState, coordToString(coords));
        movePromise.then((response) => {
            let coordList = eval(response.target.response);
            let pieceList = coordList.map((coord) => {return this.board.getPieceAt(coord[0], coord[1])});
            this.possiblePieces = this.board.selectPieces(pieceList);
            this.animator.selectPossiblePieces(pieceList);

        });
    }

    /* Handler for piece picking */
    selectPiece(obj) {
        if (this.gameState.canSelect()) { // First piece selected
            if (this.selectedPiece == null) {
                this.selectedPiece = obj;
                this.animator.selectPiece(this.selectedPiece);
                let coords = this.selectedPiece.getTile().getCoords();
                this.selectPossiblePieces(coords);
            }
            else { // Second piece selected
                let sourceTile = this.selectedPiece.getTile();
                let destTile = obj.getTile();
                this.makePlayerMove(sourceTile, destTile);

                this.selectedPiece.selected = false;
                this.deselectPieces();
            }
        }
    }

    /* Deselects all previous selected pieces. Called when animation or ending game */
    deselectPieces() {
        this.animator.deselectPiece();
        if (this.possiblePieces)
            this.board.deselectPieces(this.possiblePieces);
        this.possiblePieces = [];
        this.selectedPiece = null;
    }

    selectButton(obj) {
        let selected = obj.handlePick();

        //update selectable items
        if (selected != null)
            this.menu.changeSelection(...selected);
    }

    // GAME LOGIC
    updateGameScore() {
        let scorePromise = this.prolog.getScore(this.board, this.gameState);
        scorePromise.then((response) => {
            let score = eval(response.target.response);
            let [p1Score, p2Score] = score;
            this.scoreboard.updateScores(p1Score, p2Score);
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
        this.gameState.setToGameOver();
        console.log("Winner is " + winner);
        if (this.gameState.canReplay())
            this.replay();
    }

    switchPieces(sourceTile, destTile) { // called by animatior when switching animation ends
        this.board.switchPiece(sourceTile, destTile);
        this.gameState.nextPlayer();
        this.scoreboard.switchPlayer();
        this.checkGameOver();
        this.scoreboard.startCount();
    }

    skipTurn() {
        this.gameState.nextPlayer();
        this.deselectPieces();
        this.scoreboard.switchPlayer();
        this.scoreboard.startCount();
    }

    makeMove(sourceTile, destTile, addToSequence = true) {
        this.scoreboard.stopCount();
        let gameMove = new MyGameMove(sourceTile, destTile, this.gameState.currentPlayer);
        if (addToSequence)
            this.gameSequence.addGameMove(gameMove);
        this.animator.addGameMove(gameMove);
        this.animator.reset();
        this.animator.start();
    }

    makeAIMove() {
        this.gameState.setToTimeout();
        this.deselectPieces();
        let undoTimeout = new Promise((resolve) => {setTimeout(resolve, AI_DELAY);});
        undoTimeout.then(() => { // This timout allows for the user to do an undo
            // Undo can be made in timeout and turn is no longer AI
            if (!this.gameState.isAITurn() || !this.gameState.isWaitingForTimeout())
                return;
            let movePromise = this.prolog.getAIMove(this.board, this.gameState);
            this.gameState.setToMoving();

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

    makePlayerMove(sourceTile, destTile) {
        this.gameState.setToMoving();
        let prev_coords = sourceTile.getCoords();
        let curr_coords = destTile.getCoords();
        let movePromise = this.prolog.canMove(this.board, this.gameState, coordToString(prev_coords), coordToString(curr_coords));

        movePromise.then((response) => {
            let canMove = eval(response.target.response);
            if (canMove)
                this.makeMove(sourceTile, destTile);
            else
                this.gameState.setToIdle();

            this.checkGameOver();
        });
    }

    undo() {
        if (this.board && this.gameState.canUndo() && !this.gameSequence.isEmpty()) {
            this.deselectPieces();
            this.gameSequence.undo(this.board, this.gameState);
            this.gameState.setToIdle();
        }
    }

    /* Initializes replay */
    replay() {
        this.board.reset();
        this.deselectPieces();
        this.gameState.reset();
        this.gameState.setToReplaying();
    }

    /* Replays next move in the gameSequence */
    replayNextMove() {
        if (this.gameSequence.isEmpty()) {
            this.gameState.setToEnd();
            return;
        }

        let move = this.gameSequence.popFirstMove();
        this.makeMove(move.sourceTile, move.destTile, false)
    }

    display() {
        this.theme.display();

        if (this.gameState.hasStarted()) {
            if (this.board)
                this.board.display();
        }
        //this.animator.display();
    }

    update(time) {
        this.animator.update(time);
        if (this.gameState.canIncreaseTime()) {
            if (this.scoreboard.update(time) != null) {
                this.skipTurn();
            };
        }
        this.theme.update(time); // For theme animations
    }

    orchestrate() {
        if (this.gameState.canMakeAIMove())
            this.makeAIMove();
        if (this.gameState.isReplaying() && this.gameState.canMakeMove()) {
            this.replayNextMove();
        }
    }
}
