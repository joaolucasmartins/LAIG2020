const Y_ELEVATION = 2;
class MyCameraAnimation extends MyAnimation {
    constructor(scene, sourceCamera, destCamera, time) {
        let startingPosition = sourceCamera.getPosition();
        let finalPosition = destCamera.getPosition();
        let elements = MyCameraAnimation.getKeyFrames(startingPosition, finalPosition, time);

        super(scene, elements);
        this.sourceCamera = sourceCamera;
        this.destCamera = destCamera;
    }

    static getKeyFrames(startingPosition, finalPosition, time) {
        let middlePosition1 = [
            startingPosition[0] * 0.6 + finalPosition[0] * 0.4 + 0.1,
            Y_ELEVATION + (startingPosition[1] + finalPosition[1]) / 2,
            startingPosition[2] * 0.6 + finalPosition[2] * 0.4,
        ];
        let middlePosition2 = [
            startingPosition[0] * 0.4 + finalPosition[0] * 0.6 - 0.1,
            Y_ELEVATION + (startingPosition[1] + finalPosition[1]) / 2,
            startingPosition[2] * 0.4 + finalPosition[2] * 0.6
        ];

        let elements = {};
        elements[0] = startingPosition;
        elements[time * 0.9 / 2] = middlePosition1;
        elements[time * 1.1 / 2] = middlePosition2;
        elements[time] = finalPosition;
        return elements;
    }
    onBeforeAnimation() {}

    onEndAnimation() {
        if (!this.swiched) {
            this.sourceCamera.reset();
            this.scene.selectedCamera = this.destCamera.id;
            this.scene.updateCamera();
            this.swiched = true;
        }
    }
    onMidAnimation(instant) {
        let weight = (instant - this.previousInstant) / (this.currInstant - this.previousInstant);
        let prevPosition = this.elements[this.previousInstant];
        let nextPosition = this.elements[this.currInstant];
        let initialTarget = this.sourceCamera.getTarget();
        let destTarget = this.destCamera.getTarget();
        let targetChanged = false;
        let pos = [], target = [];
        for (let i = 0; i < 3; ++i) {
            pos.push(prevPosition[i] + (nextPosition[i] - prevPosition[i]) * weight); // ????
            target.push(initialTarget[i] + (destTarget[i] - initialTarget[i]) * weight); // ????
            if (target[i] != 0)
                targetChanged = true;
        }
        pos.push(0);
        target.push(0);

        this.sourceCamera.setPosition(pos);
        if (targetChanged)
            this.sourceCamera.setTarget(target);
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
