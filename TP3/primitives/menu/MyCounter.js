/**
 * MyCounter
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} id - counter id
 * @param {integer} min - min bound
 * @param {integer} max - max bound
 * @param {string} description - counter description
 */
class MyCounter extends CGFobject {
    constructor(scene, id, min, max, description) {
        super(scene);
        this.pickID = 5000 + id; // for object picking
        
        this.id = id;

        this.min = min;
        this.max = max;

        this.current = min;

        this.description = new MySpriteText(this.scene, description);

        this.counterDisplay = new MySpriteText(this.scene, this.min.toString());
        this.incrBtn = new MyCounterButton(this.scene, id+1, 0.5, 0.1, 0.7, 0.3, 0.2, 0.2, false, 1, 'incrBtn.jpg', this);
        this.decrBtn = new MyCounterButton(this.scene, id+2, 0.5, -0.4, 0.7, -0.2, 0.2, 0.2, false, -1, 'decrBtn.jpg', this)
    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0.3, 0.5, 0);
        this.scene.scale(0.3,0.3, 0.3);
        this.description.display();
        this.scene.popMatrix();
        
        this.counterDisplay.display();
        this.incrBtn.display();
        this.decrBtn.display();
    }
}
