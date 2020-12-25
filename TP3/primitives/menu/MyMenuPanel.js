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
    constructor(scene, obj, sizeCnt, timeCnt) {
        super(scene);
        this.obj = obj;

        this.size = 3;
        this.timeout = 10;
        this.sizeCounter = sizeCnt;
        this.sizeCounter.primitives[0].updateSpaceBetween(0.5);

        this.timeoutCounter = timeCnt;
        this.timeoutCounter.primitives[0].updateSpaceBetween(0.5);

        this.selected = [1, 1, 1];

    }

    handleBtnEvent(obj, id) {

        let selected = obj.handlePick();
        
        
        if (selected != null)
            this.changeSelection(...selected);
       
    }

    changeSelection(index, id) {
        this.selected[index] = id;
        //TODO apply selection
        //move a frame into position
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

        // this.texture.bind();
        this.obj.display();

        // this.scene.popMatrix();
    }
}

