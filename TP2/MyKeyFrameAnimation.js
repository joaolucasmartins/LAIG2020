class MyKeyFrameAnimation extends MyAnimation {
    constructor(instants, transformations) {
        super(instants, transformations);

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
        throw new Error("Apply method of abstract class animation called");
    }
}
