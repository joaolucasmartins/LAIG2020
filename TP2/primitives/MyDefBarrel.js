/**
 * Returns a rotation in Z matrix with given degrees
 * @param {float} degrees 
 */
function getRotMatrix(degrees) {
    let mat = mat4.create();
    mat4.rotateZ(mat, mat, degrees);
    console.log(mat);
    return mat;
}

/**
 * Rotates a point arround the Z axis.
 * @param {vec3} point 
 * @param {float} alpha 
 */
function rotatePointInZ(point, alpha) {
    var x = point[0], y = point[1], z = point[2];
    var new_point = [
        x * Math.cos(alpha) - y * Math.sin(alpha),
        x * Math.sin(alpha) + y * Math.cos(alpha),
        z
    ];
    return new_point;
}

// TODO
function radToDeg(rad) {
    // 180 - pi
    // deg - rad
    return (180 * rad) / Math.PI;
}

/**
 * MyDefBarrel
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} u  - number of u divisions
 * @param {integer} v - number of v divisions
 */
class MyDefBarrel extends CGFobject {
    static ALPHA = 20; // Default value of tilt if not given
    static rotMatrix = getRotMatrix(Math.PI);
    constructor(scene, base, middle, height, slices, stacks, tilt = MyDefBarrel.ALPHA) {
        super(scene);

        const H = (4 / 3) * (middle - base);
        // Moved in x by r/bottom to be rotated in Z later
        const baseQ = [
            [0, 0, 0],
            [H, 0, H / Math.tan(tilt)],
            [H, 0, height - H / Math.tan(tilt)],
            [0, 0, height],
        ];
        console.log('H', H);
        console.log('baseQ', baseQ);

        const newH = 4 * base / 3;
        const nh = (16 * middle - 4 * base) / 9;
        const nr = (4 * middle - base) / 3;
        const P1 = [-base, 0, 0, 1];
        const P2 = [-base, newH, 0, 1];
        const P3 = [base, newH, 0, 1];
        const P4 = [base, 0, 0, 1];
        const PList = [P1, P2, P3, P4];

        let controlPoints = [];
        for (let j = 0; j < 4; ++j) {
            let currentP = PList[j];
            let currentPx = currentP[0], currentPy = currentP[1];

            let rot = Math.atan(currentPy / currentPx);
            if (currentPx < 0)
                rot = Math.PI + rot;
            console.log(rot);
            let res = [];
            for (let k = 3; k >= 0; --k) {
                let Q = [0, 0, 0];
                if (k == 1 || k == 2) {
                    Q[2] = baseQ[k][2];
                    if (j == 1) {
                        Q[0] = - nr;
                        Q[1] = nh;
                    }
                    else if (j == 2) {
                        Q[0] = nr;
                        Q[1] = nh;
                    }
                    else {
                        Q = rotatePointInZ(baseQ[k], rot);
                        Q[0] += currentPx;
                        Q[1] += currentPy;
                    }
                }
                else {
                    Q = rotatePointInZ(baseQ[k], rot);
                    Q[0] += currentPx;
                    Q[1] += currentPy;
                }
                Q.push(1);
                res.push(Q);
            }

            controlPoints.push(res);
        }

        console.log('CP', controlPoints);
        var surface = new CGFnurbsSurface(3, 3, controlPoints);
        this.obj = new CGFnurbsObject(scene, slices, stacks, surface);
    }

    display() {
        this.obj.display();
        this.scene.pushMatrix();
        this.scene.multMatrix(MyDefBarrel.rotMatrix);
        this.obj.display();
        this.scene.popMatrix();
    }
}
