/**
 * MyGameBoard
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameBoard} gameboard - gameboard to which this tile belongs
 * @param {MyPiece} piece - piece on top of this tile
 */
class MyGameBoard extends CGFobject {
    constructor(scene, x1, y1, x2, y2, initialBoard) {
        super(scene);
        this.scene = scene;
        this.tiles = [];
        this.pieces = [];
        this.currentPlayer = 0;

        this.createGameBoard(initialBoard);
        this.length = this.tiles.length;
    }

    createGameBoard(board) {
        for (let i = 0; i < board.length; ++i) {
            let row = board[i];
            let tileRes = [], piecesRes = [];
            for (let j = 0; j < row.length; ++j) {
                let value = row[j];
                let tile = new MyTile(this.scene, this, null, i, j);
                let piece;

                if (value === 1)
                    piece = new MyPiece(this.scene, tile, false);
                else
                    piece = new MyPiece(this.scene, tile, true);


                tile.setPiece(piece);
                tileRes.push(tile);
                piecesRes.push(piece);
            }
            this.tiles.push(tileRes);
            this.pieces.push(piecesRes);
        }
    }

    getTileAt(line, col) {return this.tiles[line][col]}

    addPiece(piece, tile) {tile.setPiece(piece);}
    removePiece(tile) {tile.setPiece(null);}
    getPiece(tile) {return tile.getPiece();}
    getTile(piece) {return piece.getTile();}

    switchPiece(sourceTile, destTile) {
        console.log("moving", sourceTile.getCoords(), "to", destTile.getCoords());
        var sourcePiece = sourceTile.getPiece();
        var destPiece = destTile.getPiece();
        sourceTile.setPiece(destPiece);
        destPiece.setTile(sourceTile);

        destTile.setPiece(sourcePiece);
        sourcePiece.setTile(destTile);
        this.currentPlayer = (this.currentPlayer + 1) % 2;
    }

    display() {
        for (let i = 0; i < this.tiles.length; ++i)
            for (let j = 0; j < this.tiles[i].length; ++j)
                this.tiles[i][j].display();
        // this.pieces[i].display();
    }
}

