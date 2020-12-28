const THEME_INDEX = 2;
const LEVEL_INDEX = 5;
const MODE_INDEX = 8;
/**
 * MyRectangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {rectangle} obj - menu background primitive
 */
class MyMenuPanel extends CGFobject {
    constructor(scene, obj) {
        super(scene);
        this.obj = obj;

        this.orchestrator = null;

        this.buttons = [];
        this.createButtons();

        this.size = 3;
        this.timeout = 10;
        // this.sizeCounter 

        this.sizeCounter = new MySpriteText(this.scene, '3');
        this.timeoutCounter = new MySpriteText(this.scene, '10');

        let counterBtn1 = new MyCounterButton(this.scene, 4, 1.85, 0.5, 1.95, 0.6, 0.1, 0.1, false, 1, 'incrBtn.jpg');
        let counterBtn2 = new MyCounterButton(this.scene, 5, 1.85, 0.4, 1.95, 0.5, 0.1, 0.1, false, -1, 'decrBtn.jpg')
        this.buttons.push(counterBtn1);
        this.buttons.push(counterBtn2);

        let counterBtn3 = new MyCounterButton(this.scene, 6, 1.85, 0.9, 1.95, 1, 0.1, 0.1, false, 1, 'incrBtn.jpg');
        let counterBtn4 = new MyCounterButton(this.scene, 7, 1.85, 0.8, 1.95, 0.9, 0.1, 0.1, false, -1, 'decrBtn.jpg');

        this.buttons.push(counterBtn3);
        this.buttons.push(counterBtn4);

        // 0 - THEME | 1 - LEVEL | 2 - MODE
        this.selected = [1, 1, 1];

       

    }

    getBoardSize() { return this.size; }

    getTimeout() { return this.timeout; }

    createButtons() {
        let startBtn = new MyActionButton(this.scene, 1, 1.4, 0.1, 1.9, 0.3, 0.5, 0.2, false, 'startBtn.jpg');
        let applyBtn = new MyActionButton(this.scene, 2, 0.1, 0.1, 0.6, 0.3, 0.5, 0.2, false, 'applyBtn.jpg');
        let undoBtn = new MyActionButton(this.scene, 3, 0.75, 0.1, 1.25, 0.3, 0.5, 0.2, false, 'undoBtn.jpg');

        let themeBtn1 = new MyThemeButton(this.scene, 1, 0.1, 0.4, 0.5, 0.6, 0.4, 0.2, true, 'themeBtn1.jpg');
        let themeBtn2 = new MyThemeButton(this.scene, 2, 0.6, 0.4, 1.0, 0.6, 0.4, 0.2, false, 'themeBtn2.jpg');
        let themeBtn3 = new MyThemeButton(this.scene, 3, 1.1, 0.4, 1.5, 0.6, 0.4, 0.2, false, 'themeBtn3.jpg');

        let lvlBtn1 = new MyLevelButton(this.scene, 1, 0.1, 0.7, 0.5, 0.9, 0.4, 0.2, true, 'lvlBtn1.jpg');
        let lvlBtn2 = new MyLevelButton(this.scene, 2, 0.6, 0.7, 1, 0.9, 0.4, 0.2, false, 'lvlBtn2.jpg');
        let lvlBtn3 = new MyLevelButton(this.scene, 3, 1.1, 0.7, 1.5, 0.9, 0.4, 0.2, false, 'lvlBtn3.jpg');

        let modeBtn1 = new MyModeButton(this.scene, 1, 0.1, 1, 0.5, 1.2, 0.4, 0.2, true, 'modeBtn1.jpg');
        let modeBtn2 = new MyModeButton(this.scene, 2, 0.6, 1, 1, 1.2, 0.4, 0.2, false, 'modeBtn2.jpg');
        let modeBtn3 = new MyModeButton(this.scene, 3, 1.1, 1, 1.5, 1.2, 0.4, 0.2, false, 'modeBtn3.jpg');

        this.buttons.push(startBtn);
        this.buttons.push(applyBtn);
        this.buttons.push(undoBtn);

        this.buttons.push(themeBtn1);
        this.buttons.push(themeBtn2);
        this.buttons.push(themeBtn3);

        this.buttons.push(lvlBtn1);
        this.buttons.push(lvlBtn2);
        this.buttons.push(lvlBtn3);

        this.buttons.push(modeBtn1);
        this.buttons.push(modeBtn2);
        this.buttons.push(modeBtn3);
    }

    
    updateSeletion(selIndex, index) {
        if (selIndex == 0)  //theme
            this.buttons[THEME_INDEX + index].selectButton();
        else if (selIndex == 1) //level
            this.buttons[LEVEL_INDEX + index].selectButton();
        else //mode
            this.buttons[MODE_INDEX + index].selectButton();

        this.selected[selIndex] = index;

    }

    resetSelection(selIndex) {

        if (selIndex == 0)
            this.buttons[THEME_INDEX + this.selected[0]].resetButton();
        else if (selIndex == 1)
            this.buttons[LEVEL_INDEX + this.selected[1]].resetButton();
        else
            this.buttons[MODE_INDEX + this.selected[2]].resetButton();
    }

    handleBtnEvent(obj) {

        if (obj instanceof MyCounterButton)
            this.handleCounterEvent(obj);
        else {
            let selected = obj.handlePick();

            if (selected != null)
                this.changeSelection(...selected);
        }

    }

    handleCounterEvent(obj) {

        if (obj.id == 4) {
            if (this.size < 15) {
                this.size++;
                this.sizeCounter.updateText(this.size.toString());
            }
        }
        else if (obj.id == 5) {
            if (this.size > 3) {
                this.size--;
                this.sizeCounter.updateText(this.size.toString());
            }
        }
        else if (obj.id == 6) {
            if (this.timeout < 60) {
                this.timeout++;
                this.timeoutCounter.updateText(this.timeout.toString());
            }
        }
        else if (obj.id == 7) {
            if (this.timeout > 10) {
                this.timeout--;
                this.timeoutCounter.updateText(this.timeout.toString());
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

        for (let i = 0; i < this.buttons.length; i++)
            this.buttons[i].display();

        this.scene.pushMatrix();
        this.scene.translate(1.62, 0.5, 0.01);
        this.scene.scale(0.25, 0.25, 1);
        this.sizeCounter.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.75, 0.9, 0.01);
        this.scene.scale(0.25, 0.25, 1);
        this.timeoutCounter.display();
        this.scene.popMatrix();
    }
}

