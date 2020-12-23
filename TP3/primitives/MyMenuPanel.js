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

        this.scene.popMatrix();
    }
}

