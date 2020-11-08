/**
 * Node
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 */
class Node {
    constructor(scene, id) {
        this.id = id;
        this.scene = scene;

        this.texture = null; // Set to null and not to NullMaterial so that it crashes when there is a parsing problem
        this.afs = 1; //texture amplification
        this.aft = 1; //texture aplification

        this.material = null; // Set to null and not to NullMaterial so that it crashes when there is a parsing problem

        this.transfMat = mat4.create();//matrix with all of the nodes tranformations

        this.descendantNames = []; // Temporary, to be used as placeholder for nodes not yet constructed/parsed
        this.descendants = [];
        this.primitives = [];
        this.animations = [];
    }

    /**
     * Add primitive to primitives array.
     * @param {primitive object} primitive 
     */
    addPrimitive(primitive) {
        this.primitives.push(primitive);
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    /**
     * Update texture according to the values read from xml file.
     * @param {*} texture 
     * @param {*} afs - amplification factor
     * @param {*} aft - amplification factor
     */
    updateTexture(texture, afs, aft) {
        if (texture == "null")
            this.texture = new NullTexture();
        else if (texture == "clear")
            this.texture = new ClearTexture();
        else
            this.texture = texture;
        this.aft = aft;
        this.afs = afs;
    }

    setMaterial(mat) {
        if (mat == "null")
            this.material = new NullMaterial();
        else
            this.material = mat;
    }

    setAnimation(anim) {
        this.animation = anim;
    }

    applyAnimations() {
        for (let anim in this.animations)
            this.animations[anim].apply();
    }

    update(t) {
        for (let anim in this.animations)
            this.animations[anim].update(t);

        for (var i = 0; i < this.descendants.length; i++)
            this.descendants[i].update(t);
    }

    /*          null                  | clear                 | texture
     Stack    | Dont push to stack    | Push to Stack         | Push to stack
     Bind()   | Bind Parent texture   | Unbind Parent texture | Bind texture
     Unbind() | Unbind Parent texture | Bind Parent texture   | Unbind texture
     
     To achieve this behaviour we created two classes NullTexture and ClearTexture.
     In each we defined the respective bind() and unbind() as described in the table.
     We used the same approach for the materials (without the clear - only with NullMaterial)
    */
    /**
     * Display function.
     * @param {array} matStack - materials stack
     * @param {array} textStack - textures stack
     */
    display(matStack, textStack) {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMat);
        this.applyAnimations();

        // Push/Top Textures
        var pushedTexture = false;
        if (this.texture instanceof ClearTexture) {
            this.texture.parentTexture = textStack[textStack.length - 1];
            textStack.push(this.texture);
            pushedTexture = true;
        } else if (this.texture instanceof NullTexture)
            this.texture.parentTexture = textStack[textStack.length - 1];
        else {
            textStack.push(this.texture);
            pushedTexture = true;
        }

        // Push/Top Materials
        var pushedMaterial = false;
        if (this.material instanceof NullMaterial)
            this.material.parentMaterial = matStack[matStack.length - 1];
        else {
            matStack.push(this.material);
            pushedMaterial = true;
        }

        // Bind and display
        this.material.apply();
        this.texture.bind();
        for (var i = 0; i < this.primitives.length; i++) {
            this.primitives[i].display();
        }

        for (var i = 0; i < this.descendants.length; i++) {
            this.descendants[i].display(matStack, textStack);
        }
        this.texture.unbind();

        // Pop Stacks
        if (pushedTexture)
            textStack.pop();
        if (pushedMaterial)
            matStack.pop();
        this.scene.popMatrix();
    }
}
