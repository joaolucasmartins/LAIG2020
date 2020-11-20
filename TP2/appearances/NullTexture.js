/**
 * NullTexture
 * Null texture representation (explained in Node.js)
 */
class NullTexture {
    constructor() {
        this.parentMaterial = null;
    }

    /**
     * Get parent texture from stack
     */
    pushStack(matStack) {
        this.parentMaterial = matStack[matStack.length - 1];
    }

    popStack() {
        this.parentMaterial = null;
    }

    /**
     * Apply texture in defined
     */
    bind() {
        if (this.parentMaterial != undefined)
            this.parentMaterial.bind();
    }

    /**
     * Remove texture if defined
     */
    unbind() {
        if (this.parentMaterial != undefined)
            this.parentMaterial.unbind();
    }
}
