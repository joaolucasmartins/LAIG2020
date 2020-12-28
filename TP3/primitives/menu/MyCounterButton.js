
class MyCounterButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, value, textName) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);
        this.pickID = 5000 +  id;
        this.value = value;
    }
    
    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}