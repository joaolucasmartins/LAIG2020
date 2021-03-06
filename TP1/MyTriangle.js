/**
 * MyTriangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} y1 - y coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} y2 - y coordinate corner 2
 * @param {float} x3 - x coordinate corner 3
 * @param {float} y3 - y coordinate corner 3
 */
class MyTriangle extends CGFobject {
    constructor(scene, x1, y1, x2, y2, x3, y3, afs = 1.0, aft = 1.0) {
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.afs = afs;
        this.aft = aft;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0,	//0
            this.x2, this.y2, 0,	//1
            this.x3, this.y3, 0 	//2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2
        ];

        //Facing Z positive
        this.normals = [
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

        var a, b, c, cosa, sina;
        a = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
        b = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2));
        c = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2));
        cosa = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
        sina = Math.sqrt(1 - Math.pow(cosa, 2));

        this.texCoords = [
            0, 1,
            a / this.afs, 1,
            c * cosa / this.afs, 1 - (c * sina / this.aft)
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
