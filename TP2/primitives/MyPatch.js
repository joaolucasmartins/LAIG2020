/**
 * My Patch
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} u  - number of u divisions
 * @param {integer} v - number of v divisions
 */
class MyPatch extends CGFobject {

    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.degreeU = npointsU-1; //curv degree is number of points -1
        this.degreeV = npointsV-1;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        console.log(this.degreeU, this.degreeV, npartsU, npartsV);

        var surface = new CGFnurbsSurface(this.degreeU, this.degreeV, controlPoints);

        this.obj = new CGFnurbsObject(scene, this.npartsU, this.npartsV, surface);

    }

    display() {
        this.obj.display();
    }

}

