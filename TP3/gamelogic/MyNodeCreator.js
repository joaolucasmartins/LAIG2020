class MyNodeCreator { // Can create any node without animations
    constructor(node) {
        this.id = node.id;
        this.scene = node.scene;

        this.texture = node.texture; // Set to null and not to NullMaterial so that it crashes when there is a parsing problem
        this.afs = node.afs; //texture amplification
        this.aft = node.aft; //texture amplification
        this.material = node.material; // Set to null and not to NullMaterial so that it crashes when there is a parsing problem
        this.transfMat = node.transfMat;//matrix with all of the nodes tranformations

        this.descendants = node.descendants;
        this.primitives = node.primitives;
    }

    create() {
        let node = new Node(this.scene, this.id);

        node.texture = this.texture;
        node.afs = this.afs;
        node.aft = this.aft;
        node.material = this.material;
        node.transfMat = this.transfMat;

        node.descendants = this.descendants;
        node.primitives = this.primitives;

        return node;
    }
}
