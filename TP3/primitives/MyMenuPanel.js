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
const EXIT_ID = 1016;
const INCR_TIME_ID = 1014; 
const DECR_TIME_ID = 1015;

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

    }

    handleBtnEvent(obj, id) {

        //TODO: separate button into subclasses
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
            case INCR_ID: 
                if (this.size < 15)
                {
                    this.size++;
                    this.sizeCounter.primitives[0].updateText(this.size.toString());    //FIX: having to access to get spriteText object
                }
                else 
                    console.log("max board size");
                break;
            case DECR_ID:
                if (this.size > 3){
                    this.size--;
                    this.sizeCounter.primitives[0].updateText(this.size.toString());
                }
                else
                    console.log("Cannot increment further");
                break;
            case INCR_TIME_ID:
                if (this.timeout < 30) {
                    this.timeout++;
                    this.timeoutCounter.primitives[0].updateText(this.timeout.toString());
                }
                break;
            case DECR_TIME_ID:
                if (this.timeout > 10) {
                    this.timeout--;
                    this.timeoutCounter.primitives[0].updateText(this.timeout.toString());
                }
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

        // this.texture.bind();
        this.obj.display();

        // this.scene.popMatrix();
    }
}

