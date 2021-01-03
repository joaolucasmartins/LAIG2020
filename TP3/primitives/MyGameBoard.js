/**
 * MyGameBoard
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameBoard} gameboard - gameboard to which this tile belongs
 * @param {MyPiece} piece - piece on top of this tile
 */
class MyGameBoard extends CGFobject {
    constructor(scene, gameboard, initialBoard,
        blackTileCreator, whiteTileCreator, blackPieceCreator, whitePieceCreator) {
        super(scene);
        this.scene = scene;
        this.tiles = [];
        this.pieces = [];
        this.length = 0;

        this.obj = gameboard;
        this.createGameBoard(initialBoard, blackTileCreator,
            whiteTileCreator, blackPieceCreator, whitePieceCreator);
    }

    createGameBoard(board, whiteTileCreator, blackTileCreator, blackPieceCreator, whitePieceCreator) {
        this.board = new Node(this.scene, "board");
        this.obj.removeDescendantById("board"); // Remove board from object if already defined
        this.length = board.length;

        for (let i = 0; i < board.length; ++i) {
            let row = board[i];
            let tileRes = [], piecesRes = [];
            for (let j = 0; j < row.length; ++j) {
                let value = row[j];
                let piece, tile;

                let isBlack = value === 1;
                if (isBlack) {
                    piece = new MyPiece(this.scene, blackPieceCreator.create(), null, isBlack);
                    tile = new MyTile(this.scene, blackTileCreator.create(), this, piece, i, j);
                }
                else {
                    piece = new MyPiece(this.scene, whitePieceCreator.create(), null, isBlack);
                    tile = new MyTile(this.scene, whiteTileCreator.create(), this, piece, i, j);
                }

                this.board.addDescendant(tile);
                piece.setTile(tile);
                tileRes.push(tile);
                piecesRes.push(piece);
            }
            this.tiles.push(tileRes);
            this.pieces.push(piecesRes);
        }

        this.board.transfMat = mat4.create();
        mat4.scale(this.board.transfMat, this.board.transfMat, [3 / this.length, 3 / this.length, 3 / this.length]);
        this.obj.addDescendant(this.board);
    }

    getTileAt(col, line) {return this.tiles[line][col]}
    getPieceAt(col, line) {return this.getTileAt(col, line).getPiece()};

    addPiece(piece, tile) {tile.setPiece(piece);}
    removePiece(tile) {tile.setPiece(null);}
    getPiece(tile) {return tile.getPiece();}
    getTile(piece) {return piece.getTile();}

    reset() {
        for (let i = 0; i < this.pieces.length; ++i)
            for (let j = 0; j < this.pieces[i].length; ++j)
                this.tiles[i][j].setPiece(this.pieces[i][j]);
    }

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
        //TODO Use matrices and optimize to not resize when size 3
        // Normalize board to be 3x3
        if (this.obj)
            this.obj.display();
        //this.scene.scale(3 / this.length, 3 / this.length, 3 / this.length);
        //for (let i = 0; i < this.tiles.length; ++i)
        //for (let j = 0; j < this.tiles[i].length; ++j)
        //this.tiles[i][j].display();

        //this.scene.scale(this.length / 3, this.length / 3, this.length / 3);
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

