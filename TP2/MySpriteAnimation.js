class MySpriteAnimation extends MyAnimation { // TODO Make this work with KeyFrames too
    // TODO Make sprite animation repeat over time
    constructor(scene, spritesheet, startCell, endCell, duration) {
        let cells = [];
        let currDur = 0, durStep = duration / (endCell - startCell)
        for (let i = startCell; i <= endCell; ++i) {
            cells[currDur] = i;
            currDur += durStep;
        }

        super(scene, cells)
        this.scene = scene;
        this.spritesheet = spritesheet;
        this.rectangle = new MyRectangle(scene, 0, 0, 1, 1);
        this.currInstantIndex = 0;
        this.currInstant = this.instants[this.currInstantIndex];
        this.currElement = this.elements[this.currInstant];
    }

    update(time) {
        if (this.initialInstant == null)
            this.initialInstant = time;

        var instant = (time - this.initialInstant) / 1000;

        if (instant <= this.instants[0]) {
            this.currInstantIndex = 0;
            this.currInstant = this.instants[this.currInstantIndex];
            this.currElement = this.elements[this.currInstant];
            return;
        }

        while (instant > this.currInstant) {
            this.currInstantIndex++;
            this.currInstant = this.instants[this.currInstantIndex];
        }
        this.currElement = this.elements[this.currInstant];

        if (instant >= this.instants[this.instants.length - 1]) {
            this.currInstantIndex = this.instants.length - 1;
            this.currInstant = this.instants[this.currInstantIndex];
            this.currElement = this.elements[this.currInstant];
            return;
        }
    }

    apply() {
        this.spritesheet.activateCellP(this.currElement);
        this.rectangle.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
