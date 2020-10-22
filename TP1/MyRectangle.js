/**
 * MyRectangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} y1 - y coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} y2 - y coordinate corner 2
 */
class MyRectangle extends CGFobject {
    constructor(scene, x1, y1, x2, y2, afs = 1.0, aft = 1.0) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.afs = afs;
        this.aft = aft;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0,	//0
            this.x2, this.y1, 0,	//1
            this.x1, this.y2, 0,	//2
            this.x2, this.y2, 0		//3
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        //Facing Z positive
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */
        var dx = Math.sqrt(Math.pow(this.x1 - this.x2, 2));
        var dy = Math.sqrt(Math.pow(this.y1 - this.y2, 2));

        this.texCoords = [
            0, 1,
            dx / this.afs, 1,
            0, 1 - dy / this.aft,
            dx / this.afs, 1 - dy / this.aft
        ]

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}

