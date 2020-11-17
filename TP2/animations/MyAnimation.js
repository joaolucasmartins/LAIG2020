class MyAnimation {
    constructor(scene, elements,) {
        this.elements = elements; // What instances are mapped to
        this.scene = scene;
        this.instants = Object.keys(elements).map(parseFloat); // Cast String keys to float

        this.initialInstant = null;

        // Sort instances so that we evaluate them in order
        this.instants.sort(function (a, b) {
            return a - b;
        });
    }

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
        if (this.initialInstant == null)
            this.initialInstant = time;

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
