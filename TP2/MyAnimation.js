class MyAnimation {
    constructor(scene, elements) {
        this.elements = elements; // What instances are mapped to
        this.scene = scene;
        this.instants = Object.keys(this.elements);
    }

    update(frame) {
        throw new Error("Update method of abstract class animation called");
    }

    apply() {
        throw new Error("Apply method of abstract class animation called");
    }
}
