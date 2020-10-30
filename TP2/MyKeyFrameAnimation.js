class MyKeyFrameAnimation extends MyAnimation {
    static selectAxis = [
        [1, 0, 0], // Select X
        [0, 1, 0], // Select Y
        [0, 0, 1]  // Select Z
    ];

    constructor(instants, transformations, scene) {
        super(instants, transformations, scene);

        if (transformations.length == 0)
            this.currentTransformation = null; // Updated by update()
        else {
            this.currentTransformation = transformations[0];
        }
    }

    update(instant) {
        var instants = Object.keys(this.transformations);

        if (instant <= instants[0])
            return this.transformations[0];
        if (instant >= instants[instants.length - 1])
            return this.transformations[instants.length - 1];

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
        this.scene.scale(...this.scale);
        this.scene.translate(...this.translation);
        for (var i = 0; i < 3; ++i) {
            if (this.rotation[i] != 0) {
                this.scene.rotate(this.rotation[i], selectAxis[i]);
            }
        }
    }
}
