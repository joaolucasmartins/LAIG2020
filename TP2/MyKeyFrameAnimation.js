class MyKeyFrameAnimation extends MyAnimation {
    constructor(scene, transformations) {
        super(scene, transformations);

        this.initialInstant = null;
        if (transformations.length == 0)
            this.currentTransformation = null; // Updated by update()
        else {
            this.currentTransformation = transformations[0];
        }
    }

    update(time) {
        if (this.initialInstant == null)
            this.initialInstant = time;

        var instant = (time - this.initialInstant) / 1000;
        var instants = Object.keys(this.transformations);

        if (instant <= instants[0]) {
            this.currentTransformation = this.transformations[0];
            return;
        }
        if (instant >= instants[instants.length - 1]) {
            this.currentTransformation = this.transformations[instants[instants.length - 1]];
            return;
        }

        var prevTransformation, nextTransformation,
            initialInstant, endInstant;
        for (var i = 0; i < instants.length - 1; ++i) {
            if (instant >= instants[i] && instant <= instants[i + 1]) {
                initialInstant = instants[i];
                prevTransformation = this.transformations[initialInstant];
                endInstant = instants[i + 1];
                nextTransformation = this.transformations[endInstant];
            }
        }

        var weight = (instant - initialInstant) / (endInstant - initialInstant);
        this.currentTransformation = prevTransformation.interpolate(nextTransformation, weight)
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
