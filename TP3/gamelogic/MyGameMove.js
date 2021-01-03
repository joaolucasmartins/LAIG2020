class MyGameMove {
    constructor(sourceTile, destTile, player) {
        this.player = player;
        this.sourceTile = sourceTile;
        this.destTile = destTile;
        this.sourcePiece = sourceTile.getPiece();
        this.destPiece = destTile.getPiece();
    }

    getSourcePiece() {return this.sourcePiece;}
    getDestPiece() {return this.destPiece;}
    getSourceTile() {return this.sourceTile;}
    getDestTile() {return this.destTile;}

    animate() {}
}
