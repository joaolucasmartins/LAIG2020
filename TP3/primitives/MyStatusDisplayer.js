/**
 * MyPiece
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyTile} tile - tile which holds piece
 */
class MyStatusDisplayer extends CGFobject {
    constructor(scene, x , y, on) {
        super(scene);

       this.x = x;
       this.y = y;
       this.isOn = on;
        // Move this to different classes?
        this.light = new MyCircle(this.scene, 0.1, 20);

        this.texture = new CGFtexture(scene, './scenes/images/glass.jpg');
       
        
        this.litMaterial = new CGFappearance(scene);
        this.litMaterial.setShininess(10);
        this.litMaterial.setSpecular(1, 1, 1, 1);
        this.litMaterial.setDiffuse(1, 1, 1, 1);
        this.litMaterial.setAmbient(0, 0, 1, 1);
        this.litMaterial.setEmission(0.7, 0.7, 0.7, 1);

        this.unlitMaterial = new CGFappearance(scene);
        this.unlitMaterial.setShininess(10);
        this.unlitMaterial.setSpecular(0, 0, 0, 1);
        this.unlitMaterial.setDiffuse(0, 0, 0, 1);
        this.unlitMaterial.setAmbient(0, 0, 0, 1);
        this.unlitMaterial.setEmission(0.0, 0.0, 0.0, 1);

        if (this.isOn)
            this.material = this.litMaterial;
        else
            this.material = this.unlitMaterial;

    }

    turnOn() {
        this.material = this.litMaterial;
        this.isOn = true;
    }

    turnOf() {
        this.material = this.unlitMaterial;
        this.isOn = false;
    }

    display() {
        this.material.apply();

        this.texture.bind();
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, 0.01);
        this.light.display();
        this.scene.popMatrix();
        this.texture.unbind();

    }

}

