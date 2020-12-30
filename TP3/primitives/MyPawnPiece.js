/**
 * MyPiece
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyTile} tile - tile which holds piece
 */
class MyPawnPiece extends CGFobject {
    constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
        super(scene);

        this.height = height;
        this.topRadius = topRadius;
        // Move this to different classes?
        this.body = new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
        this.top = new MySphere(this.scene, topRadius + topRadius/2, slices, stacks);

    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0, this.height+this.topRadius, 0);
        this.top.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.body.display();
        this.scene.popMatrix();
    }

}

