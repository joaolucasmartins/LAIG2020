class MySpriteAnimation extends MyAnimation {
    constructor(scene, spritesheet, startCell, endCell, duration) {
        let cells = [];
        let durStep = duration / (endCell - startCell + 1), currDur = durStep;
        cells[0] = startCell;
        for (let i = startCell; i <= endCell; ++i) {
            cells[currDur] = i;
            currDur += durStep;
        }

        super(scene, cells);
        this.scene = scene;
        this.spritesheet = spritesheet;
        this.rectangle = new MyRectangle(scene, 0, 0, 1, 1);
        this.currElement = this.elements[this.getInitialInstant()];
    }

    onBeforeAnimation() {
        this.currElement = this.elements[this.getInitialInstant()];
    }
    onEndAnimation() {
        this.currElement = this.elements[this.getLastInstant()];
        this.initialInstant = null; // Reset animation to first char
    }
    onMidAnimation() {
        this.currElement = this.elements[this.currInstant];
    }

    update(time) {
        super.update(time);
    }

    apply() {
        this.spritesheet.activateCellP(this.currElement);
        this.rectangle.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
