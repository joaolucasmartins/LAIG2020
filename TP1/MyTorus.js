/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 TODO
 */
class MyTorus extends CGFobject {
    constructor(scene, innerRadius, outerRadius, slices, loops) {
        super(scene);
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    rotatePointInZ(point, alpha) {
        var x = point[0], y = point[1], z = point[2];
        var new_point = [
            x * Math.cos(alpha) - y * Math.sin(alpha),
            x * Math.sin(alpha) + y * Math.cos(alpha),
            z
        ];
        return new_point;
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var innerDelta = (2 * Math.PI) / this.slices;
        var outerDelta = (2 * Math.PI) / this.loops;
        var curInnerAlpha = 0;
        var curOuterAlpha = 0;

        // Vertices
        var n = 0;
        for (var i = 0; i < this.loops; ++i) {
            var center = [
                Math.cos(curOuterAlpha) * this.outerRadius,
                Math.sin(curOuterAlpha) * this.outerRadius,
                0];

            for (var j = 0; j < this.slices; ++j) {
                var pointInzOx = [Math.cos(curInnerAlpha) * this.innerRadius, 0,
                Math.sin(curInnerAlpha) * this.innerRadius];

                var pointRotated = this.rotatePointInZ(pointInzOx, curOuterAlpha);
                var newPoint = [pointRotated[0] + center[0], pointRotated[1] + center[1], pointRotated[2] + center[2]];
                //console.log(newPoint);

                this.vertices.push(newPoint[0], newPoint[1], newPoint[2]);
                this.normals.push(pointRotated[0], pointRotated[1], pointRotated[2]);
                curInnerAlpha += innerDelta;
            }
            curInnerAlpha = 0;
            curOuterAlpha += outerDelta;
        }


        // Indeces
        for (var i = 0; i < this.loops; ++i) {
            for (var j = 0; j < this.slices; ++j) {
                var one = j + i * this.slices;
                var two = (j + 1) % this.slices + i * this.slices;
                var three = (one + this.slices) % (this.slices * this.loops)
                var four = (two + this.slices) % (this.slices * this.loops)
                console.log(one, two, three, four + "---", i, this.slices);
                this.indices.push(three, one, two);
                this.indices.push(four, three, two);
                //console.log(i, j);
            }
        }
        console.log(this.loops)

        this.texCoords = [];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

