const LVL_SEL_INDEX = 1;
class MyLevelButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, textName) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);

        this.pickID = 3000 + id;
    }

    handlePick() {
        console.log("level" + this.id);
        return [LVL_SEL_INDEX, this.id];
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}