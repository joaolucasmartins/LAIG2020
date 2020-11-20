/**
 * MyTexture (Wrapper for CGFTexture)
 * Normal texture representation (explained in Node.js)
 */
class MyTexture {
    constructor(texture) {
        this.pushedTexture = false;
        this.texture = texture;
    }

    pushStack(textStack) {
        textStack.push(this);
        this.pushedTexture = true;
    }

    popStack(textStack) {
        if (this.pushedTexture) {
            textStack.pop();
            this.pushedTexture = false;
        }
    }

    /**
     * Apply texture if defined.
     */
    bind() {
        this.texture.bind();
    }

    /**
     * Remove texture if defined.
     */
    unbind() {
        this.texture.unbind();
    }
}
