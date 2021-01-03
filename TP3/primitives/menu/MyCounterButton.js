
class MyCounterButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, value, textName, counter) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);
        this.pickID = 5000 +  id;
        this.value = value;

        this.counter = counter;
    }
    
    handlePick() {
        let newVal = this.counter.current + this.value;
        if ((newVal >= this.counter.min) && (newVal <= this.counter.max)){

            let desc = newVal.toString();
            if (newVal < 10)
               desc = "0" + desc;
            
            this.counter.counterDisplay.updateText(desc);
            this.counter.current = newVal;
        }
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}