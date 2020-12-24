const SPRITE_IMG = "scenes/images/spriteText.png";

class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.textsheet = new MySpritesheet(scene, SPRITE_IMG, 16, 16);

        this.chars = [];
        this.beginX = - text.length / 2.0 + 0.5;
        this.rect = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        for (let i in text) {
            let currCharCode = this.getCharacterPosition(text[i]);
            this.chars.push(currCharCode);
        }
    }

    getCharacterPosition(character) {
        let A_pos = 65;
        let inc;
        console.log(typeof character);

        if (character >= 'A' && character <= 'Z')
            inc = 0 + character.charCodeAt(0) - 'A'.charCodeAt(0);
        else if (character >= 'a' && character <= 'z')
            inc = 32 + character.charCodeAt(0) - 'a'.charCodeAt(0);
        else if (character >= '0' && character <= '9') {
            A_pos = 0;
            inc = 48 + parseInt(character);
        }
        else // is not letter or number => Assume whitespace
            return 32;
        return A_pos + inc;
    }

    updateText(value) {
        this.chars = [];
        for (let i in value) {
            let charCode = this.getCharacterPosition(value[i]);
            this.chars.push(charCode);
        }

        // this.beginX = -value.length/2 + 0.5;
    }

    display(matStack, textStack) {
        this.scene.pushMatrix();
        this.scene.translate(this.beginX, 0, 0);
        for (let i = 0; i < this.chars.length; ++i) {
            let code = this.chars[i];

            this.textsheet.activateCellP(code);
            this.rect.display();
            this.scene.translate(1, 0, 0); // Add 1 in x for each rectangle
        }

        // Restore scene
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
        // Reset previous bound texture
        if (textStack.length != 0)
            textStack[textStack.length - 1].bind();
    }
}
