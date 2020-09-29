class Node {
    constructor(id, texture, material) {
        this.id = id;
        this.texture = texture;
        this.material = material;
        this.descendantNames = []; // Temporary, to be used as placeholder for nodes not yet constructed
        this.descendants = [];
        this.primitives = [];
    }

    addPrimitive(leaf) {
        this.primitives.push(leaf);
    }

    display() {

        for (var i = 0; i < this.descendants.length; i++) {
            this.descendants[i].display();
        }

        for (var i = 0; i < this.primitives.length; i++) {
            this.primitives[i].display();
        }
    }
}
