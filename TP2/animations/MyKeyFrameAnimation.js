class MyKeyFrameAnimation extends MyAnimation {
    constructor(scene, transformations) {
        if (!(0 in transformations)) {
            transformations[0] = Transformation.newEmptyTransformation();
        }
        super(scene, transformations);

        this.initialInstant = null;
        if (transformations.length == 0)
            this.currentTransformation = null; // Updated by update()
        else {
            this.currentTransformation = transformations[0];
        }
    }

    onBeforeAnimation() {
        this.currentTransformation = this.elements[super.getInitialInstant()];
    }
    onEndAnimation() {
        this.currentTransformation = this.elements[super.getLastInstant()];
    }
    onMidAnimation(instant) {
        var weight = (instant - this.previousInstant) / (this.currInstant - this.previousInstant);
        var prevTransformation = this.elements[this.previousInstant];
        var nextTransformation = this.elements[this.currInstant];
        this.currentTransformation = prevTransformation.interpolate(nextTransformation, weight)
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


class Transformation {
    static selectAxis = [
        [1, 0, 0], // Select X
        [0, 1, 0], // Select Y
        [0, 0, 1]  // Select Z
    ];

    constructor(transformations) {
        this.translation = transformations[0];
        this.rotation = transformations[1];
        this.scale = transformations[2];
    }

    static newEmptyTransformation() {
        return new Transformation([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]);
    }

    /* Apply a transformation after 'this' transformation with given weight */
    interpolate(applyTransf, weight) {
        if (applyTransf == null)
            return this;

        var resTranslation = [], resRotation = [], resScale = [];
        for (var i = 0; i < 3; ++i) {
            resTranslation.push(this.translation[i] + (applyTransf.translation[i] - this.translation[i]) * weight);
            resRotation.push(this.rotation[i] + (applyTransf.rotation[i] - this.rotation[i]) * weight);
            resScale.push(this.scale[i] + (applyTransf.scale[i] - this.scale[i]) * weight);
        }

        var resTransf = new Transformation([resTranslation, resRotation, resScale]);

        return resTransf;
    }
}
