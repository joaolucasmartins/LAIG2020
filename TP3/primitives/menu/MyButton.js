/**
 * MyRectangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} y1 - y coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} y2 - y coordinate corner 2
 */
class MyButton extends CGFobject {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, textName) {
        super(scene);
        this.id = id;
        this.obj = new MyRectangle(scene, x1, y1, x2, y2, afs, aft);
        this.selected = selected;

        this.texture = new CGFtexture(scene, "./scenes/images/buttons/" + textName);

        let selMat = new CGFappearance(scene);
        selMat.setShininess(10);
        selMat.setSpecular(0, 0, 1, 1);
        selMat.setDiffuse(0, 0, 1, 1);
        selMat.setAmbient(0, 0, 1, 1);
        selMat.setEmission(0.1, 0.1, 0.1, 1);

        let defaultMat = new CGFappearance(scene);
        defaultMat.setShininess(1);
        defaultMat.setSpecular(0.5, 0.5, 0.5, 1);
        defaultMat.setDiffuse(0.5, 0.5, 0.5, 1);
        defaultMat.setAmbient(0.5, 0.5, 0.5, 1);
        defaultMat.setEmission(0.5, 0.5, 0.5, 1);

        this.selectedMaterial = new MyMaterial(selMat);

        this.defaultMaterial = new MyMaterial(defaultMat);
    }

    selectButton() {
        this.selected = true;
    }

    resetButton() {
        this.selected = false;
    }

    handlePick() {
        console.log("called button");
    }
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }

    registerForPick() {
        console.log("Called button class");
    }

    display() {
        this.registerForPick();

        if (this.selected)
            this.selectedMaterial.apply();
        this.texture.bind();
        this.scene.pushMatrix();
        this.scene.translate(0,0, 0.01);
        this.obj.display();
        this.scene.popMatrix();
        this.texture.unbind();

        if (this.selected)
            this.defaultMaterial.apply();
    }
}

