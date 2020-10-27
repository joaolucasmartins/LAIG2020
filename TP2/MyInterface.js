/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () {};
        this.activeKeys = {}
    }

    /**
     * Initialize camera interface.
     */
    initCameraInterface() {
        this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIds).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    /**
     * Initialize lights interface.
     * Iterates over lightIds and over the enabledLights to determine wich lights are enabled.
     * @param {array} lightsIds - array with light IDs
     */
    initLightsInterface(lightsIds) {
        for (var i = 0; i < this.scene.enabledLights.length; i++) {
            this.gui.add(this.scene.enabledLights, i).name(lightsIds[i]);
        }
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    }

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
