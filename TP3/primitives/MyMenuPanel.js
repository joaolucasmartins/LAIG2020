const START_ID = 1001;
const CONFIG_ID = 1002;
const THEME1_ID = 1003;
const THEME2_ID = 1004;
const THEME3_ID = 1005;
const LVL1_ID = 1006;
const LVL2_ID = 1007;
const LVL3_ID = 1008;
const MODE1_ID = 1009;
const MODE2_ID = 1010;
const MODE3_ID = 1011;
const INCR_ID = 1012;
const DECR_ID = 1013;

const EXIT_ID = 1014;

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
    constructor(scene, obj) {
        super(scene);

        this.obj = obj;

        this.sizeCounter = 0;
        this.displayCounter = new MyRectangle(scene, 0.1, 0.1, 0.1); //TODO temporary replace with spritetext

        this.buttons = [];
        let normalBtn = new MyRectangle(scene, -0.4, -0.1, 0.1, 0.1, 0.5, 0.2);
        let mediumBtn = new MyRectangle(scene, -0.2, -0.1, 0.2, 0.1, 0.4, 0.2);
        let smallBtn = new MyRectangle(scene, -0.05, -0.05, 0.05,0.05, 0.1, 0.1);

        this.buttons.push(new MyButton(scene, START_ID, 1.8, 0.2, 'btn.jpg', normalBtn, true));
        this.buttons.push(new MyButton(scene, CONFIG_ID, 0.5, 0.2, 'applyBtn.jpg', normalBtn, false));
        this.buttons.push(new MyButton(scene, THEME1_ID, 0.3, 0.5, 'themeBtn1.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, THEME2_ID, 0.8, 0.5, 'themeBtn2.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, THEME3_ID, 1.3, 0.5, 'themeBtn3.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, LVL1_ID, 0.3, 0.8, 'lvlBtn1.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, LVL2_ID, 0.8, 0.8, 'lvlBtn2.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, LVL3_ID, 1.3, 0.8, 'lvlBtn3.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, MODE1_ID, 0.3, 1.1, 'modeBtn1.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, MODE2_ID, 0.8, 1.1, 'modeBtn2.jpg', mediumBtn, false));
        this.buttons.push(new MyButton(scene, MODE3_ID, 1.3, 1.1, 'modeBtn3.jpg', mediumBtn, false));

        this.buttons.push(new MyButton(scene, INCR_ID, 1.9, 0.8, 'incrBtn.jpg', smallBtn, false));
        this.buttons.push(new MyButton(scene, DECR_ID, 1.9, 0.6, 'decrBtn.jpg', smallBtn, false));
        this.buttons.push(new MyButton(scene, EXIT_ID, 1.9, 1.2, 'exitBtn.jpg', smallBtn, false));
    }

    handleBtnEvent(obj, id) {
        
        switch (id) {
            case START_ID:
                this.scene.orchestrator.startGame();
                break;
            case CONFIG_ID:
                console.log("configBtn");
                break;
            case THEME1_ID:
                console.log("theme 1");
                obj.selectButton();
                break;
            case THEME2_ID:
                console.log("theme 2");
                break;
            case THEME3_ID:
                console.log("theme 3");
                break;
            case LVL1_ID:
                console.log("lvl 1");
                break;
            case LVL2_ID:
                console.log("lvl 2");
                break;
            case LVL3_ID:
                console.log("lvl 3");
                break;
            case MODE1_ID:
                console.log("mode 1");
                break;
            case MODE2_ID:
                console.log("mode 2");
                break;
            case MODE3_ID:
                console.log("mode 3");
                break;
            default:
                console.log("Unrecognized button id" + id);
                break;
        }
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

        // this.appearance.apply();
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, -1);  //FIX: XML transformations not being inherited by buttons

        // this.texture.bind();
        this.obj.display();
        // this.texture.unbind();
        for (let i = 0; i < this.buttons.length; i++)
            this.buttons[i].display();

        this.scene.popMatrix();
    }
}

