class MyAnimation {
    constructor(scene, elements) {
        this.elements = elements; // What instances are mapped to
        this.scene = scene;
        this.instants = Object.keys(elements).map(parseFloat); // Cast String keys to float

        // Sort instances so that we evaluate them in order
        this.instants.sort(function (a, b) {
            return a - b;
        });
    }

    update(frame) {
        throw new Error("Update method of abstract class animation called");
    }

    apply() {
        throw new Error("Apply method of abstract class animation called");
    }
}
