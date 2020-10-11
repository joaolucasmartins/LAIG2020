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

    display(matStack, textStack) {
        /* null                 | clear                 | texture
           Dont push to stack   | dont push to Stack    | push to stack
           do nothing           | unbind prev texture   | bind texture
           ------------------   | bind prev texture     | unbind texture*/

        if (this.texture == null) {
            var mat = this.material;
            if (mat == null) {
                mat = matStack[matStack.length - 1];
            }

            this.scene.pushMatrix();
            this.scene.multMatrix(this.transfMat);

            for (var i = 0; i < this.primitives.length; i++) {
                this.primitives[i].display();
            }

            for (var i = 0; i < this.descendants.length; i++) {
                this.descendants[i].display(matStack, textStack);
            }

            this.scene.popMatrix();
        } else if (this.texture == "clear") {
            var text = textStack[textStack.length - 1];

            var mat = this.material;
            if (mat == null) {
                mat = matStack[matStack.length - 1];
            }

            this.scene.pushMatrix();
            this.scene.multMatrix(this.transfMat);

            mat.apply();
            text.unbind();   //apply texture
            textStack.push(text);
            matStack.push(mat);
            for (var i = 0; i < this.primitives.length; i++) {
                this.primitives[i].display();
            }
            for (var i = 0; i < this.descendants.length; i++) {
                this.descendants[i].display(matStack, textStack);
            }
            textStack.pop();
            matStack.pop();

            text.bind();   //apply texture

            this.scene.popMatrix();
        } else {
            var text = this.texture;
            var prevTexture = textStack[textStack.length - 1]; // TODO Verify this?

            var mat = this.material;
            if (mat == null) {
                mat = matStack[matStack.length - 1];
            }

            this.scene.pushMatrix();
            this.scene.multMatrix(this.transfMat);

            mat.apply();
            text.bind();   //apply texture
            textStack.push(text);
            matStack.push(mat);
            for (var i = 0; i < this.primitives.length; i++) {
                this.primitives[i].display();
            }
            for (var i = 0; i < this.descendants.length; i++) {
                this.descendants[i].display(matStack, textStack);
            }
            prevTexture.bind();
            textStack.pop();
            matStack.pop();


            this.scene.popMatrix();
        }
    }
}
