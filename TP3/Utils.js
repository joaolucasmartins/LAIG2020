function coordToString(coord) {
    return "[" + coord.join(",") + "]";
}

function tilesToString(tiles) {
    let res = "[";
    for (let i = 0; i < tiles.length - 1; ++i) {
        res += "[";
        let row = tiles[i];
        for (let j = 0; j < row.length - 1; ++j) {
            res += row[j].getPiece().toString() + ",";
        }
        if (row.length != 0)
            res += row[row.length - 1].getPiece().toString();
        res += "],";
    }

    if (tiles.length != 0) {
        res += "[";
        let row = tiles[tiles.length - 1];
        for (let j = 0; j < row.length - 1; ++j) {
            res += row[j].getPiece().toString() + ",";
        }
        if (row.length != 0)
            res += row[row.length - 1].getPiece().toString();
        res += "]";
    }
    res += "]";

    return res;
}
