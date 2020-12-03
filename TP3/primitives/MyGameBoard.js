/**
 * MyGameBoard
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameBoard} gameboard - gameboard to which this tile belongs
 * @param {MyPiece} piece - piece on top of this tile
 */
class MyGameBoard extends CGFobject {
    constructor(scene, x1, y1, x2, y2) {
        super(scene);
        this.tiles = []; 
        this.pieces = []; 
    }

    getTileAt(line, col) { return this.tiles[line][col] }

    addPiece(piece, tile) { tile.setPiece(piece); }
    removePiece(tile) { tile.setPiece(null); }
    getPiece(tile) { return tile.getPiece(); }
    getTile(piece) { return piece.getTile(); }
    movePiece(piece, sourceTile, destTile) {
        sourceTile.removePiece();
        destTile.setPiece(piece);
    }

    display() {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].display();
            this.pieces[i].display();
        }
    }
}

