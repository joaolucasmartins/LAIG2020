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

    update(time) {
        if (this.initialInstant == null)
            this.initialInstant = time;

        var instant = (time - this.initialInstant) / 1000;

        if (instant <= this.instants[0]) {
            this.currentTransformation = this.elements[0];
            return;
        }
        if (instant >= this.instants[this.instants.length - 1]) {
            this.currentTransformation = this.elements[this.instants[this.instants.length - 1]];
            return;
        }

        var prevTransformation, nextTransformation,
            initialInstant, endInstant;
        for (var i = 0; i < this.instants.length - 1; ++i) {
            if (instant >= this.instants[i] && instant <= this.instants[i + 1]) {
                initialInstant = this.instants[i];
                prevTransformation = this.elements[initialInstant];
                endInstant = this.instants[i + 1];
                nextTransformation = this.elements[endInstant];
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
