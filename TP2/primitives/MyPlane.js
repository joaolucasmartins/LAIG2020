/**
 * My Plane
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} u  - number of u divisions
 * @param {integer} v - number of v divisions
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

