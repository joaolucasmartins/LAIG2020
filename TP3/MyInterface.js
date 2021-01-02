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
        this.processKeyboard = function() { };
        this.activeKeys = {}
    }

    /**
     * Initialize camera interface.
     */
    initCameraInterface() {
        this.cameraInterface = this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIds).name('Selected Camera').onChange(this.scene.orchestrator.updateCamera.bind(this.scene.orchestrator));
    }

    initMenuInterface() {
    }

    /**
     * Initialize lights interface.
     * Iterates over lightIds and over the enabledLights to determine wich lights are enabled.
     * @param {array} lightsIds - array with light IDs
     */
    initLightsInterface(lightsIds) {
        this.lightInterfaces = [];
        for (var i = 0; i < this.scene.enabledLights.length; i++) {
            this.lightInterfaces.push(this.gui.add(this.scene.enabledLights, i).name(lightsIds[i]));
        }
    }

    reset() {
        if (this.cameraInterface)
            this.gui.remove(this.cameraInterface);
        if (this.lightInterfaces) {
            for (let i = 0; i < this.lightInterfaces.length; ++i)
                this.gui.remove(this.lightInterfaces[i]);
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

    isKeyPressedDelay(keyCode) {
        if (this.activeKeys[keyCode] === true) {
            this.activeKeys[keyCode] = false;
            return true;
        }
        return this.activeKeys[keyCode] || false;
    }
}
