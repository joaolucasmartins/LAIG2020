const offset = 10;

/**
 * MyTile
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameBoard} gameboard - gameboard to which this tile belongs
 * @param {MyPiece} piece - piece on top of this tile
 */
class MyTile extends CGFobject {
    constructor(scene, gameboard, piece, line, col) {
        super(scene);
        this.scene = scene;
        this.gameboard = gameboard //pointer to board
        this.piece = piece; //pointer to piece in tile

        this.obj = new MyPlane(scene, 5, 5);  //tile representation

        this.line = line;
        this.col = col;
    }

    getPiece() {return this.piece;}

    setPiece(piece) {this.piece = piece; this.piece.setTile(this);}

    setObj(obj) {this.obj = obj;}

    setPiece(piece) {this.piece = piece;}

    removePiece() {this.piece = null;}

    getCoords() {return [this.line, this.col];}

    display() {
        // TODO Restrict this maybe?
        this.scene.registerForPick(this.col + this.line * this.gameboard.length, this);
        this.scene.pushMatrix();
        this.scene.translate(this.col - offset, 0, this.line - offset);
        if (this.piece)
            this.piece.display();
        this.obj.display();
        this.scene.popMatrix();
    }
}

