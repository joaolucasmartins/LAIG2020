/**
 * MyTile
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameBoard} gameboard - gameboard to which this tile belongs
 * @param {MyPiece} piece - piece on top of this tile
 */
class MyTile extends CGFobject {
    constructor(scene, gameboard, piece) {
        super(scene);
        this.gameboard = gameboard //pointer to board
        this.piece = piece; //pointer to piece in tile
        this.obj = new MyRectangle(scene, 0.5, 0, -0.5, 0.5);  //placeholder
    }

    getTile() { return this.tile; }

    setTile(tile) { this.tile = tile; }

    setObj(obj) { this.obj = obj; }

    setPiece(piece) { this.piece = piece; }

    removePiece() { this.piece = null; }

    display() {
        this.obj.display();
    }
}

