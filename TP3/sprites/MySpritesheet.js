class MySpritesheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.texture = new CGFtexture(scene, texture);
        if (this.texture == null)
            return null;
        this.shader = new CGFshader(this.scene.gl, "shaders/MySpriteShader.vert", "shaders/MySpriteShader.frag");
        this.shader.setUniformsValues({ sizeM: sizeM });
        this.shader.setUniformsValues({ sizeN: sizeN });
    }

    activateCellMN(m, n) {
        this.shader.setUniformsValues({ m: m });
        this.shader.setUniformsValues({ n: n });
        this.scene.setActiveShader(this.shader);
        this.texture.bind();
    }

    activateCellP(p) {
        this.activateCellMN(Math.floor(p / this.sizeM), p % this.sizeN);
    }
}
