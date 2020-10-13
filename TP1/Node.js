class Node {
    constructor(scene, id, texture, materialId) {
        this.id = id;
        this.texture = texture;
        this.afs = 1; //texture amplification
        this.aft = 1; //texture aplification
        this.materialId = materialId;
        this.descendantNames = []; // Temporary, to be used as placeholder for nodes not yet constructed/parsed
        this.descendants = [];
        this.primitives = [];
        this.transfMat = mat4.create();//matrix with all of the nodes tranformations
        this.scene = scene;
        this.displayText = true;
    }

    addPrimitive(type, xmlDesc, reader) {
        var primitive;
        if (type == "rectangle") {
            var x1 = reader.getFloat(xmlDesc, "x1", true);
            var y1 = reader.getFloat(xmlDesc, "y1", true);
            var x2 = reader.getFloat(xmlDesc, "x2", true);
            var y2 = reader.getFloat(xmlDesc, "y2", true);
            primitive = new MyRectangle(this.scene, x1, y1, x2, y2);
        } else if (type == "triangle") {
            var x1 = reader.getFloat(xmlDesc, "x1", true);
            var y1 = reader.getFloat(xmlDesc, "y1", true);
            var x2 = reader.getFloat(xmlDesc, "x2", true);
            var y2 = reader.getFloat(xmlDesc, "y2", true);
            var x3 = reader.getFloat(xmlDesc, "x3", true);
            var y3 = reader.getFloat(xmlDesc, "y3", true);
            primitive = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3);
        } else if (type == "cylinder") {
            var bottomRadius = reader.getFloat(xmlDesc, "bottomRadius", true);
            var topRadius = reader.getFloat(xmlDesc, "topRadius", true);
            var height = reader.getFloat(xmlDesc, "height", true);
            var slices = reader.getInteger(xmlDesc, "slices", true);
            var stacks = reader.getInteger(xmlDesc, "stacks", true);
            primitive = new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
        } else if (type == "sphere") {
            var radius = reader.getFloat(xmlDesc, "radius", true);
            var slices = reader.getInteger(xmlDesc, "slices", true);
            var stacks = reader.getInteger(xmlDesc, "stacks", true);
            primitive = new MySphere(this.scene, radius, slices, stacks);
        } else if (type == "cube") {
            primitive = new MyCube(this.scene);
        } else if (type == "torus") {
            var innerRadius = reader.getFloat(xmlDesc, "inner", true);
            var outerRadius = reader.getFloat(xmlDesc, "outer", true);
            var slices = reader.getInteger(xmlDesc, "slices", true);
            var loops = reader.getInteger(xmlDesc, "loops", true);
            primitive = new MyTorus(this.scene, innerRadius, outerRadius, slices, loops);
        }
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
            var prevTexture = textStack[textStack.length - 1]; //TODO verify

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
