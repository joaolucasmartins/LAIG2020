class MyAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.gameMove = null;
        this.isAnimating = false;
    }

    getSourcePiece() { return this.gameMove.getSourcePiece(); }
    getDestPiece() { return this.gameMove.getDestPiece(); }

    getKeyFrames(sourceCoords, destCoords) {
        let [sourceX, sourceY] = sourceCoords;
        let [destX, destY] = destCoords;
        let [vecX, vecY] = [destX - sourceX, destY - sourceY];

        let initTransf = new Transformation([[0, 0, 0], [0, 0, 0], [1, 1, 1]]);
        let finalTransfReverse = new Transformation([[-vecX, 0, -vecY], [0, 0, 0], [1, 1, 1]]);
        let finalTransf = new Transformation([[vecX, 0, vecY], [0, 0, 0], [1, 1, 1]]);
        let midTransf, midTransfReverse;

        if (vecX != 0 && vecY != 0) { // Moving diagonally
            midTransf = new Transformation([[vecX / 3, 1.5, vecY / 1.5], [0, 30, 0], [1, 1, 1]]);
            midTransfReverse = new Transformation([[-vecX / 2, 1.0, -vecY / 1.5], [0, 30, 0], [1, 1, 1]]);
        } else {
            midTransf = new Transformation([[vecX / 2 + vecY / 4, 0.5, vecY / 2 + vecX / 4], [0, 30, 0], [1, 1, 1]]);
            midTransfReverse = new Transformation([[-vecX / 2 - vecY / 4, 0.8, -vecY / 2 - vecX / 4], [0, 30, 0], [1, 1, 1]]);
        }

        return [{ 0: initTransf, 1: midTransf, 2: finalTransf }, { 0: initTransf, 1: midTransfReverse, 2: finalTransfReverse }];
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
        this.sourceAnim = new MyFunctionalAnimation(this.orchestrator.scene, keyframes, [x => x, y => y * y, z => z]);
        this.destAnim = new MyFunctionalAnimation(this.orchestrator.scene, invertedKeyframes, [x => x, y => y * y, z => z]);
        this.getSourcePiece().obj.addAnimation(this.sourceAnim);
        this.getDestPiece().obj.addAnimation(this.destAnim);
    }

    reset() {
        this.sourceAnim.initialInstant = null;
        this.destAnim.initialInstant = null;
    }

    start() {
        this.isAnimating = true;
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
            }
        }
    }

    // Not needed, set in nodes instead
    //display() {
    //if (this.isAnimating && this.gameMove) {
    //this.anim.apply();
    //console.log("source", this.gameMove.getSourceTile().col, this.gameMove.getSourceTile().line);
    //console.log("dest", this.gameMove.getDestTile().col, this.gameMove.getDestTile().line);
    //this.gameMove.getSourcePiece().display();
    //this.gameMove.getDestPiece().display();
    //}
    //}
}
