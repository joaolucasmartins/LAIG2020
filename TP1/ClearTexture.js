class ClearTexture {
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
