/**
 * MySquarePiece
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} radius - piece radius
 * @param {integer} slices - slices
 */
class MySquarePiece extends CGFobject {
    constructor(scene, radius, slices) {
        super(scene);
        this.radius = radius;
        // Move this to different classes?
        let side = 5/8 * radius;
        this.cover = new MyRectangleXZ(this.scene, -side, -side, side, side);
        this.border = new MyTorus(this.scene, radius-0.1, radius, slices, 4);
        // this.body = new MySphere(this.scene, 0.15, 20, 20);

    }

    display() {

        this.scene.pushMatrix();
        this.cover.display();
        this.scene.translate(0, this.radius, 0);
        this.scene.rotate(Math.PI, 0,0,1);
        this.cover.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.1, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(-Math.PI/4, 0,0, 1);
        this.border.display();
        this.scene.popMatrix();

    
    }

}

