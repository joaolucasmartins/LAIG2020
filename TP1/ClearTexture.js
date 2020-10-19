class ClearTexture {
    constructor() {
        this.parentTexture = null;
    }

    bind() {
        if (this.parentTexture != undefined) {
            this.parentTexture.unbind();
        }
    }

    unbind() {
        if (this.parentTexture != undefined)
            this.parentTexture.bind();
    }
}
