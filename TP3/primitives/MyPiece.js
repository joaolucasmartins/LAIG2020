/**
 * MyPiece
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyTile} tile - tile which holds piece
 */
class MyPiece extends CGFobject {
    constructor(scene, tile) {
        super(scene);
        this.tile = tile //pointer to holding tile
        this.obj = new MySphere(scene, 1, 10, 10);  //placeholder
    }

    getTile() { return this.tile; }

    setTile(tile) { this.tile = tile;}

    setObj(obj) { this.obj = obj; }


    display() {
        this.obj.display();
    }
}

