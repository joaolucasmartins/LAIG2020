class MyCameraAnimation extends MyAnimation {
    constructor(scene, sourceCamera, destCamera, time) {
        let elements = {};
        elements[0] = sourceCamera;
        elements[time] = destCamera;
        super(scene, elements);
        this.sourceCamera = sourceCamera;
        this.destCamera = destCamera;
    }

    onBeforeAnimation() {}

    onEndAnimation() {
        if (!this.swiched) {
            this.sourceCamera.reset();
            this.swiched = true;
        }
    }

    onMidAnimation(instant) {
        let weight = (instant - this.previousInstant) / (this.currInstant - this.previousInstant);

        this.sourceCamera.interpolate(weight, this.destCamera);
    }

    update(time) {
        super.update(time);
    }

    apply() {
        this.scene.scale(...this.currentTransformation.scale);
        this.scene.translate(...this.currentTransformation.translation);
        for (var i = 0; i < 3; ++i) {
            if (this.currentTransformation.rotation[i] != 0) {
                this.scene.rotate(this.currentTransformation.rotation[i], ...Transformation.selectAxis[i]);
            }
        }
    }
}
