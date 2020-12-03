/**
 * MyCircle
 * @constructor
 * @param {GCFscene} scene - Reference to MyScene object
 * @param {float} radius
 * @param {integer} slices
 */
class MyCircle extends CGFobject {
    constructor(scene, radius, slices) {
        super(scene);
        this.radius = radius;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers() {
        /* Initialization */
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        // Aux Variables
        var rotationDelta = (2 * Math.PI) / this.slices;
        var theta = 0;
        var texCurrX = 0; var texCurrY = 1;


        /* Origin */
        this.vertices.push(0, 0, 0); this.normals.push(0, 0, -1); // Bottom Vertex
        this.texCoords.push(0.5, 0.5);

        theta = 0;
        for (var j = 0; j < this.slices + 1; ++j) {
            /* texture is a circumference with center 0.5 0.5 and radius 0.5 */
            texCurrX = 0.5 * (Math.cos(theta) + 1);
            texCurrY = 0.5 * (Math.sin(-theta) + 1);

            this.vertices.push(Math.cos(theta) * this.radius, Math.sin(theta) * this.radius, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(1 - texCurrX, texCurrY);
            theta += rotationDelta;
        }

        /* Push Indeces */
        for (var j = 0; j < this.slices; ++j) {
            this.indices.push(1+j, 2+j, 0);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
