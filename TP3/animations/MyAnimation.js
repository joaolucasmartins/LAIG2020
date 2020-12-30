class MyAnimation {
    constructor(scene, elements) {
        console.log(elements);
        this.elements = elements; // What instants are mapped to
        this.scene = scene;
        this.instants = Object.keys(elements).map(parseFloat); // Cast String keys to float

        this.hasEnded = false;
        this.initialInstant = null;

        // Sort instants so that we evaluate them in order
        this.instants.sort(function(a, b) {
            return a - b;
        });
    }

    // Methods to be overwritten by subclasses
    // They are called by update and are treated as event handlers
    onBeforeAnimation() {
        throw new Error("onBeforeAnimation method of abstract class animation called");
    }
    onEndAnimation() {
        throw new Error("onAnimationEnd method of abstract class animation called");
    }
    onMidAnimation() {
        throw new Error("onMidAnimation method of abstract class animation called");
    }

    getInitialInstant() {
        return this.instants[0];
    }

    getLastInstant() {
        return this.instants[this.instants.length - 1];
    }

    update(time) {
        // Animation has been reset/is starting for the first time
        if (this.initialInstant == null) {
            this.hasEnded = false;
            this.initialInstant = time; // Update initial time
        }

        var instant = (time - this.initialInstant) / 1000;

        if (instant <= this.getInitialInstant()) {
            this.currInstantIndex = 0;
            this.previousInstant = null;
            this.currInstant = this.getInitialInstant();
            this.onBeforeAnimation(instant);
            return;
        }

        if (instant >= this.getLastInstant()) {
            this.currInstantIndex = this.instants.length - 1;
            this.previousInstant = this.currInstant;
            this.currInstant = this.getLastInstant();
            this.onEndAnimation(instant);
            this.hasEnded = true;
            return;
        }

        while (instant > this.currInstant) {
            this.currInstantIndex++;
            this.previousInstant = this.currInstant;
            this.currInstant = this.instants[this.currInstantIndex];
        }
        this.onMidAnimation(instant);
    }

    apply() {
        throw new Error("Apply method of abstract class animation called");
    }
}
