class NullMaterial {
    constructor() {
    }

    apply() {
        if (this.parentMaterial != undefined)
            this.parentMaterial.apply();
    }
}
