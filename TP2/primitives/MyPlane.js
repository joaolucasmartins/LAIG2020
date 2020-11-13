/**
 * MyRectangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} y1 - y coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} y2 - y coordinate corner 2
 */
class MyPlane extends CGFobject {

    constructor(scene, u, v) {
        super(scene);
        this.u = u;
        this.v = v;

        var controlPoints = [
            [
                [0.5, 0, -0.5, 1],
                [0.5, 0, 0.5, 1]
            ],

            [
                [-0.5, 0, -0.5, 1],
                [-0.5, 0, 0.5, 1]
            ]
        ]

        //u degree and v degree = 0 (plane)
        var surface = new CGFnurbsSurface(1,1, controlPoints);

        this.obj = new CGFnurbsObject(scene, this.u, this.v, surface);

    }

    display() {
        this.obj.display();
    }


}

