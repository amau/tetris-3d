/**
This function writes the given array to the console.
**/
function printBoardToConsole(board)
{
    var row = "";
    for(var i = 0; i < board.length; i++)
    {
        for(var j = 0; j < board[0].length; j++)
        {
            row = row + board[i][j];
        }
        console.log(Math.random().toFixed(4)+":"+row);
        row = "";
    }
}

/**
This function renders the given in a html tbody element.
**/
function printBoardToElement(board, element)
{
    console.log(board);
    var row = "";
    for(var i = 2; i < ROWS; i++)
    {
        tbody = document.getElementById(element);;
        tr = tbody.insertRow(-1);
        var td = document.createElement("td");
        row = "<td>";
        for(var j = 0; j < COLUMNS; j++)
        {
            row = row + "<span class='" + getColor(board[i][j]) + (board[i][j]?" bold":"") + "'>" + board[i][j] + "</span>";
        }
        row = row + "</td>";
        td.innerHTML = row;
        tr.appendChild(td);
    }
}

/**
Helper function that encapsulates the retrieval of the color from the color dictionary.
**/
function getColor(index)
{
    return COLORS[index];
}

/**
This function will render with a tetrimino in the size of the board. For example:
renderTetrimino(2, z, 2)
0000000000
0001000000
0001100000
0000100000

It checks for the right and left bounds, if the tetrimino cant move in that direction
it returns false.
**/
function renderTetrimino(x, tetrimino, rotation)
{
    var arr = createZerosGrid(COLUMNS, TETRIMINO_HEIGHT);
    for(var i = 0; i < TETRIMINO_HEIGHT; i++)
    {
        for(var j = x; j - x < TETRIMINO_WIDTH; j++)
        {
            pos = j - x;
            block = tetrimino.blocks[rotation];
            mask = 0x000F << ((TETRIMINO_SIZE - (i + 1)) * 4);
            row = (block&mask) >> ((TETRIMINO_SIZE - (i + 1)) * 4);
            if(position(pos, row) && j < COLUMNS && j >= 0)
            {
                arr[i][j] = tetrimino.color;  
            }
            else
            {
                if(position(pos, row))
                {
                    return false;
                }
            }
        }
    }
    return arr;
}

/**
Given one a position and a row of a tetrimino, this function will return if that position is
filled with a zero or an one.

(0x0E80&0x0F00)>>8              -> 1110

position(0, (0x0E80&0x0F00)>>8) -> 1
position(1, (0x0E80&0x0F00)>>8) -> 1
position(2, (0x0E80&0x0F00)>>8) -> 1
position(3, (0x0E80&0x0F00)>>8) -> 0

**/
function position(x, row)
{
    var position = -1;
    if(x < 0 || x > TETRIMINO_SIZE - 1)
    {
        console.log("Error, the position is outof bounds in position function.");
    }
    else
    {
        // Creates a mask to determine the position in the array:
        // x = 0  then mask = 1000
        // x = 1  then mask = 0100
        // x = 2  then mask = 0010
        // x = 3  then mask = 0001
        var mask = 0x0001 << (TETRIMINO_SIZE - (x + 1));
        position = (row&mask) >> (TETRIMINO_SIZE - (x + 1)); 
    }
    return position;
}

/**
Given a render tetrimino, and a board, this function creates a new board matching
both arrays using a elementwise OR.
**/
function drawTetriminoOnBoard(rowNum, renderedTetrimino, thisBoard)
{
    var arr = copyBoard(thisBoard);
    for(var k = 0; k < TETRIMINO_HEIGHT; k++)
    {
        var isNotEmpty = false;
        for(var j = 0; j < COLUMNS; j++)
        {
            if(rowNum + k < ROWS)
            {
                if(!(renderedTetrimino[k][j] && thisBoard[rowNum + k][j]))
                {
                    if(renderedTetrimino[k][j])
                    {
                        arr[rowNum + k][j] = renderedTetrimino[k][j];
                    }
                    else
                    {
                        arr[rowNum + k][j] = thisBoard[rowNum + k][j];
                    }
                    
                }
                else
                {
                    // If a pieze in the rendered tetrimino is in the same position
                    // as one in the board the position is invalid.
                    return false;
                }
            }
            else
            {
                if(renderedTetrimino[k][j])
                {
                    return false;
                }
            }
        } 
    }
    return arr;
}

/**
Creates a copy of the board and returns the new array.
**/
function copyBoard(board)
{
    var arr = createZerosGrid(COLUMNS, ROWS);
    for(var k = 0; k < ROWS; k++)
    {
        for(var j = 0; j < COLUMNS; j++)
        {
            arr[k][j] = board[k][j];
        }
    }
    return arr;
}

/**
Creates a zero filled array with the dimensions of regular tetris board.
**/
function createCleanBoard()
{
    return createZerosGrid(COLUMNS, ROWS);
}

/**
Creates a zero filled array with given dimensions.
**/
function createZerosGrid(width, height)
{
    var arr = [];
    for(var i = 0; i < height; i++)
    {
        var row = [];
        for(var j = 0; j < width; j++)
        {
            row.push(0);
        }

        arr.push(row);
    }
    return arr;
}

/**
If the position is feasible, this method returns a new array with the
configuration given.
**/
function isValidMove(tetrimino, x, y, rotation, board)
{
    renderedTetrimino = renderTetrimino(x, tetrimino, rotation);
    if(renderedTetrimino)
    {
        newBoard = drawTetriminoOnBoard(y, renderedTetrimino, board);
        if(newBoard)
        {
            return newBoard;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

/**
This function will check if moving the current piece one position down.
**/
function update()
{
    
    newBoard = isValidMove(current, horizontal, vertical + 1 , rotation, board);

    if(newBoard)
    { 
        printBoardToElement(newBoard, "board");
        printBoardToConsole(newBoard);
        vertical = vertical + 1;
    }
    else
    {
        board = isValidMove(current, horizontal, vertical, rotation, board);
        
        board = checkLines(board);

        printBoardToElement(board, "board");
        printBoardToConsole(board);

        newPiece();

        if(!isValidMove(current, horizontal, vertical + 1 , rotation, board))
        {
            init();
        }
    }
    var myNode = document.getElementById("board");
    while (myNode.firstChild) 
    {
        myNode.removeChild(myNode.firstChild);
    }
    printBoardToElement(newBoard, "board");
}

/**
Looks for complete lines in the board, if it finds one, the line will be erased from the board. It returns a clone of the board without the found lines.
**/
function checkLines(board)
{
    var arr = createCleanBoard();
    var counter = board.length - 1;
    for(var k = board.length - 1; k > -1; k--)
    {
        rowSum = 0;
        for(var j = 0; j < board[0].length; j++)
        {
            if(board[k][j])
            {
                rowSum++;
            }
        }
        if(rowSum < board[0].length)
        {
            arr[counter] = board[k];
            counter--;
        }
    }
    return arr;
}

/**
This function will spawn a new piece into the board, it sets the original position and rotation.
**/
function newPiece()
{
    vertical = 0;
    horizontal = 4;
    rotation = 0;
    current = pieces[Math.floor((Math.random() * pieces.length))];    
}

/**
This method initializes the board to a clean one. This method must be called before the game loop starts.
**/
function init()
{
    board = createCleanBoard();
}

/**
Main method of the game, it controls the initialization and the game loop.
**/
function tetris()
{
    clearInterval(interval);
    init();
    newPiece();
    interval = setInterval(update, 200);    
}

/**
Helper function that maps key codes to actions.
**/
function keyDownTextField(event) 
{
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate'
    };
    if(typeof keys[event.keyCode] != 'undefined')
    {
        keyPress(keys[event.keyCode]);
    }
}

/**
Handles the actions when a key is pressed. We only have four valid moves.
**/
function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if(isValidMove(current, horizontal - 1, vertical, rotation, board))
            {
                horizontal--;
            }
            break;
        case 'right':
            if(isValidMove(current, horizontal + 1, vertical, rotation, board))
            {
               horizontal++;
            }
            break;
        case 'down':
            if(isValidMove(current, horizontal, vertical + 1, rotation, board))
            {
                vertical++;
            }
            break;
        case 'rotate':
	    rot = (rotation + 1) % 4;
            if(isValidMove(current, horizontal, vertical, rot, board))
            {
                rotation = rot;
            }
            break;
    }
}

var board;

var interval;

// Representation of tetris pieces with shape and color.
var I = { id: 'i', blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], colorName: 'cyan'   , color: 1};
/*

0000 0010 0000 0100
1111 0010 0000 0100
0000 0010 1111 0100
0000 0010 0000 0100
*/
var J = { id: 'j', blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], colorName: 'blue'   , color: 2};
/*
0100 1000 0110 0000
0100 1110 0100 1110
1100 0000 0100 0010
0000 0000 0000 0000
*/
var L = { id: 'l', blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], colorName: 'orange' , color: 3};
/*
0100 0000 1100 0010
0100 1110 0100 1110
0110 1000 0100 0000
0000 0000 0000 0000
*/
var O = { id: 'o', blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], colorName: 'yellow' , color: 4};
/*
1100 1100 1100 1100
1100 1100 1100 1100
0000 0000 0000 0000
0000 0000 0000 0000
*/
var S = { id: 's', blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], colorName: 'green'  , color: 5};
/*
0000 1000 0110 0100
0110 1100 1100 0110
1100 0100 0000 0010
0000 0000 0000 0000
*/
var T = { id: 't', blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], colorName: 'purple' , color: 6};
/*
0000 0100 0100 0100
1110 1100 1110 0110
0100 0100 0000 0100
0000 0000 0000 0000
*/
var Z = { id: 'z', blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], colorName: 'red'    , color: 7};
/*
0000 0100 1100 0010
1100 1100 0110 0110
0110 1000 0000 0100
0000 0000 0000 0000
*/

var COLORS = 
{
   0:'white',
   1:'cyan', 
   2:'blue', 
   3:'orange', 
   4:'yellow', 
   5:'green', 
   6:'purple', 
   7:'red'
}

// Constants that will be used along the game.
var COLUMNS = 10;
var ROWS = 22;
var TETRIMINO_SIZE = 4;
var TETRIMINO_HEIGHT = TETRIMINO_SIZE;
var TETRIMINO_WIDTH = TETRIMINO_SIZE;

var vertical = 0;
var horizontal = 4;
var rotation = 0;
var current;
var pieces = [I,S,Z,L,J,O,T];
document.addEventListener("keydown", keyDownTextField, false);
tetris();
