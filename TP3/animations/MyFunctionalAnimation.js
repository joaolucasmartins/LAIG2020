class MyFunctionalAnimation extends MyAnimation {
    constructor(scene, transformations, f) {
        super(scene, transformations);
        this.emptyTransformation = Transformation.newEmptyTransformation();
        this.functions = f;
        this.currentTransformation = this.emptyTransformation;
        this.translVec = vec3.create();
        this.rotVec = vec3.create();
        this.scaleVec = vec3.create();
    }

    onBeforeAnimation() {
        this.currentTransformation = this.emptyTransformation;
    }

    onEndAnimation() {
        this.currentTransformation = this.elements[this.currInstant];
    }

    onMidAnimation(instant) {
        let prevTransformation = this.elements[this.previousInstant];
        let nextTransformation = this.elements[this.currInstant];
        let weight = (instant - this.previousInstant) / (this.currInstant - this.previousInstant);
        let [fx, fy, fz] = this.functions;
        vec3.lerp(this.translVec, prevTransformation.translation, nextTransformation.translation, fx(weight));
        vec3.lerp(this.rotVec, prevTransformation.rotation, nextTransformation.rotation, fy(weight));
        vec3.lerp(this.scaleVec, prevTransformation.scale, nextTransformation.scale, fz(weight));
        this.currentTransformation = new Transformation([this.translVec, this.rotVec, this.scaleVec]);

    }

    update(time) {
        super.update(time);
    }

    apply() {
        this.scene.scale(...this.currentTransformation.scale);
        this.scene.translate(...this.currentTransformation.translation);
        for (var i = 0; i < 3; ++i) {
            if (this.currentTransformation.rotation[i] != 0) {
                this.scene.rotate(this.currentTransformation.rotation[i], ...Transformation.selectAxis[i]);
            }
        }
    }
}
