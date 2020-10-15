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
        this.texCoords = [];

        var innerDelta = (2 * Math.PI) / this.slices;
        var outerDelta = (2 * Math.PI) / this.loops;
        var curInnerAlpha = 0;
        var curOuterAlpha = 0;
        var texStepX = 1.0 / (this.slices); var texStepY = 1.0 / (this.loops);
        var texCurrX = 0; var texCurrY = 0;

        // Vertices
        for (var i = 0; i <= this.loops; ++i) {
            var center = [
                Math.cos(curOuterAlpha) * this.outerRadius,
                Math.sin(curOuterAlpha) * this.outerRadius,
                0];

            for (var j = 0; j <= this.slices; ++j) {
                var pointInzOx = [Math.cos(curInnerAlpha) * this.innerRadius, 0,
                Math.sin(curInnerAlpha) * this.innerRadius];

                var pointRotated = this.rotatePointInZ(pointInzOx, curOuterAlpha);
                var newPoint = [pointRotated[0] + center[0], pointRotated[1] + center[1], pointRotated[2] + center[2]];

                this.vertices.push(newPoint[0], newPoint[1], newPoint[2]);
                this.normals.push(pointRotated[0], pointRotated[1], pointRotated[2]);
                this.texCoords.push(texCurrX, texCurrY);
                texCurrX += texStepX;
                curInnerAlpha += innerDelta;
            }
            curInnerAlpha = 0;
            curOuterAlpha += outerDelta;
            texCurrX = 0;
            texCurrY += texStepY;
        }

        for (var i = 0; i < this.loops; ++i) {
            for (var j = 0; j < this.slices; ++j) {
                var one = j + i * (this.slices + 1);
                var two = one + 1;
                var three = one + this.slices + 1;
                var four = two + this.slices + 1;
                this.indices.push(one, three, four);
                this.indices.push(one, four, two);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

