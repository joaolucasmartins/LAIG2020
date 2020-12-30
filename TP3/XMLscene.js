/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.hasCamera = false;
        this.enabledLights = [];
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);

        this.orchestrator = new MyGameOrchestrator(this);
        // enable picking
        this.setPickEnabled(true);

    }

    /**
     * Initializes a default camera. Called if there are no defined views in the XML file.
     */
    initDefaultCamera() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(35, 35, 35), vec3.fromValues(0, 0, 0));
        this.interface.setActiveCamera(this.camera);
        this.hasCamera = true;
    }

    /**
     * Initializes the cameras defined in the xml. Called by parser after parsing all views.
     */
    initCameras(cameras, cameraIds, defaultCameraId) {
        this.cameras = cameras;
        this.cameraIds = cameraIds;
        this.selectedCamera = defaultCameraId;

        this.interface.initCameraInterface();
        this.updateCamera();
        this.hasCamera = true;
    }

    initMenu() {
        this.interface.initMenuInterface();
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        var lightsIds = [];
        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];
                lightsIds.push(key);

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(false);
                if (graphLight[0]) {
                    this.lights[i].enable();
                    this.enabledLights.push(true);
                }
                else {
                    this.lights[i].disable();
                    this.enabledLights.push(false);
                }

                this.lights[i].update();
                i++;
            }
        }
        this.interface.initLightsInterface(lightsIds);
    }


    /*
     *Updates the camera to the camera selected on the GUI. To be called by the interface every time that the
     *GUI camera option changes
     */
    updateCamera() {
        let cameraWrapper = this.getSelectedCamera();
        cameraWrapper.reset();
        this.camera = cameraWrapper.cgfCamera;
        this.interface.setActiveCamera(this.camera);
    }

    getSelectedCamera() {return this.cameras[this.selectedCamera]}

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.initMenu();

        this.sceneInited = true;

        this.orchestrator.onGraphLoaded();
    }

    update(time) {
        this.checkKeys();
        if (this.sceneInited) {
            this.orchestrator.update(time);
        }
    }

    checkKeys() {
        var text;
        var keysPressed = false;
        // Check for key codes e.g. in https://keycode.info/
        if (this.gui.isKeyPressedDelay("KeyU")) {
            text = "Called undo";
            keysPressed = true;
        }

        if (keysPressed)
            console.log(text);
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        this.orchestrator.managePick(this.pickMode, this.pickResults);
        this.clearPickRegistration();

        this.orchestrator.orchestrate();
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        if (this.hasCamera)
            this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        if (this.hasCamera)
            this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.enabledLights.length; i++) {
            if (this.enabledLights[i] == true) {
                this.lights[i].enable();
            } else {
                this.lights[i].disable();
            }
            this.lights[i].update();
        }

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            //this.graph.displayScene(this);
            this.orchestrator.display();
        }
        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }
        this.gl.disable(this.gl.BLEND);

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}
