class NullTexture {
    constructor() {
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
