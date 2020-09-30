class Node {
    constructor(id, texture, material) {
        this.id = id;
        this.texture = texture;
        this.afs = 1; //texture amplification
        this.aft = 1; //texture aplification
        this.material = material;
        this.descendantNames = []; // Temporary, to be used as placeholder for nodes not yet constructed
        this.descendants = [];
        this.primitives = [];
    }

    addPrimitive(leaf) {
        this.primitives.push(leaf);
    }

    updateTexture(texture, afs, aft) {
        this.texture = texture;
        this.aft = aft;
        this.afs = afs;
    }

    display() {
        /*
        if (this.texture != null) { //temporary
            this.texture.bind(2);
        }
        */

        for (var i = 0; i < this.descendants.length; i++) {
            this.descendants[i].display();
        }

        for (var i = 0; i < this.primitives.length; i++) {
            this.primitives[i].display();
        }
    }
}
