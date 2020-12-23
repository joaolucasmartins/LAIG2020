/**
 * MyRectangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} y1 - y coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} y2 - y coordinate corner 2
 */
class MyMenuPanel extends CGFobject {
    constructor(scene, obj, start) {
        super(scene);
        this.obj = obj;

        this.button = new MyButton(scene, 550, start);
    
    }


    handleBtnEvent(id) {
        this.scene.orchestrator.startGame();
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

    display() {
        this.obj.display();
        this.button.display();
    }
}

