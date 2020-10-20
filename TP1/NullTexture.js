/**
 * NullTexture
 * Null texture representation (explained in Node.js)
 */
class NullTexture {
    constructor() {
        this.parentTexture = null;
    }

    /**
     * Apply texture in defined
     */
    bind() {
        if (this.parentTexture != undefined)
            this.parentTexture.bind();
    }

    /**
     * Remove texture if defined
     */
    unbind() {
        if (this.parentTexture != undefined)
            this.parentTexture.unbind();
    }
}
