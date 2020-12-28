const MODE_SEL_INDEX = 2;
class MyModeButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, textName) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);

        this.pickID = 4000 + id;
    }

    handlePick() {
        console.log("mode" + this.id);
        return [MODE_SEL_INDEX, this.id];
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}