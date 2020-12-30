const Y_ELEVATION = 2;
class MyCameraAnimation extends MyAnimation {
    constructor(scene, sourceCamera, destCamera, time) {
        let startingPosition = sourceCamera.getPosition();
        let finalPosition = destCamera.getPosition();
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
        elements[time * 3 / 10] = middlePosition1;
        elements[time * 7 / 10] = middlePosition2;
        elements[time] = finalPosition;
        console.log(elements);
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
        let prevPosition = this.elements[this.previousInstant];
        let nextPosition = this.elements[this.currInstant];
        let res = [];
        for (let i = 0; i < 3; ++i) {
            res.push(prevPosition[i] + (nextPosition[i] - prevPosition[i]) * weight); // ????
        }
        res.push(0);

        this.sourceCamera.setPosition(res);
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
