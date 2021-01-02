
class MyActionButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, textName) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);
        this.pickID = 1000 + id;
    }

    handlePick() {
        if (this.id == 1) //start
            this.scene.orchestrator.startGame();
        else if (this.id == 2) //apply
            this.scene.orchestrator.applyChanges();
        else if (this.id == 3) //undo
            this.scene.orchestrator.undo();
        else if (this.id == 4 || this.id == 5) //camera animation
            this.scene.orchestrator.switchCamera();
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}
