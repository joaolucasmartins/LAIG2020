/**
 * MyTile
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameBoard} gameboard - gameboard to which this tile belongs
 * @param {MyPiece} piece - piece on top of this tile
 * @param {integer} line - line
 * @param {integer} col - column
 */
class MyTile extends CGFobject {
    constructor(scene, obj, gameboard, piece, line, col) {
        super(scene);
        this.scene = scene;
        this.gameboard = gameboard //pointer to board
        let offset = -0.5 + gameboard.length / 2;
        this.piece = piece; //pointer to piece in tile

        this.obj = obj;  //tile representation
        this.line = line;
        this.col = col;
        this.mat = mat4.create();
        mat4.translate(this.mat, this.mat, [this.col - offset, 0, this.line - offset]);
    }

    getPiece() { return this.piece; }

    setPiece(piece) { this.piece = piece; }

    setObj(obj) { this.obj = obj; }

    setPiece(piece) { this.piece = piece; }

    removePiece() { this.piece = null; }

    getCoords() { return [this.col, this.line]; }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.mat);

        this.piece.display();

        this.obj.display();
        this.scene.popMatrix();
    }
}

