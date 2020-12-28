const THEME_SEL_INDEX = 0;
class MyThemeButton extends MyButton {
    constructor(scene, id, x1, y1, x2, y2, afs, aft, selected, textName) {
        super(scene, id, x1, y1, x2, y2, afs, aft, selected, textName);

        this.pickID = 2000 + id;
    }

    handlePick() {
        console.log("theme" + this.id);
        return [THEME_SEL_INDEX, this.id];
    }

    registerForPick() {
        this.scene.registerForPick(this.pickID, this);
    }
}