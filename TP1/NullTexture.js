class NullTexture {
    constructor() {
        this.parentTexture = null;
    }

    bind() {
        if (this.parentTexture != undefined)
            this.parentTexture.bind();
    }

    unbind() {
        if (this.parentTexture != undefined)
            this.parentTexture.unbind();
    }
}
