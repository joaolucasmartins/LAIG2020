/**
 * NullMaterial
 * Null material representation (explained in Node.js)
 */
class NullMaterial {
    constructor() {
        this.parentTexture = null;
    }

    /**
     * Apply material if defined.
     */
    apply() {
        if (this.parentMaterial != undefined)
            this.parentMaterial.apply();
    }
}
