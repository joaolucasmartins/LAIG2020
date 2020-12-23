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
    constructor(scene, id, start) {
        super(scene);
        this.id = id;
        this.obj = start;

    
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
        // let [col, line] = this.getTile().getCoords();
        // let gameboard = this.getTile().gameboard;
        this.scene.registerForPick(500, this);
    }


    display() {
        this.registerForPick();

        this.obj.display();
    }
}

