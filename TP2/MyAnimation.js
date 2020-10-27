class MyAnimation {
    constructor(instants, transformations) {
        this.transformations = {}
        for (var i = 0; i < instants.length; ++i) {
            this.transformations[instants[i]] = transformations[i];
        }
    }

    update(frame) {
        throw new Error("Update method of abstract class animation called");
    }

    apply() {
        throw new Error("Apply method of abstract class animation called");
    }
}

class Transformation {
    constructor(transformations) {
        this.translation = transformations[0];
        this.rotation = transformations[1];
        this.scale = transformations[2];
    }

    /* Apply a transformation after 'this' transformation with given weight */
    interpolate(applyTransf, weight) {
        if (applyTransf == null)
            return this;

        var resTranslation = [], resRotation = [], resScale = [];
        for (var i = 0; i < 3; ++i) {
            resTranslation.push(this.translation[i] + applyTransf.translation[i] * weight);
            resRotation.push(this.rotation[i] + applyTransf.rotation[i] * weight);
            resScale.push(this.scale[i] + applyTransf.scale[i] * weight);
        }

        var resTransf = new Transformation([resTranslation, resRotation, resScale]);

        return resTransf;
    }
}
