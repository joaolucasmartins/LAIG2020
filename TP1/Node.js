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

    display(textStack) {

        //TODO: create material satck and apply material

        var text = this.texture;
        if (text == null){ //fetch parent texture
            text = textStack[textStack.length -1];
        }
        
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMat);

        for (var i = 0; i < this.descendants.length; i++) {
            textStack.push(text);
            this.descendants[i].display(textStack);
            textStack.pop();
        }

        for (var i = 0; i < this.primitives.length; i++) {
            text.bind(0);   //apply texture
            this.primitives[i].display();
        }
        
        this.scene.popMatrix();

    }
}
