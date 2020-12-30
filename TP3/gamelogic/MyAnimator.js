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

    getKeyFrames(sourceCoords, destCoords) {
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

    addGameMove(gameMove) {
        if (this.gameMove) { // Remove previous pieces
            this.getSourcePiece().obj.removeAnimations();
            this.getDestPiece().obj.removeAnimations();
        }
        this.gameMove = gameMove;
        let sourceCoords = gameMove.getSourceTile().getCoords();
        let destCoords = gameMove.getDestTile().getCoords();

        let [keyframes, invertedKeyframes] = this.getKeyFrames(sourceCoords, destCoords);
        this.sourceAnim = new MyFunctionalAnimation(this.orchestrator.scene, keyframes, [x => easeOutBack(x), y => y * y, z => z]);
        this.destAnim = new MyFunctionalAnimation(this.orchestrator.scene, invertedKeyframes, [x => easeInOutBack(x), y => y * y, z => z]);
        this.getSourcePiece().obj.addAnimation(this.sourceAnim);
        this.getDestPiece().obj.addAnimation(this.destAnim);
    }

    addCameraAnimation(sourceCamera, destCamera) {
        this.cameraAnimation = new MyCameraAnimation(this.orchestrator.scene, sourceCamera, destCamera, 10);
        this.isAnimatingCameras = true;
    }

    reset() {
        this.sourceAnim.initialInstant = null;
        this.destAnim.initialInstant = null;
    }

    start() {
        this.isAnimating = true;
        this.orchestrator.gameState.setToAnimating();
    }

    update(time) {
        if (this.isAnimating) {
            this.sourceAnim.update(time);
            this.destAnim.update(time);

            if (this.sourceAnim.hasEnded) {
                this.getSourcePiece().obj.removeAnimations();
                this.getDestPiece().obj.removeAnimations();
                this.orchestrator.switchPieces(this.gameMove.getSourceTile(), this.gameMove.getDestTile());
                this.isAnimating = false;
                this.orchestrator.gameState.setToIdle();
            }
        }

        if (this.isAnimatingCameras) {
            this.cameraAnimation.update(time);

            if (this.cameraAnimation.hasEnded) {
                this.cameraAnimation = null;
                this.isAnimatingCameras = false;
            }
        }
    }
}

