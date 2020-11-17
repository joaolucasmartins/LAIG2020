/**
 * Returns a rotation in Z matrix with given degrees
 * @param {float} degrees 
 */
function getRotMatrix(degrees) {
    let mat = mat4.create();
    mat4.rotateZ(mat, mat, degrees);
    return mat;
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

        // Moved in x by r/bottom to be rotated in Z later
        const H = (4 / 3) * (middle - base);
        const baseQ = [
            [0, 0, 0],
            [H, 0, Math.min(H / Math.tan(tilt), height / 2)],
            [H, 0, Math.max(height - H / Math.tan(tilt), height / 2)],
            [0, 0, height],
        ];

        const h = 4 * base / 3;
        const PList =
            [
                [-base, 0, 0, 1],
                [-base, h, 0, 1],
                [base, h, 0, 1],
                [base, 0, 0, 1]
            ];

        let controlPoints = [];
        for (let j = 0; j < 4; ++j) {
            let currentP = PList[j];
            let currentPx = currentP[0], currentPy = currentP[1];
            let signal = 1;
            if (currentPx < 0)
                signal = -1;

            let res = [];
            for (let k = 3; k >= 0; --k) {
                let Q = [...baseQ[k]];
                Q[0] = currentPx + Q[0] * signal;
                Q[1] = currentPy + Q[1] * signal;
                Q.push(1);
                res.push(Q);
            }

            controlPoints.push(res);
        }

        const nr = base + H;
        const nh = (4 / 3) * nr;
        for (let j = 0; j < 2; ++j) { // Iterate trough Q2 and Q3
            let P2_Points = controlPoints[1];
            let P3_Points = controlPoints[2];
            P2_Points[1 + j][0] = - nr;
            P2_Points[1 + j][1] = nh;
            P3_Points[1 + j][0] = nr;
            P3_Points[1 + j][1] = nh;
        }

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
