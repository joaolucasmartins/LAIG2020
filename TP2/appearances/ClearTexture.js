/**
 * ClearTexture
 * Clear texture representation (explained in Node.js)
 */
class ClearTexture {
    constructor() {
        this.parentTexture = null;
    }

    /**
     * Apply texture if defined.
     */
    bind() {
        if (this.parentTexture != undefined) {
            this.parentTexture.unbind();
        }
    }

    /**
     * Remove texture if defined.
     */
    unbind() {
        if (this.parentTexture != undefined)
            this.parentTexture.bind();
    }
}
