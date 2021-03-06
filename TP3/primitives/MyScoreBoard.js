/**
 * MyScoreBoard
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {object} obj - background object
 */
class MyScoreBoard extends CGFobject {
    constructor(scene, obj) {
        super(scene);
        this.obj = obj; //rectangle created in primitiveCreator

        this.blackDesc = new MySpriteText(scene, "Black Pieces");
        this.blackScore = new MySpriteText(scene, "0");

        this.whiteDesc = new MySpriteText(scene, "White Pieces");
        this.whiteScore = new MySpriteText(scene, "0");

        this.winnerDisplay = new MySpriteText(scene, "Black Pieces win");

        this.currentPlayer = 0;
        this.statusPlayer1 = new MyStatusDisplayer(scene, -0.6, 0.3, true);
        this.statusPlayer2 = new MyStatusDisplayer(scene, 0.6, 0.3, false);

        this.menuBtn = new MyActionButton(this.scene, 5, 0.75, 0.45, 1.15, 0.65, 0.4, 0.2, false, 'travelBtn2.jpg');
        this.undoBtn = new MyActionButton(this.scene, 3, -1.1, 0.45, -0.7, 0.65, 0.4, 0.2, false, 'undoBtn.jpg');

        this.timer = new MyTimer(scene, 10);
        this.gameEnded = false;
    }

    startCount() {
        this.timer.startCount();
    }

    stopCount() {
        this.timer.stopCount();
    }

    setTimeout(val) {
        this.timer.setTimeout(val);
    }

    reset() {
        this.currentPlayer = 0;
        this.gameEnded = false;
        this.blackScore.updateText("0");
        this.whiteScore.updateText("0");
    }

    endGame(winner) {
        if (winner == 0)
            this.winnerDisplay.updateText("White pieces win");

        this.gameEnded = true;
        this.stopCount();
    }

    updateScores(p1, p2) {
        let min_list, max_list;
        if (p1.length > p2.length) {
            min_list = p2;
            max_list = p1;
        } else {
            min_list = p1;
            max_list = p2;
        }

        let scoreBlack = p1[0];
        let scoreWhite = p2[0];
        for (var i = 0; i < min_list.length; ++i) {
            if (min_list[i] !== max_list[i]) {
                scoreBlack = p1[i];
                scoreWhite = p2[i];
                break;
            }
        }

        this.blackScore.updateText(scoreBlack.toString());
        this.whiteScore.updateText(scoreWhite.toString());
    }

    switchPlayer() {

        if (this.currentPlayer == 0) {
            this.statusPlayer1.turnOf()
            this.statusPlayer2.turnOn();
            this.currentPlayer = 1;
        }
        else {
            this.statusPlayer1.turnOn();
            this.statusPlayer2.turnOf();
            this.currentPlayer = 0;
        }

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

        this.menuBtn.display();

        //black player -----
        this.scene.pushMatrix();
        this.scene.translate(-0.5, -0.3, 0.01);
        this.scene.scale(0.5, 0.5, 0.5);
        this.blackScore.display();
        //description
        this.scene.translate(0.65, 0.55, 0);
        this.scene.scale(0.3, 0.3, 1);
        this.blackDesc.display();
        this.scene.popMatrix();

        //white player -----
        this.scene.pushMatrix();
        this.scene.translate(0.6, -0.3, 0.01);
        this.scene.scale(0.5, 0.5, 0.5);
        this.whiteScore.display();
        //description
        this.scene.translate(0.75, 0.55, 0);
        this.scene.scale(0.3, 0.3, 1);
        this.whiteDesc.display();
        this.scene.popMatrix();

        if (!this.gameEnded) {
            this.undoBtn.display();
            this.statusPlayer1.display();
            this.statusPlayer2.display();

            //timer
            this.scene.pushMatrix();
            this.scene.translate(0.15, 0.3, 0.01);
            this.scene.scale(0.5, 0.5, 1);
            this.timer.display();
            this.scene.popMatrix();
        }
        else {
            this.scene.pushMatrix();
            this.scene.translate(0.9, 0.3, 0.01);
            this.scene.scale(0.25, 0.25, 1);
            this.winnerDisplay.display();
            this.scene.popMatrix();
        }

    }
}

