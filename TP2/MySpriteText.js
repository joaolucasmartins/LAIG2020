const SPRITE_IMG = "scenes/images/spriteText.png";

class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        let texture = new CGFtexture(scene, SPRITE_IMG);
        this.textsheet = new MySpritesheet(scene, texture, 16, 16);

        this.chars = [];
        for (let i in text) {
            let x = parseInt(i) - text.length / 2;
            let rect = new MyRectangle(scene, x, -0.5, x + 1, 0.5);
            let currCharCode = this.getCharacterPosition(text[i]);
            this.chars.push([rect, currCharCode]);
        }
    }

    getCharacterPosition(character) {
        let A_pos = 65;
        let inc;
        if (character >= 'A' && character <= 'Z')
            inc = 0 + character.charCodeAt(0) - 'A'.charCodeAt(0);
        else if (character >= 'a' && character <= 'z')
            inc = 32 + character.charCodeAt(0) - 'a'.charCodeAt(0);
        else // is not letter => Assume whitespace
            return 32;

        return A_pos + inc;
    }

    display() {
        for (let i in this.chars) {
            let rect = this.chars[i][0];
            let code = this.chars[i][1];

            this.textsheet.activateCellP(code);
            rect.display();
        }
    }
}
