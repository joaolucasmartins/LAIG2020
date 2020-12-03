/**
 * ClearTexture
 * Clear texture representation (explained in Node.js)
 */
class ClearTexture {
    constructor() {
        this.parentTexture = null;
        this.pushedTexture = false;
    }

    pushStack(textStack) {
        this.parentTexture = textStack[textStack.length - 1];
        textStack.push(this);
        this.pushedTexture = true;
    }

    popStack(textStack) {
        if (this.pushedTexture) {
            textStack.pop();
            this.parentTexture = null;
            this.pushedTexture = false;
        }
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
