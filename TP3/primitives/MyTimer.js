/**
 * MyTimer
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} timeout - timeout in seconds
 */
class MyTimer extends CGFobject {
    constructor(scene, timeout) {
        super(scene);

        this.start = 0;
        this.timeout = 10;
        this.started = false;

        this.time = 0;
        this.timeDisplay = new MySpriteText(scene, timeout.toString());

    }

    startCount() {
        this.start = Date.now();
        this.started = true;
        this.time = 0;
    }

    stopCount() {
        this.started = false;
        this.time = 0;
        this.timeDisplay.updateText(this.timeout.toString());
    }

    setTimeout(val) {
        this.timeout = val;
        if (!this.started)
            this.timeDisplay.updateText(val.toString());
    }

    updateTimeDisplay(now) {

        if (this.time >= this.timeout)
            return false;

        if (this.started) {
            let delta = now - this.start;
            let current = Math.floor(delta/1000);
            if (current != this.time){
                this.time = current;
                let display = this.timeout - current;
                if (display < 10)
                    this.timeDisplay.updateText("0" + display.toString());
                else 
                    this.timeDisplay.updateText(display.toString());
            }
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

        this.timeDisplay.display();

    }
}

