
class MyActionButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, textName) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);
        this.pickID = 1000 + id;
    }

    handlePick() {
        if (this.id == 1)
            this.scene.orchestrator.startGame();
        else if (this.id == 2)
            this.scene.orchestrator.applyChanges();
        else if (this.id == 3)
            this.scene.orchestrator.undo();
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}
