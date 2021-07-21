'use strict'
const MINE = '💣';
const FLAG = '🚩';

//TODO : change the code so it counts the negs and plant mines after the 1st click!
// create a modal - jumps up when game is won/lost - dissappears on restart
// add support for lives!
// add support for HINTS!
// best score!!!
// FULL EXPAND RECURSION!!!!!!!!!!!!
// 3 safe clicks!!!!
// undo BUTTON????
// manually position mines!

var gameInter;
var gBoard;
var gLevel = {
    size: 4,
    mine: 2
}
var gMineLocations;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    life: 3
}

function initGame() {
    gMineLocations = getMineLocations();
    gBoard = buildBoard();
    renderBoard(gBoard);
    var elMineCounter = document.querySelector('.mines-counter span');
    elMineCounter.innerText = ' : ' + gLevel.mine;
}

function chooseLevel(elBtn) {
    if (elBtn.classList[0] === 'easy') setLevel(4, 2);
    if (elBtn.classList[0] === 'medium') setLevel(8, 12);
    if (elBtn.classList[0] === 'expert') setLevel(12, 30);
}

function setLevel(size, mine) {
    gLevel.size = size;
    gLevel.mine = mine;
    changeSmiley('😬');
    resetCounters();
    initGame();
    console.log(document.querySelectorAll('.mine'));
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            var cell = createCell();
            if (isMineLocationExsits(gMineLocations, { i, j })) { // 
                cell.isMine = true;
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(mat) {
    var strHTML = '<table border="1"><tbody>\n';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '\t<tr>\n';
        for (var j = 0; j < mat[0].length; j++) {
            setMinesNegsCount(i, j, mat);
            var cell = mat[i][j];
            var className = `"cell cell${i}-${j}`;
            if (cell.isMine) {
                cell = MINE;
                className += ' mine';
            } else if (cell.minesAroundCount) cell = cell.minesAroundCount;
            else cell = '';
            strHTML += `\t<td class=${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"><div class="hide">${cell}</div></td>\n`
        }
        strHTML += '\t</tr>\n'
    }
    strHTML += '</tbody></table>';
    var elGameBoard = document.querySelector(".game-board");
    elGameBoard.innerHTML = strHTML;
}

function restartGame() {
    initGame();
    clearInterval(gameInter);
    resetCounters();
    changeSmiley('😬');
    gMineLocations = getMineLocations();
}

function isWin() {
    var totalCount = gGame.shownCount + gGame.markedCount;
    console.log(totalCount, 'opened cells');
    return (totalCount === gLevel.size ** 2);
}

function resetCounters() {
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    updateTimer('00:00:00');
}

function changeSmiley(smiley) {
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = smiley;
}

function gameOver() {
    if (isWin()) {
        console.log('you win');
        changeSmiley('😎')
    } else {
        console.log('you lose');
        changeSmiley('😪');
    }
    clearInterval(gameInter);
    gGame.isOn = false;
}

function cellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', event => event.preventDefault());
    if (!gGame.isOn) setTimer();
    gGame.isOn = true;
    var cell = gBoard[i][j];

    if (cell.isShown) return;
    if (!cell.isMarked) {
        gGame.markedCount++;
        cell.isMarked = true;
        renderCell({ i, j }, FLAG);
    } else {
        gGame.markedCount--;
        cell.isMarked = false;
        renderCell({ i, j }, `<div class="hide">${cell.minesAroundCount}</div>`);
    }
    if (isWin()) gameOver();
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) setTimer();
    var cell = gBoard[i][j];
    if (!gGame.isOn && cell.isMine) return; // need to finish - make sure 1st move isnt a mine
    gGame.isOn = true;

    if (cell.isMarked || cell.isShown) return;
    if (cell.isMine) {
        gameOver();
    } else if (cell.minesAroundCount === 0) {
        openNegCells(i, j, gBoard);
    }

    gGame.shownCount++;
    removeHide({ i, j });

    if (isWin()) gameOver();
}

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function getMineLocations() {
    var mineLocations = [];
    while (mineLocations.length < gLevel.mine) {
        var randI = getRandomIntInclusive(0, gLevel.size - 1)
        var randJ = getRandomIntInclusive(0, gLevel.size - 1)
        var mineLocation = { i: randI, j: randJ }
        if (!isMineLocationExsits(mineLocations, mineLocation)) mineLocations.push(mineLocation);
    }
    return mineLocations;
}

function isMineLocationExsits(locations, location) {
    for (var idx = 0; idx < locations.length; idx++) {
        if (locations[idx].i === location.i && locations[idx].j === location.j) return true;
    }
    return false;
}

function setMinesNegsCount(cellI, cellJ, mat) {
    var cell = mat[cellI][cellJ];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currNeg = mat[i][j];
            if (currNeg.isMine) cell.minesAroundCount++;
        }
    }
}

function updateTimer(timeDiffStr) {
    var elTimer = document.querySelector('.timer span');
    elTimer.innerText = timeDiffStr;
}

function setTimer() {
    var time1 = Date.now();
    gameInter = setInterval(function() {
        var time2 = Date.now(time1);
        var msTimeDiff = time2 - time1;
        var timeDiffStr = new Date(msTimeDiff).toISOString().slice(14, -2);
        updateTimer(timeDiffStr);
    }, 100);
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
    console.log(elCell);
}


function openNegCells(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = gBoard[i][j];
            var cellLocation = { i, j };
            if (!cell.isShown) gGame.shownCount++;
            cell.isShown = true;
            removeHide(cellLocation)
        }
    }

}

function removeHide(location) {
    gBoard[location.i][location.j].isShown = true;
    var currCell = document.querySelector(`.cell${location.i}-${location.j}`);
    currCell.querySelector('div').classList.remove('hide');
    currCell.style.backgroundColor = 'rgb(210, 210, 210)';
}

// recursion?!@?#!@?#?!@#?!@#?

// function openNegCells(cellI, cellJ, mat) {
//     var cell = mat[cellI][cellJ];
//     console.log('cell', cell);
//     var cellLocation = { i: cellI, j: cellJ };
//     console.log('cellLocation', cellLocation);
//     if (cellLocation.i < 0 && cellLocation.j < 0) return;
//     if (cellLocation.i > gGame.size - 1 && cellLocation.j > gGame.size - 1) return;
//     if (cell.isShown) return;
//     if (cell.minesAroundCount) return;
//     cell.isShown = true;
//     gGame.shownCount++;
//     removeHide(cellLocation);
//     openNegCells(cellI - 1, cellJ, mat)
//     openNegCells(cellI + 1, cellJ, mat)
//     openNegCells(cellI, cellJ + 1, mat)
//     openNegCells(cellI, cellJ - 1, mat)
//     openNegCells(cellI + 1, cellJ + 1, mat)
//     openNegCells(cellI - 1, cellJ + 1, mat)
//     openNegCells(cellI - 1, cellJ - 1, mat)
//     openNegCells(cellI + 1, cellJ - 1, mat)
// }