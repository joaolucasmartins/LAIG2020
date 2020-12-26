const THEME_INDEX = 1;
const LEVEL_INDEX = 4;
const MODE_INDEX = 7;
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

        this.buttons = obj.descendants;

        this.size = 3;
        this.timeout = 10;
        this.sizeCounter = sizeCnt;
        this.sizeCounter.primitives[0].updateSpaceBetween(0.5);

        this.timeoutCounter = timeCnt;
        this.timeoutCounter.primitives[0].updateSpaceBetween(0.5);

        // 0 - THEME | 1 - LEVEL | 2 - MODE
        this.selected = [1, 1, 1];

        let selMat = new CGFappearance(scene);
        selMat.setShininess(10);
        selMat.setSpecular(0,0,1,1);
        selMat.setDiffuse(0,0,1,1);
        selMat.setAmbient(0,0,1,1);
        selMat.setEmission(0.1,0.1,0.1,1);

        let defaultMat = new CGFappearance(scene);
        defaultMat.setShininess(1);
        defaultMat.setSpecular(0.5,0.5,0.5,1);
        defaultMat.setDiffuse(0.5,0.5,0.5,1);
        defaultMat.setAmbient(0.5,0.5,0.5,1);
        defaultMat.setEmission(0.5,0.5,0.5,1);

        this.selectedMaterial = new MyMaterial(selMat);

        this.defaultMaterial = new MyMaterial(defaultMat);

        //default buttons
        this.buttons[THEME_INDEX + this.selected[0]].material = this.selectedMaterial;
        this.buttons[LEVEL_INDEX + this.selected[1]].material = this.selectedMaterial;
        this.buttons[MODE_INDEX + this.selected[2]].material = this.selectedMaterial;

    }

    updateSeletion(selIndex, index) {
        if (selIndex == 0)  //theme
            this.buttons[THEME_INDEX + index].material = this.selectedMaterial;
        else if (selIndex == 1) //level
            this.buttons[LEVEL_INDEX + index].material = this.selectedMaterial;
        else //mode
            this.buttons[MODE_INDEX + index].material = this.selectedMaterial;

        this.selected[selIndex] = index;

    }

    resetSelection(selIndex) {

        if (selIndex == 0)
            this.buttons[THEME_INDEX + this.selected[0]].material = this.defaultMaterial;
        else if (selIndex == 1) 
            this.buttons[LEVEL_INDEX + this.selected[1]].material = this.defaultMaterial;
        else 
            this.buttons[MODE_INDEX + this.selected[2]].material = this.defaultMaterial;
    }

    handleBtnEvent(obj) {

        let selected = obj.handlePick();
        
        if (selected != null)
            this.changeSelection(...selected);
       
    }

    handleCounterEvent(obj) {
        if (obj.id == 4 ) {
            if (this.size < 15) {
                this.size++;
                this.sizeCounter.primitives[0].updateText(this.size.toString());
            }
        }
        else if (obj.id == 5) {
            if (this.size > 3) {
                this.size--;
                this.sizeCounter.primitives[0].updateText(this.size.toString());
            }
        }
        else if (obj.id == 6) {
            if (this.timeout < 60) {
                this.timeout++;
                this.timeoutCounter.primitives[0].updateText(this.timeout.toString());
            }
        }
        else if (obj.id == 7) {
            if (this.timeout > 10) {
                this.timeout--;
                this.timeoutCounter.primitives[0].updateText(this.timeout.toString());
            }
        }
    }

    changeSelection(selIndex, id) {
        //remove previous selection
        this.resetSelection(selIndex);
        //select new button
        this.updateSeletion(selIndex, id);
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
    }
}

