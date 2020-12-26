/**
 * MyRectangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} y1 - y coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} y2 - y coordinate corner 2
 */
class MyScoreBoard extends CGFobject {
    constructor(scene, obj) {
        super(scene);
        this.obj = obj; //rectangle created in primitiveCreator

        this.blackDesc = new MySpriteText(scene, "Black Pieces");
        this.blackScore = new MySpriteText(scene, "0");

        this.whiteDesc = new MySpriteText(scene, "White Pieces");
        this.whiteScore = new MySpriteText(scene, "0");

        this.winner = "";
        this.winnerDisplay = new MySpriteText(scene, "Black Pieces win");

        this.timer = new MyTimer(scene, 10);

    }

    startCount() {
        this.timer.startCount();
    }

    stopCount() {
        this.timer.stopCount();
    }

    endGame(winner) {
        if (winner == 0) {
            this.winnerDisplay.updateText("Black pieces win");
        }
        else
            this.winnerDisplay.updateText("White pieces win");
        
        this.stopCount();
    }

    updateScores(newBlack, newWhite) {
        this.blackScore.updateText(newBlack.toString());
        this.whiteScore.updateText(newWhite.toString());
    }
  
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }

    update(time) {
        return this.timer.updateTimeDisplay(time);
    }
    display() {

        this.obj.display();

        //black player -----
        this.scene.pushMatrix();
        this.scene.translate( 0.6, 0.3, 0.01);
        this.scene.scale(0.5,0.5,0.5);
        this.blackScore.display();
        //description
        this.scene.translate(0.35, 0.55, 0);
        this.scene.scale(0.2,0.2, 1);
        this.blackDesc.display();
        this.scene.popMatrix();

        //white player -----
        this.scene.pushMatrix();
        this.scene.translate( 1.5, 0.3, 0.01);
        this.scene.scale(0.5,0.5,0.5);
        this.whiteScore.display();
        //description
        this.scene.translate(0.55, 0.55, 0);
        this.scene.scale(0.2,0.2,1);
        this.whiteDesc.display();
        this.scene.popMatrix();

        if (!this.scene.orchestrator.gameOver) {
            //timer
            this.scene.pushMatrix();
            this.scene.translate(1.1, 0.8, 0.01);
            this.scene.scale(0.5,0.5,1);
            this.timer.display();
            this.scene.popMatrix();
        }
        else {
            this.scene.pushMatrix();
            this.scene.translate(1.7, 0.8, 0.01);
            this.scene.scale(0.2,0.2,1);
            this.winnerDisplay.display();
            this.scene.popMatrix();
        }
            


    }
}

