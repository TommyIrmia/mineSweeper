function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandEmptyCell() {
    var emptyLocations = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            var currLocation = { i, j };
            if (currCell.isMine) continue;
            if (currCell.isShown) continue;
            emptyLocations.push(currLocation);
        }
    }

    var randIdx = getRandomIntInclusive(0, emptyLocations.length - 1);
    var randEmptyLocation = emptyLocations[randIdx];
    return randEmptyLocation;
}