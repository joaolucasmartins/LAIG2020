/**
 * MyMaterial
 * Normal material representation (explained in Node.js)
 */
class MyMaterial {
    constructor(material) {
        this.pushedMaterial = false;
        this.material = material;
    }

    pushStack(matStack) {
        matStack.push(this);
        this.pushedMaterial = true;
    }

    popStack(matStack) {
        if (this.pushedMaterial) {
            matStack.pop();
            this.pushedMaterial = false;
        }
    }

    /**
     * Apply material
     */
    apply() {
        this.material.apply();
    }
}
