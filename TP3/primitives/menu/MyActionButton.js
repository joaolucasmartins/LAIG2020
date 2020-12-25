
class MyActionButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected);
        this.pickID = 1000 +  id;
    }

    handlePick() {
        console.log("start");
        if (this.id == 1)
            this.scene.orchestrator.startGame();
        else 
            console.log("apply");
  
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}