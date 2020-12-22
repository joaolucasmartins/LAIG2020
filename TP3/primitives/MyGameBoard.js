/**
 * MyGameBoard
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameBoard} gameboard - gameboard to which this tile belongs
 * @param {MyPiece} piece - piece on top of this tile
 */
class MyGameBoard extends CGFobject {
    constructor(scene, x1, y1, x2, y2, initialBoard, blackTile, whiteTile, blackPiece, whitePiece) {
        super(scene);
        this.scene = scene;
        this.tiles = [];
        this.pieces = [];

        this.createGameBoard(initialBoard, blackTile, whiteTile, blackPiece, whitePiece);
        this.length = this.tiles.length;
    }

    createGameBoard(board, whiteTile, blackTile, blackPiece, whitePiece) {
        for (let i = 0; i < board.length; ++i) {
            let row = board[i];
            let tileRes = [], piecesRes = [];
            for (let j = 0; j < row.length; ++j) {
                let value = row[j];
                let piece, tile;

                let isBlack = value === 1;
                if (isBlack) {
                    tile = new MyTile(this.scene, whiteTile, this, null, i, j);
                    piece = new MyPiece(this.scene, whitePiece, tile, isBlack);
                }
                else {
                    tile = new MyTile(this.scene, blackTile, this, null, i, j);
                    piece = new MyPiece(this.scene, blackPiece, tile, isBlack);
                }

                tile.setPiece(piece);
                tileRes.push(tile);
                piecesRes.push(piece);
            }
            this.tiles.push(tileRes);
            this.pieces.push(piecesRes);
        }
    }

    getTileAt(col, line) {return this.tiles[line][col]}
    getPieceAt(col, line) {return this.getTileAt(col, line).getPiece()};

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
    }

    display() {
        for (let i = 0; i < this.tiles.length; ++i)
            for (let j = 0; j < this.tiles[i].length; ++j)
                this.tiles[i][j].display();
        // this.pieces[i].display();
    }

    /* Selects all pieces from coordList. Returns all pieces selected */
    selectPieces(pieceList) {
        let res = []
        for (let i = 0; i < pieceList.length; ++i) {
            let piece = pieceList[i];
            piece.selected = true;
            res.push(piece);
        }
        return res;
    }

    /* Deselects all pieces from coordList. Returns all pieces deselected */
    deselectPieces(pieceList) {
        let res = []
        for (let i = 0; i < pieceList.length; ++i) {
            let piece = pieceList[i];
            piece.selected = false;
            res.push(piece);
        }
        return res;
    }
}

