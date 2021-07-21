function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// get current time
function getTime() {
    return new Date().toString().split(' ')[4];
}

// create board
function createMat(rows, cols) {
    var board = [];
    for (var i = 0; i < rows; i++) {
        board.push([]);
        for (var j = 0; j < cols; j++) {
            board[i][j] = '';
        }
    }
    return board;
}

// neighbours loop
function countNeighbors(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;

        }
    }
}

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

function drawNum(nums) {
    var idx = getRandomIntInclusive(0, 20)
    var num = nums[idx]
    nums.splice(idx, 1)
    return num
}

function sumSecDiagonal(mat) {
    var sum = 0;
    for (var i = 0; i < mat.length; i++) {
        var currNum = mat[i][mat.length - i - 1];
        sum += currNum;
    }
    return sum;
}

function sumPriDiagonal(mat) {
    var sum = 0;
    for (var i = 0; i < mat.length; i++) {
        var currNum = mat[i][i];
        sum += currNum;
    }
    return sum;
}

function sumCol(mat, colIdx) {
    var sum = 0;
    for (var i = 0; i < mat.length; i++) {
        var currNum = mat[i][colIdx];
        sum += currNum;
    }
    return sum;
}

function sumRow(mat, rowIdx) {
    var sum = 0;
    var row = mat[rowIdx];
    for (var i = 0; i < row.length; i++) {
        var currNum = row[i];
        sum += currNum;
    }
    return sum;
}

function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomIntInclusive(0, items.length - 1);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

var timeInter;

function setTimer() {
    var time1 = Date.now();
    timeInter = setInterval(function() {
        var time2 = Date.now(time1);
        var msTimeDiff = time2 - time1;
        var timeDiffStr = new Date(msTimeDiff).toISOString().slice(14, -2);
        updateTimer(timeDiffStr);
    }, 100);
}
clearInterval(timeInter);

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            // if (cell === WALL) className += ' wall';
            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// cleans board by removing classes
function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getEmptyCells(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === EMPTY) {
                var location = { i, j };
                emptyCells.push(location);
            }
        }
    }
    return emptyCells;
}