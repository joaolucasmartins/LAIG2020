class MyCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            0.5, -0.5, 0.5,	  //0
            0.5, -0.5, -0.5,  //1
            -0.5, -0.5, -0.5,	//2
            -0.5, -0.5, 0.5,	//3
            0.5, 0.5, 0.5,	  //4
            0.5, 0.5, -0.5,   //5
            -0.5, 0.5, -0.5,	//6
            -0.5, 0.5, 0.5,	  //7
        ];

        //Counter-clockwise reference of vertices (regra mao direita)
        // definimos 2 triangulos => 1 losango
        this.indices = [
            0, 2, 1,
            0, 3, 2,
            7, 4, 6,
            4, 5, 6,
        ];
        for (var i = 0; i < 4; i++) {
            this.indices.push(i);
            this.indices.push((i + 1) % 4);
            this.indices.push(i + 4);

            this.indices.push((i + 1) % 4);
            this.indices.push(((i + 1) % 4) + 4);
            this.indices.push(i + 4);
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;
        // this.primitiveType = this.scene.gl.LINES;

        this.initGLBuffers();
    }
}

