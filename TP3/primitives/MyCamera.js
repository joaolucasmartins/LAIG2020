class MyCamera {
    constructor(camera) {
        this.cgfCamera = camera;
        this.defaultValues = [[...camera.position], [...camera.target]];
        console.log(camera.target, camera.position);
    }

    getPosition() {return this.cgfCamera.position}
    getTarget() {return this.cgfCamera.target}

    reset() {
        let [position, target] = this.defaultValues;
        this.cgfCamera.setPosition(position);
        this.cgfCamera.setTarget(target);
    }

    interpolate(weight, camera) {
        let initPos = this.defaultValues[0];
        let destPos = camera.getPosition();
        let vec = [
            initPos[0] + (destPos[0] - initPos[0]) * weight,
            initPos[1] + (destPos[1] - initPos[1]) * weight,
            initPos[2] + (destPos[2] - initPos[2]) * weight,
            0
        ];
        console.log(initPos, destPos);

        this.cgfCamera.setPosition(vec);
    }
}
