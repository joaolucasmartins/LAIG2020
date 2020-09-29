class MyCylinder extends CGFobject {
    constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
        super(scene);
        this.radius = bottomRadius; //TODO
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = []; // TODO tex coords
        // TODO Clean dis

        var heightDelta = this.height / this.stacks;
        var rotationDelta = (2 * Math.PI) / this.slices;
        var z = 0;
        for (var i = 0; i < this.stacks + 1; ++i) {
            var theta = 0;
            for (var j = 0; j < this.slices; ++j) {
                this.vertices.push(Math.cos(theta), Math.sin(theta), z)
                this.normals.push(Math.cos(theta), Math.sin(theta), z)
                theta += rotationDelta;
            }
            z += heightDelta;
        }
        var bottom_vertex = (this.slices - 1) * this.stacks;
        this.vertices.push(0, 0, 0); this.normals.push(0, 0, -1); // Bottom Vertex
        var top_vertex = (this.slices - 1) * this.stacks + 1;
        this.vertices.push(0, 0, this.height); this.normals.push(0, 0, 1); // Top Vertex

        // Face
        for (var i = 0; i < this.stacks; ++i) {
            for (var j = 0; j < this.slices - 1; ++j) {
                var one = j + i * this.slices;
                var two = j + i * this.slices + 1;
                var three = j + (i + 1) * this.slices;
                var four = j + (i + 1) * this.slices + 1;
                this.indices.push(one, two, four);
                this.indices.push(one, four, three);
            }
            var one = i * this.slices;
            var two = (i + 1) * this.slices;
            var three = (i + 1) * this.slices - 1;
            var four = (i + 2) * this.slices - 1;
            this.indices.push(one, two, four);
            this.indices.push(one, four, three);
        }

        for (var j = 0; j < this.slices; ++j) {
            var one = j;
            var two = (j + 1) % this.slices;
            var new_one = one + this.slices * (this.stacks);
            var new_two = two + this.slices * (this.stacks);
            this.indices.push(two, one, bottom_vertex);
            this.indices.push(new_one, new_two, top_vertex);
        }

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
