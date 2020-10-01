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
        var z = 0, theta = 0; var v = 0;
        var texStepX = 1.0 / (this.slices - 1); var texStepY = 1.0 / (this.stacks);
        var texCurrX = 0; var texCurrY = 0;

        /* Set vertices */
        for (var i = 0; i < this.stacks + 1; ++i) {
            for (var j = 0; j < this.slices; ++j) {
                this.vertices.push(Math.cos(theta) * radius, Math.sin(theta) * radius, z)
                this.normals.push(Math.cos(theta) * radius, Math.sin(theta) * radius, z)
                theta += rotationDelta;
                //console.log(v++);

                //console.log(texCurrY + " " + texCurrX);
                this.texCoords.push(texCurrX, texCurrY);
                texCurrX += texStepX;
            }
            console.log("-");
            z += heightDelta;
            radius += radiusDelta;
            texCurrY += texStepY;
            theta = 0; texCurrX = 0;
        }
        console.log("-----");
        /*
         *var bottom_vertex = (this.slices) * (this.stacks + 1);
         *this.vertices.push(0, 0, 0); this.normals.push(0, 0, -1); // Bottom Vertex
         *this.texCoords.push(0.45, 1); // FIXME texcoords in base
         *var top_vertex = bottom_vertex + 1;
         *this.vertices.push(0, 0, this.height); this.normals.push(0, 0, 1); // Top Vertex
         *this.texCoords.push(0.45, 0);
         */

        /* Push Indeces */
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

        //for (var j = 0; j < this.slices; ++j) {
        //var one = j;
        //var two = (j + 1) % this.slices;
        //var new_one = one + this.slices * (this.stacks);
        //var new_two = two + this.slices * (this.stacks);
        //console.log(one, two, new_one, new_two, bottom_vertex, top_vertex);
        //this.indices.push(two, one, bottom_vertex);
        //this.indices.push(new_one, new_two, top_vertex);
        //}

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
