
class MyCounterButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, value, textName, counter) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);
        this.pickID = 5000 +  id;
        this.value = value;

        this.counter = counter;
    }
    
    handlePick() {
        let newVal = this.counter.current + this.value;
        console.log(newVal);
        if ((newVal >= this.counter.min) && (newVal <= this.counter.max)){
            this.counter.counterDisplay.updateText(newVal.toString());
            this.counter.current = newVal;
        }
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}