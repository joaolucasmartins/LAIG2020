/**
 * MyDefBarrel
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} base  - radius of the base
 * @param {float} middle - radius of the middle of the barrel
 * @param {float} height - height of the barrel
 * @param {integer} slices - number of cuts in X
 * @param {integer} stacks - number of cuts in Y
 * @param {float} tilt - angle between Q1Q2 and Q1Q4. Defaults to 20
 */
class MyDefBarrel extends CGFobject {
    static ALPHA = 20; // Default value of tilt if not given
    constructor(scene, base, middle, height, slices, stacks, tilt = MyDefBarrel.ALPHA) {
        super(scene);

        // max and min ensure that middle Q2 and Q3 don't surpass the middle of the barrel
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
                [-base, 0, 0], // P1
                [-base, h, 0], // P2
                [base, h, 0],  // P3
                [base, 0, 0]   // P4
            ];

        let controlPoints = [];
        for (let j = 3; j >= 0; --j) { // For each P
            let currentP = PList[j];
            let currentPx = currentP[0], currentPy = currentP[1];
            let signal = 1;
            if (currentPx < 0) // If P1 or P2, all increments must be done -x wise
                signal = -1;

            let res = [];
            for (let k = 0; k < 4; ++k) { // For each Q 
                let Q = [...baseQ[k]];
                Q[0] = currentPx + Q[0] * signal;
                Q[1] = currentPy + Q[1] * signal;
                Q.push(1);
                res.push(Q);
            }

            controlPoints.push(res);
        }

        // nr and nh are to the Q points the equivalent of r and h to the P points.
        // We got these measures by creating a convex hull that passes through the middle
        // of the barrel (R).
        const nr = base + H;
        const nh = (4 / 3) * nr;
        for (let j = 0; j < 2; ++j) { // Iterate trough Q2 and Q3
            let P2_Points = controlPoints[1];
            let P3_Points = controlPoints[2];
            //P2_Points[1 + j][0] = - nr; Not necessary as it is already done when previously incrementing H
            //P3_Points[1 + j][0] = nr;   Still left it here for better readability
            P2_Points[1 + j][1] = nh;
            P3_Points[1 + j][1] = nh;
        }

        var surface = new CGFnurbsSurface(3, 3, controlPoints);
        this.obj = new CGFnurbsObject(scene, slices, stacks, surface);
    }

    display() {
        this.obj.display();
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.obj.display();
        this.scene.popMatrix();
    }
}
