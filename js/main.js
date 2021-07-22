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
    name: 'easy',
    size: 4,
    mine: 2,
    safe: 1,
    life: 1,
    hint: 1
}
var gMineLocations;
var gNegsLocations = [];
var gGame = {
    isOn: false,
    isWon: false,
    isFirstClick: false,
    isHint: false,
    shownCount: 0,
    markedCount: 0,
    isManual: true
}

function initGame() {
    renderSpecials('hint', '💡')
    renderSpecials('life', '💖')
    renderSpecials('safe', '🤞')
    gBoard = buildBoard();
    renderBoard(gBoard);
    var elMineCounter = document.querySelector('.mines-counter span');
    elMineCounter.innerText = gLevel.mine;
}

function renderSpecials(name, emoji) {
    var strHTML = `${name}: `
    for (var i = 0; i < gLevel[name]; i++) {
        strHTML += `<span onclick="${name}Click(this)">${emoji}</span>`
    }
    var elContainer = document.querySelector(`.${name}`)
    elContainer.innerHTML = strHTML
}

function safeClick(elSafe) {
    gLevel.safe--;
    renderSpecials('safe', '🤞');
    var emptyCellLocation = getRandEmptyCell();
    markCell(emptyCellLocation);
}

function markCell(location) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.style.backgroundColor = 'lightgreen';
    var currCell = gBoard[location.i][location.j];
    setTimeout(function() {
        elCell.style.backgroundColor = (currCell.isShown) ? 'lightgray' : 'rgb(153, 153, 153';
    }, 1500)
}

function hintClick(elHint) {
    elHint.style.boxShadow = '2px -5px 17px 10px #FFFF66';
    elHint.style.backgroundColor = '#FFFF66';
    gLevel.hint--;
    gGame.isHint = true;
}

function chooseLevel(elBtn) {
    if (elBtn.classList[0] === 'easy' ||
        gLevel.name === 'easy') setLevel('easy', 4, 2, 1);
    if (elBtn.classList[0] === 'medium' ||
        gLevel.name === 'medium') setLevel('medium', 8, 12, 2);
    if (elBtn.classList[0] === 'expert' ||
        gLevel.name === 'expert') setLevel('expert', 12, 30, 3);
    restartGame();
}

function setLevel(name, size, mine, specials) {
    gLevel.name = name;
    gLevel.size = size;
    gLevel.mine = mine;
    gLevel.life = specials;
    gLevel.safe = specials;
    gLevel.hint = specials;
}

function restartGame() {
    if (gLevel.name === 'easy') setLevel('easy', 4, 2, 1)
    if (gLevel.name === 'medium') setLevel('medium', 8, 12, 2)
    if (gLevel.name === 'expert') setLevel('expert', 12, 30, 3)
    changeSmiley('😬');
    resetCounters();
    initGame();
    clearInterval(gameInter);
    updateTimer('00:00:00');
    closeModal();
}

function resetCounters() {
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.isOn = false;
    gGame.isFirstClick = false;
    updateTimer('00:00:00');
}

function onFirstClick(cellI, cellJ) {
    gGame.isFirstClick = true;
    gGame.isOn = true;
    setTimer();
    placeMines(cellI, cellJ)
    buildBoard();
    renderBoard(gBoard);

}

function placeMines(cellI, cellJ) {
    gMineLocations = getMineLocations(cellI, cellJ);
    for (var i = 0; i < gMineLocations.length; i++) {
        var currLocation = gMineLocations[i];
        var cell = gBoard[currLocation.i][currLocation.j]
        cell.isMine = true;
    }
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            var cell = createCell();
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
            var cell = mat[i][j];

            if (gGame.isFirstClick) setMinesNegsCount(i, j, mat);

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

function isWin() {
    getTotalCount();
    return (gGame.shownCount === gLevel.size ** 2);
}

function getTotalCount() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isShown || currCell.isMarked) count++;
        }
    }
    gGame.shownCount = count;
}

function changeSmiley(smiley) {
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = smiley;
}

function openModal(str) {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    if (str.includes('flags')) {
        elModal.style.fontSize = '20px';
        setTimeout(closeModal, 2000);
    }
    elModal.innerHTML = `${str}!<span> \n to play again press the cool SMILEY!</span>`

}

function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
}

function gameOver() {
    if (gGame.markedCount > gLevel.mine) {
        openModal('To many flags, keep going');
    } else if (gGame.shownCount === gLevel.size ** 2) {
        openModal('You Won!!');
        changeSmiley('😎')
        clearInterval(gameInter);
    } else {
        openModal('You Lost');
        changeSmiley('😪');
        clearInterval(gameInter);
        revealMines();
    }
}

function revealMines() {
    var elMines = document.querySelectorAll('.mine');
    for (var i = 0; i < elMines.length; i++) {
        var currMine = elMines[i];
        currMine.style.backgroundColor = 'red';
        currMine.querySelector('div').classList.remove('hide');
    }
}

function cellMarked(elCell, i, j) {
    if (!gGame.isFirstClick) onFirstClick();
    if (!gGame.isOn) return;
    document.addEventListener('contextmenu', event => event.preventDefault());
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
    var cell = gBoard[i][j];
    if (!gGame.isFirstClick) onFirstClick(i, j);
    if (!gGame.isOn) return;

    if (gGame.isHint) {
        openNegCells(i, j, gBoard);
        renderSpecials('hint', '💡');
        setTimeout(closeNegCells, 1000);
    }
    if (cell.isMarked || cell.isShown) return;
    if (cell.isMine) {
        if (gGame.isHint) return;
        --gLevel.life;
        renderSpecials('life', '💖');
        if (gLevel.life === 0) {
            gameOver();
            gGame.isOn = false;
        }
    } else if (cell.minesAroundCount === 0) {
        // openNegCells(i, j, gBoard);
        openCellsRecursive(i, j, gBoard);
    }

    cell.isShown = true;
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

function getMineLocations(cellI, cellJ) {
    var mineLocations = [];
    while (mineLocations.length < gLevel.mine) {
        var randI = getRandomIntInclusive(0, gLevel.size - 1)
        var randJ = getRandomIntInclusive(0, gLevel.size - 1)
        var mineLocation = { i: randI, j: randJ }
        if (!isMineLocationExsits(mineLocations, mineLocation) && !(randI === cellI && randJ === cellJ)) mineLocations.push(mineLocation);
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
}

function openNegCells(cellI, cellJ, mat) {
    gNegsLocations = [];
    var currLocation = { i: cellI, j: cellJ };
    if (gGame.isHint) gNegsLocations.push(currLocation);
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = gBoard[i][j];
            var cellLocation = { i, j };
            gNegsLocations.push(cellLocation);
            if (gGame.isHint && !cell.isShown) {
                removeHide({ i: cellI, j: cellJ })
            }
            if (!cell.isShown) {
                cell.isShown = true;
                removeHide(cellLocation)
            }
        }
    }
}

function closeNegCells() {
    for (var i = 0; i < gNegsLocations.length; i++) {
        var location = gNegsLocations[i];
        var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
        elCell.querySelector('div').classList.add('hide');
        elCell.style.backgroundColor = 'rgb(153, 153, 153)';
        var cell = gBoard[location.i][location.j];
        cell.isShown = false;
    }
    gGame.isHint = false;
}

function openCellsRecursive(cellI, cellJ, mat) {

    if (cellI < 0 || cellJ < 0 || cellI > mat.length - 1 || cellJ > mat[cellI].length - 1) return;
    var cell = mat[cellI][cellJ]
    if (cell.isShown) return;
    if (cell.isMarked) return;
    removeHide({ i: cellI, j: cellJ })

    if (cell.minesAroundCount) {
        return
    }
    var options = [
        [cellI, cellJ + 1],
        [cellI, cellJ - 1],
        [cellI + 1, cellJ],
        [cellI - 1, cellJ],
        [cellI + 1, cellJ + 1],
        [cellI - 1, cellJ - 1],
        [cellI + 1, cellJ - 1],
        [cellI - 1, cellJ + 1]
    ]
    for (var i = 0; i < options.length; i++) {
        var option = options[i]
        openCellsRecursive(option[0], option[1], mat)
    }
}

function removeHide(location) {
    gBoard[location.i][location.j].isShown = true;
    var currCell = document.querySelector(`.cell${location.i}-${location.j}`);
    currCell.querySelector('div').classList.remove('hide');

    if (gBoard[location.i][location.j].isMine) currCell.style.backgroundColor = 'orange'
    else currCell.style.backgroundColor = 'rgb(210, 210, 210)';
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

// function setManualMines(elCell, i, j) {
//     console.log(gLevel.mine);
//     var currCell = gBoard[i][j];
//     if (gLevel.mine > 0) {
//         currCell = MINE;
//         gLevel.mine--;
//         console.log('currCell', currCell);
//         renderCell({ i, j }, MINE);
//     }
// }