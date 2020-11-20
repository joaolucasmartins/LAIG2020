/**
 * NullMaterial
 * Null material representation (explained in Node.js)
 */
class NullMaterial {
    constructor() {
        this.parentMaterial = null;
    }

    pushStack(matStack) {
        this.parentMaterial = matStack[matStack.length - 1];
    }

    popStack() {
        this.parentMaterial = null;
    }

    /**
     * Apply material if defined.
     */
    apply() {
        if (this.parentMaterial != undefined)
            this.parentMaterial.apply();
    }
}
