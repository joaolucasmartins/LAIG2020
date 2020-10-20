/**
 * Node
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 */
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

    /**
     * Add primitive to primitives array.
     * @param {primitive object} primitive 
     */
    addPrimitive(primitive) {
        this.primitives.push(primitive);
    }

    /**
     * Update texture according to the values read from xml file.
     * @param {*} texture 
     * @param {*} afs - amplification factor
     * @param {*} aft - amplification factor
     */
    updateTexture(texture, afs, aft) {
        if (texture == null)
            this.texture = new NullTexture();
        else
            this.texture = texture;
        this.aft = aft;
        this.afs = afs;
    }

    /**
     * Toggle texture.
     * @param {boolean} value 
     */
    setDisplayText(value) {
        this.displayText = value;
        if (value == false)
            this.texture = new ClearTexture();
    }

    /**
     * Initialize material according to value read from xml file.
     * @param {CGFappearance} mat 
     */
    setMaterial(mat) {
        if (mat == null)
            this.material = new NullMaterial();
        else
            this.material = mat;
    }

    /*          null                  | clear                 | texture
     Stack    | Dont push to stack    | Push to Stack         | Push to stack
     Bind()   | Bind Parent texture   | Unbind Parent texture | Bind texture
     Unbind() | Unbind Parent texture | Bind Parent texture   | Unbind texture
     
     To achieve this behaviour we created two classes NullTexture and ClearTexture.
     In each we defined the respective bind() and unbind() described previously.
     We used the same approach for the materials (without the clear - only with NullMaterial)
    */
   /**
    * Display function.
    * @param {array} matStack - materials satck
    * @param {array} textStack - textures stack
    */
    display(matStack, textStack) {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMat);

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
