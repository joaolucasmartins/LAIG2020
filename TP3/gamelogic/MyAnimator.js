/*Source: https://easings.net */
function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutBack(x) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;

}

class MyAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.gameMove = null;
        this.isAnimating = false;
        this.isAnimatingCameras = false;
    }

    getSourcePiece() {return this.gameMove.getSourcePiece();}
    getDestPiece() {return this.gameMove.getDestPiece();}

    /* Used to create switching animation */
    getSwitchingKeyFrames(sourceCoords, destCoords) {
        let [sourceX, sourceY] = sourceCoords;
        let [destX, destY] = destCoords;
        let [vecX, vecY] = [destX - sourceX, destY - sourceY];

        let initTransf = new Transformation([[0, 0, 0], [0, 0, 0], [1, 1, 1]]);
        let finalTransfReverse = new Transformation([[-vecX, 0, -vecY], [0, 0, 0], [1, 1, 1]]);
        let finalTransf = new Transformation([[vecX, 0, vecY], [0, 0, 0], [1, 1, 1]]);
        let midTransf, midTransfReverse;

        if (vecX != 0 && vecY != 0) { // Moving diagonally
            midTransf = new Transformation([[vecX / 6, 0.5, vecY / 1.5], [0, 0, 0.3], [1, 1, 1]]);
            midTransfReverse = new Transformation([[-vecX / 2, 0.7, -vecY / 1.5], [0, 0, 0.3], [1, 1, 1]]);
        } else {
            midTransf = new Transformation([[vecX / 6 + vecY / 4, 0.5, vecY / 2 + vecX / 4], [0, 0, 0.2], [1, 1, 1]]);
            midTransfReverse = new Transformation([[-vecX / 2 - vecY / 4, 0.7, -vecY / 2 - vecX / 4], [0, 0, 0.2], [1, 1, 1]]);
        }

        return [{0: initTransf, 1: midTransf, 2: finalTransf}, {0: initTransf, 1: midTransfReverse, 2: finalTransfReverse}];
    }

    /* Starts the animation of a game move (a switch between two pieces) */
    addGameMove(gameMove) {
        if (this.gameMove) { // Remove previous pieces
            this.getSourcePiece().obj.removeAnimations();
            this.getDestPiece().obj.removeAnimations();
        }
        this.gameMove = gameMove;
        let sourceCoords = gameMove.getSourceTile().getCoords();
        let destCoords = gameMove.getDestTile().getCoords();

        let [keyframes, invertedKeyframes] = this.getSwitchingKeyFrames(sourceCoords, destCoords);
        this.sourceAnim = new MyFunctionalAnimation(this.orchestrator.scene, keyframes, [x => easeOutBack(x), y => y * y, z => z]);
        this.destAnim = new MyFunctionalAnimation(this.orchestrator.scene, invertedKeyframes, [x => easeInOutBack(x), y => y * y, z => z]);
        this.getSourcePiece().obj.addAnimation(this.sourceAnim);
        this.getDestPiece().obj.addAnimation(this.destAnim);
    }

    /* Starts a camera animation. Only one can be enabled at a time. */
    addCameraAnimation(sourceCamera, destCamera) {
        this.cameraAnimation = new MyCameraAnimation(this.orchestrator.scene, sourceCamera, destCamera, 10);
        this.isAnimatingCameras = true;
    }

    /* Resets switching animation */
    reset() {
        this.sourceAnim.initialInstant = null;
        this.destAnim.initialInstant = null;
    }

    /* Starts animation for selecting a piece */
    selectPiece(piece) {
        piece.selected = true;
        let initialTransf = new Transformation([[0, 0, 0], [0, 0, 0], [1, 1, 1]]);
        let midTransf1 = new Transformation([[0, 0.1, 0], [0, Math.PI / 6, 0], [1, 1, 1]]);
        let midTransf2 = new Transformation([[0, 0.1, 0], [0, -Math.PI / 6, 0], [1, 1, 1]]);
        let endTransf = new Transformation([[0, 0, 0], [0, 0, 0], [1, 1, 1]]);

        this.selectedPiece = piece;
        this.selectedAnimation = new MyFunctionalAnimation(this.orchestrator.scene, {0: initialTransf, 3: midTransf1, 6: endTransf, 9: midTransf2, 12: endTransf}, [x => x, y => y, z => z], true);
        this.isAnimatingSelected = true;
        piece.obj.addAnimation(this.selectedAnimation);


    }

    /* Starts animation for selecting possible pieces */
    selectPossiblePieces(pieceList) {

        for (let i = 0; i < pieceList.length; i++) {
            pieceList[i].obj.addAnimation(this.selectedAnimation)
        }
    }

    /* Removes selecting animation for all previous selected pieces */
    deselectPiece() {
        if (this.selectedPiece) {
            this.selectedPiece.selected = false;
            this.selectedPiece.obj.removeAnimations();

            this.selectedPiece = null;
        }
        this.isAnimatingSelected = false;

        let piecesList = this.orchestrator.possiblePieces;
        for (let i = 0; i < piecesList.length; i++)
            piecesList[i].obj.removeAnimations();
    }

    /* Starts switching (game move) animation */
    start() {
        this.isAnimating = true;
        this.orchestrator.gameState.setToAnimating();
    }

    /* Updates all animations managed by the class */
    update(time) {
        if (this.isAnimating) { // Update switching animation
            this.sourceAnim.update(time);
            this.destAnim.update(time);

            if (this.sourceAnim.hasEnded) { // Handle end of switching animation, switch pieces in board
                this.getSourcePiece().obj.removeAnimations();
                this.getDestPiece().obj.removeAnimations();
                this.orchestrator.switchPieces(this.gameMove.getSourceTile(), this.gameMove.getDestTile());
                this.isAnimating = false;
                this.orchestrator.gameState.setToIdle();
            }
        }

        if (this.isAnimatingSelected) { // handles selected animation
            this.selectedAnimation.update(time);
        }

        if (this.isAnimatingCameras) { // handles camera animation
            this.cameraAnimation.update(time);

            if (this.cameraAnimation.hasEnded) { // finishes camera animation by telling orchestrator to switch cameras
                this.cameraAnimation = null;
                this.isAnimatingCameras = false;
                this.orchestrator.cameraFinished();
            }
        }
    }

    // Display is not used as all of the objects subject to MyAnimator's animations are already drawn by the scene or the orchestrator
    // The objects are either cameras or nodes. The latter class has their own display() in which their animations (added by MyAnimator) are applied
    //display() {}
}

