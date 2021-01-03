/**
 * MyPiece
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyTile} tile - tile which holds piece
 */
class MyPiece extends CGFobject {
    constructor(scene, obj, tile, isBlack) {
        // Move this to different classes?
        super(scene);
        this.tile = tile //pointer to holding tile
        this.obj = obj;
        this.isBlack = isBlack;
        this.selected = false;

        this.selectedMat = mat4.create();
        mat4.scale(this.selectedMat, this.selectedMat, [1.2, 1.2, 1.2]);
    }

    getTile() {return this.tile;}

    setTile(tile) {this.tile = tile;}

    registerForPick() {
        let [col, line] = this.getTile().getCoords();
        let gameboard = this.getTile().gameboard;
        this.scene.registerForPick(col + line * gameboard.length, this);
    }

    display() {
        this.registerForPick();
        if (this.selected) {
            this.scene.pushMatrix();
            this.scene.multMatrix(this.selectedMat);
        }

        this.obj.display();

        if (this.selected)
            this.scene.popMatrix();

        this.scene.clearPickRegistration();
    }

    toString() {
        return this.isBlack ? "0" : "1";
    }
}

