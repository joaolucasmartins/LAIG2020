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
    constructor(scene, id, x, y, textName, obj, selected) {
        super(scene);
        this.id = id;
        this.text = new CGFtexture(scene, "scenes/images/buttons/" + textName);
        this.obj = obj;
        this.selected = selected;
        this.x = x;
        this.y = y;

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setShininess(10);
        this.appearance.setSpecular(1,1,1,1);
        this.appearance.setDiffuse(1,1,1,1);
        this.appearance.setAmbient(1,0,0,1);
        this.appearance.setEmission(0,0,0,1);

    }

    selectButton() {
        this.selected = true;
    }

    resetButton() {
        this.selected = false;
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
        this.scene.registerForPick(this.id, this);
    }


    display() {
        this.registerForPick();
        
        this.text.bind();
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, 0.01);
        this.obj.display();
        this.scene.popMatrix();
    }
}

