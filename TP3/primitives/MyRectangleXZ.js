/**
 * MyRectangleXY
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} z1 - z coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} z2 - z coordinate corner 2
 */
class MyRectangleXZ extends CGFobject {
    constructor(scene, x1, z1, x2, z2, afs = 1.0, aft = 1.0) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.z1 = z1;
        this.z2 = z2;
        this.afs = afs;
        this.aft = aft;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1,  0, this.z1,	//0
            this.x2,  0, this.z1,	//1
            this.x1,  0, this.z2,	//2
            this.x2,  0, this.z2,	//3
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        //Facing Z positive
        this.normals = [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
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
        var dz = Math.sqrt(Math.pow(this.z1 - this.z2, 2));

        this.texCoords = [
            0, 1,
            dx / this.afs, 1,
            0, 1 - dz / this.aft,
            dx / this.afs, 1 - dz / this.aft
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

