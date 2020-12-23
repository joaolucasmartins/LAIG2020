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
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected) {
        super(scene);
        this.id = id;
        this.obj = new MyRectangle(scene, x1, y1, x2, y2, afs, aft);
        this.selected = selected;
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
        this.obj.display();
    }
}

