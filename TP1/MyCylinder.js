/**
 * MyCylinder
 * @constructor
 * @param {GCFscene} scene - Reference to MyScene object
 * @param {float} bottomRadius
 * @param {float} topRadius
 * @param {float} height
 * @param {integer} slices
 * @param {integer} stacks
 */
class MyCylinder extends CGFobject {
    constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
        super(scene);
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;

        this.initBuffers();
    }

    initBuffers() {
        /* Initialization */
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = []; // TODO tex coords of bases
        // Aux Variables
        var radius = this.bottomRadius; var radiusDelta = (this.topRadius - this.bottomRadius) / this.stacks;
        var heightDelta = this.height / this.stacks;
        var rotationDelta = (2 * Math.PI) / this.slices;
        var z = 0, theta = 0;
        var texStepX = 1.0 / (this.slices); var texStepY = 1.0 / (this.stacks);
        var texCurrX = 0; var texCurrY = 1;

        var v = 0;
        /* Set vertices */
        /* Face */
        for (var i = 0; i < this.stacks + 1; ++i) {
            for (var j = 0; j < this.slices + 1; ++j) {
                this.vertices.push(Math.cos(theta) * radius, Math.sin(theta) * radius, z);
                this.normals.push(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
                theta += rotationDelta;

                this.texCoords.push(texCurrX, texCurrY);
                texCurrX += texStepX;
            }
            z += heightDelta;
            radius += radiusDelta;
            texCurrY -= texStepY;
            theta = 0; texCurrX = 0;
        }
        /* Top and Bottom Bases */
        var bottom_vertex = (this.slices + 1) * (this.stacks + 1);
        this.vertices.push(0, 0, 0); this.normals.push(0, 0, -1); // Bottom Vertex
        this.texCoords.push(0.5, 0.5);
        var top_vertex = bottom_vertex + 1;
        this.vertices.push(0, 0, this.height); this.normals.push(0, 0, 1); // Top Vertex
        this.texCoords.push(0.5, 0.5);

        theta = 0;
        for (var j = 0; j < this.slices + 1; ++j) {
            /* Base's texture is a circumference with center 0.5 0.5 and radius 0.5 */
            texCurrX = 0.5 * (Math.cos(theta) + 1);
            texCurrY = 0.5 * (Math.sin(-theta) + 1);

            this.vertices.push(Math.cos(theta) * this.bottomRadius, Math.sin(theta) * this.bottomRadius, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(1 - texCurrX, texCurrY);
            this.vertices.push(Math.cos(theta) * this.topRadius, Math.sin(theta) * this.topRadius, this.height);
            this.normals.push(0, 0, 1);
            this.texCoords.push(texCurrX, texCurrY);
            theta += rotationDelta;
        }

        /* Push Indeces */
        for (var i = 0; i < this.stacks; ++i) {
            for (var j = 0; j < this.slices; ++j) {
                var one = j + i * (this.slices + 1);
                var two = one + 1;
                var three = one + (this.slices + 1);
                var four = two + (this.slices + 1);
                this.indices.push(one, two, four);
                this.indices.push(four, three, one);
            }
        }
        for (var j = 1; j < 2 * this.slices + 1; j = j + 2) {
            var one_bottom = top_vertex + j;
            var two_bottom = top_vertex + 2 + j;
            var one_top = one_bottom + 1;
            var two_top = two_bottom + 1;
            this.indices.push(two_bottom, one_bottom, bottom_vertex);
            this.indices.push(one_top, two_top, top_vertex);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
