class MyCamera {
    constructor(id, camera) {
        this.id = id;
        this.cgfCamera = camera;
        this.defaultValues = [[...camera.position], [...camera.target]];
    }

    getPosition() {return this.cgfCamera.position}
    getTarget() {return this.cgfCamera.target}
    setPosition(position) {this.cgfCamera.setPosition(position)}
    setTarget(target) {this.cgfCamera.setTarget(target)}

    reset() {
        let [position, target] = this.defaultValues;
        this.cgfCamera.setPosition(position);
        this.cgfCamera.setTarget(target);
    }
}
