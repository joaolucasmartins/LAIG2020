class Node {
    constructor(scene, id, texture, material) {
        this.id = id;
        this.texture = texture;
        this.afs = 1; //texture amplification
        this.aft = 1; //texture aplification
        this.material = material;
        this.descendantNames = []; // Temporary, to be used as placeholder for nodes not yet constructed
        this.descendants = [];
        this.primitives = [];
        this.transfMat = mat4.create();//matrix with all of the nodes tranformations
        this.scene = scene;
    }

    addPrimitive(leaf) {
        this.primitives.push(leaf);
    }

    updateTexture(texture, afs, aft) {
        this.texture = texture;
        this.aft = aft;
        this.afs = afs;
    }

    setMaterial(mat) {
        this.material = mat;
    }

    display() {

        //TODO: create texture stack
        //TODO: create material satck and apply material

        if (this.texture != null) { //temporary
            this.texture.bind(0);
        }

        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMat);

        for (var i = 0; i < this.descendants.length; i++) {
            this.descendants[i].display();
        }

        for (var i = 0; i < this.primitives.length; i++) {
            this.primitives[i].display();
        }
        this.scene.popMatrix();

    }
}
