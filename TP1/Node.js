class Node {
    constructor(scene, id, texture, materialId) {
        this.id = id;
        this.scene = scene;

        this.texture = texture;
        this.displayText = true;
        this.afs = 1; //texture amplification
        this.aft = 1; //texture aplification

        this.materialId = materialId;

        this.transfMat = mat4.create();//matrix with all of the nodes tranformations

        this.descendantNames = []; // Temporary, to be used as placeholder for nodes not yet constructed/parsed
        this.descendants = [];
        this.primitives = [];
    }

    addPrimitive(primitive) {
        this.primitives.push(primitive);
    }

    updateTexture(texture, afs, aft) {
        this.texture = texture;
        this.aft = aft;
        this.afs = afs;
    }

    setDisplayText(value) {
        this.displayText = value;
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
        } else if (!this.displayText) { //TODO fix clear texture
            var text = textStack[textStack.length - 1];

            var mat = this.material;
            if (mat == null) {
                mat = matStack[matStack.length - 1];
            }

            this.scene.pushMatrix();
            this.scene.multMatrix(this.transfMat);

            if (mat != undefined)
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
            var prevTexture = textStack[textStack.length - 1];

            var mat = this.material;
            if (mat == null) {
                mat = matStack[matStack.length - 1];
            }

            this.scene.pushMatrix();
            this.scene.multMatrix(this.transfMat);

            if (mat != undefined)
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
            if (prevTexture != undefined)
                prevTexture.bind();
            textStack.pop();
            matStack.pop();


            this.scene.popMatrix();
        }
    }
}
