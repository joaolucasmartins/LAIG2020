class Node {
    constructor(scene, id, textureId, materialId) {
        this.id = id;
        this.textureId = textureId;
        this.afs = 1; //texture amplification
        this.aft = 1; //texture aplification
        this.materialId = materialId;
        this.descendantNames = []; // Temporary, to be used as placeholder for nodes not yet constructed/parsed
        this.descendants = [];
        this.primitives = [];
        this.transfMat = mat4.create();//matrix with all of the nodes tranformations
        this.scene = scene;
    }

    addPrimitive(leaf) {
        this.primitives.push(leaf);
    }

    updateTexture(textureId, afs, aft) {
        this.textureId = textureId;
        this.aft = aft;
        this.afs = afs;
    }

    display(parentTexture, parentMaterial) { // Equivalente do ProcessNode explicado nas teóricas
        // Get textures and materials from scene
        var texture;
        // TODO Optimization or organization?
        if (this.textureId == "clear") {
            if (parentTexture != undefined)
                parentTexture.unbind();
        }
        else if (this.textureId == "null") {
            if (parentTexture != undefined) {
                parentTexture.bind();
                texture = parentTexture;
            }
        }
        else {
            texture = this.scene.graph.textDict[this.textureId];
            texture.bind();
        }

        var material;

        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMat);

        for (var i = 0; i < this.primitives.length; i++) {
            this.primitives[i].display();
        }

        // Draw leafs and nodes
        for (var i = 0; i < this.descendants.length; i++) {
            this.descendants[i].display(texture, material);
        }

        // Restore Scene
        this.scene.popMatrix();

        if (this.textureId == "clear") {
            if (parentTexture != undefined)
                parentTexture.bind();
        }
        else if (this.textureId == "null") {
            if (parentTexture != undefined) {
                parentTexture.unbind();
            }
        }
        else {
            texture.unbind();
        }
    }
}
