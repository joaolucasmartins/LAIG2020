class MyCamera {
    constructor(camera) {
        this.cgfCamera = camera;
        this.defaultValues = [[...camera.position], [...camera.target]];
    }

    getPosition() {return this.cgfCamera.position}
    getTarget() {return this.cgfCamera.target}
    setPosition(position) {this.cgfCamera.setPosition(position); console.log(position)}

    reset() {
        let [position, target] = this.defaultValues;
        this.cgfCamera.setPosition(position);
        this.cgfCamera.setTarget(target);
    }
}
