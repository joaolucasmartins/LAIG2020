class NullMaterial {
    constructor() {
        this.parentTexture = null;
    }

    apply() {
        if (this.parentMaterial != undefined)
            this.parentMaterial.apply();
    }
}
