
class MyCounterButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, value) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected);
        this.pickID = 5000 +  id;
        this.value = value;
    }

    handlePick(node, val) {
        // console.log("bla");
        // node.primitives[0].updateText(val.toString());
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}