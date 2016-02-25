var board;

var interval;

// Representation of tetris pieces with shape and color.
var i = { id: 'i', blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], colorName: 'cyan'   , color: 0};
/*

0000
1111
0000
0000

0010
0010
0010
0010

0000
0000
1111
0000

0100
0100
0100
0100
*/
var j = { id: 'j', blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], colorName: 'blue'   , color: 1};
/*
0100
0100
1100
0000

1000
1110
0000
0000

0110
0100
0100
0000

0000
1110
0010
0000
*/
var l = { id: 'l', blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], colorName: 'orange' , color: 2};
/*
0100
0100
0110
0000

0000
1110
1000
0000

1100
0100
0100
0000

0010
1110
0000
0000
*/
var o = { id: 'o', blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], colorName: 'yellow' , color: 3};
/*
1100
1100
0000
0000

1100
1100
0000
0000

1100
1100
0000
0000

1100
1100
0000
0000
*/
var s = { id: 's', blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], colorName: 'green'  , color: 4};

/*
0000
0110
1100
0000

1000
1100
0100
0000

0110
1100
0000
0000

0100
0110
0010
0000
*/
var t = { id: 't', blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], colorName: 'purple' , color: 5};
/*
0000
1110
0100
0000

0100
1100
0100
0000

0100
1110
0000
0000

0100
0110
0100
0000
*/
var z = { id: 'z', blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], colorName: 'red'    , color: 6};
/*
0000
1100
0110
0000

0100
1100
1000
0000

1100
0110
0000
0000

0010
0110
0100
0000
*/

var COLORS = 
{
 0:'black',
 1:'cyan', 
 2:'blue', 
 3:'orange', 
 4:'yellow', 
 5:'green', 
 6:'purple', 
 7:'red'
}

// Size of our board.
var COLUMNS = 10;
var ROWS = 22;
var TETRIMINO_SIZE = 4;
var TETRIMINO_HEIGHT = TETRIMINO_SIZE;
var TETRIMINO_WIDTH = TETRIMINO_SIZE;

function paintPieceInBoard(x,y,piece,direction)
{
    
}

function paintPiece(piece, rotation)
{
    var blocks = piece.blocks[rotation];
    var first =  0x000F << (3 * 4);
    var second = 0x000F << (2 * 4);
    var third =  0x000F << (1 * 4);
    var fourth = 0x000F << (0 * 4);
    
    console.log(format4block((blocks&first)  >> (3 * 4)));
    console.log(format4block((blocks&second) >> (2 * 4)));
    console.log(format4block((blocks&third)  >> (1 * 4)));
    console.log(format4block(blocks&fourth)  >> (0 * 4));
}

/**

**/
function checkLines()
{
    var x, y, complete;
    for(y = ROWS -1; y >= 0; y--) 
    {
        console.log(y);
        complete = true;
        for(x = 0; x < COLUMNS ; x++)
        {
            if(getBoardPosition(x,y)==0)
            {
                complete=false;
            }
        }
        console.log(y+":"+complete);
        if(complete)
        {
            removeLine(y);
            y++;
        }
    }
}

/**
This method will remove the n-th line by moving the lines below up.
**/
function removeLine(n)
{
    var y;
    for(y = n; y > 0; y--)
    {
        board[y] = board[y - 1];
    }
    board[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function checkPiecePosition(x,y,piece,direction)
{
    var blocks = piece.blocks[direction];
    var row = 0;
    var column = 0;
    for ( bit = 0x8000 ; bit > 0 ; bit = bit >> 1)
    {
    //    console.log("----------------------------");
    //    console.log(format16block(blocks));
    //    console.log(format16block(bit));
    //    console.log(bit & blocks);
    //    console.log(bit & blocks?"true":"false");
        
        if(bit & blocks)
        {
            if(isInvalid(x+column,y+row))
            {
                return false;
            }
        }
        
    //    console.log("("+column+","+row+")");
        
        column++;
        if(column%4 == 0)
        {
            row++;
            column=0;
        }
    }
    return true;
}

function formatNBlock(i,n)
{
    var result = "";
    
    if(i==0)
    {
        for(var j=0 ; j< n; j++)
        {
            result="0"+result;
        }
        return result;
    }
    if(i==1)
    {
        for(var j=0 ; j< n-1; j++)
        {
            result="0"+result;
        }
        return result+i;
    }
    var number = (1<<n)-1;
    for(var j=n-1; j>=0; j--)
    {
        if(i>number)
        {
            for(var k=0 ; k< n-j-2; k++)
            {
                result="0"+result;
            }
            return result+i.toString(2);
        }
        number= number>>1;
    }
}

function format4block(i)
{
    return formatNBlock(i,4);
}

function format16block(i)
{
    return formatNBlock(i,16);
}

function getRowFromPiece(row, piece, direction)
{
    var mask = 0xF << (row * 4);
    var blocks = piece.blocks[direction];
    var row = (mask & blocks) >> (row * 4);
    
    return new Array(row & (1<<3), row & (1<<2), row & (1<<1), row & 1);
}

function getBoardPosition(x,y)
{
    return board[y][x];
}

function isInvalid(x,y)
{
    if ((x < 0) || (x >= COLUMNS) || (y < 0) || (y >= ROWS) || getBoardPosition(x,y))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isValid(x,y)
{
    !isInvalid(x,y);
}

function draw()
{
    for ( var y = 2; y < ROWS ; y++ )
    {
        var newRowContent = "<tr><td>"+drawRow(board[y])+"</td></tr>";
        //console.log(newRowContent);
        $("#tetris tbody").append(newRowContent);
    }
}

function drawRow(row)
{
    var out = "";
    for ( var x = 0; x < COLUMNS ; x++ )
    {
        out = out + (row[x]?"<span class='red'>" + row[x] + "</span>":"<span class='white'>0</span>");
    }
    return out;
}


function drawRowPieceAndBoard(c,pieceRow,row,color)
{
    var out = "";
    var col = 0;
    
    
    for ( var x = 0; x < COLUMNS ; x++ )
    {
        //console.log(c+","+col+","+x);
        if(x==c+col)
        {
            //console.log(c+","+col+","+x+","+row[x]+","+pieceRow[col]);
            out = out + (row[x]^pieceRow[col]?"<span class="+"'"+"red"+"'"+">1</span>":"<span class='white'>0</span>");
            col++;
            if(col%4==0)
            {
                col=0;
            }
        }
        else
        {
            out = out + (row[x]?"<span class='red'>1</span>":"<span class='white'>0</span>");

        }
    }
    return out;
}

function drawPieceAndBoard(x,y,piece,direction)
{
    var row = 0;
    var newRowContent;
    for ( var yay = 2; yay < ROWS ; yay++ )
    {
        if(yay==y+row)
        {
            newRowContent = "<tr><td>"+drawRowPieceAndBoard(x,getRowFromPiece((3-row),piece,direction),board[yay],piece.colorName)+"</td></tr>";
            row++;
            if(row%4==0)
            {
                row=0;
            }
        }
        else
        {
        //    console.log("alooo" + board[yay]);
            newRowContent = "<tr><td>"+drawRow(board[yay])+"</td></tr>";
            
        }
        //console.log(newRowContent);
        $("#tetris tbody").append(newRowContent);
    }
}

function persistPiece(x, y, piece, rotation)
{
    var blocks = piece.blocks[rotation];
    var row = 0;
    var column = 0;
    for (bit = 0x8000 ; bit > 0 ; bit = bit >> 1)
    {
        //    console.log("----------------------------");
        //    console.log(format16block(blocks));
        //    console.log(format16block(bit));
        //    console.log(bit & blocks);
        //    console.log(bit & blocks?"true":"false");
        
        if(bit & blocks)
        {
            board[y + row][x + column] = 1; //TODO: piece.color;    
        }
        column++;
        if(column%4 == 0)
        {
            row++;
            column = 0;
        }
    }
    return true;
}



var vertical = 0;
var horizontal = 4;
var rotation = 0;
var current;
var pieces = [i,s,z,l,j,o,t];

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
This function will check if moving the current piece one position down.
**/
function update()
{
    console.log("update");
    thing();
    if(checkPiecePosition(horizontal,vertical + 1,current,rotation))
    {
        vertical++;  
    }
    else
    {
        persistPiece(horizontal,vertical,current,rotation);
        checkLines();
        newPiece();
        if(!checkPiecePosition(horizontal,vertical+1,current,rotation))
        {
            // GAME OVER, start over again.
            init();
        }    
    }
    // Clear the screen to paint again.
    $("#board").empty();
    drawPieceAndBoard(horizontal,vertical,current,rotation);
}

/**
Debugging purpose function.
**/
function printAllPieces()
{
    console.log("ssssssssssssss");
    paintPiece(s,0);
    console.log("ssssssssssssss");
    paintPiece(s,1);
    console.log("ssssssssssssss");
    paintPiece(s,2);
    console.log("ssssssssssssss");
    paintPiece(s,3);
    console.log("zzzzzzzzzzzzzz");
    paintPiece(z,0);
    console.log("zzzzzzzzzzzzzz");
    paintPiece(z,1);
    console.log("zzzzzzzzzzzzzz");
    paintPiece(z,2);
    console.log("zzzzzzzzzzzzzz");
    paintPiece(z,3);
    console.log("llllllllllllll");
    paintPiece(l,0);
    console.log("llllllllllllll");
    paintPiece(l,1);
    console.log("llllllllllllll");
    paintPiece(l,2);
    console.log("llllllllllllll");
    paintPiece(l,3);
    console.log("oooooooooooooo");
    paintPiece(o,0);
    console.log("oooooooooooooo");
    paintPiece(o,1);
    console.log("oooooooooooooo");
    paintPiece(o,2);
    console.log("oooooooooooooo");
    paintPiece(o,3);
    console.log("iiiiiiiiiiiiii");
    paintPiece(i,0);
    console.log("iiiiiiiiiiiiii");
    paintPiece(i,1);
    console.log("iiiiiiiiiiiiii");
    paintPiece(i,2);
    console.log("iiiiiiiiiiiiii");
    paintPiece(i,3);
    console.log("jjjjjjjjjjjjjj");
    paintPiece(j,0);
    console.log("jjjjjjjjjjjjjj");
    paintPiece(j,1);
    console.log("jjjjjjjjjjjjjj");
    paintPiece(j,2);
    console.log("jjjjjjjjjjjjjj");
    paintPiece(j,3);
    console.log("tttttttttttttt");
    paintPiece(t,0);
    console.log("tttttttttttttt");
    paintPiece(t,1);
    console.log("tttttttttttttt");
    paintPiece(t,2);
    console.log("tttttttttttttt");
    paintPiece(t,3);
}

function thing()
{
    example = 0xF000;
    console.log(example);
    for (bit = 0x8000 ; bit > 0 ;bit = bit >> 1)
    {
	console.log(bit);
    }
}

/**
Debugging purpose function.
**/
function test()
{
    var xa = 0;
    var ya = 0;
    
    if(checkPiecePosition(xa,ya,i,0))
    {
        console.log("Piece can be placed at ("+xa+","+ya+")");
    }
    else
    {
        console.log("Piece can't be placed at ("+xa+","+ya+")");
    }
/**    
    
    console.log(isInvalid(3, 5)?"Invalid":"Valid");
    console.log(isInvalid(0, 0)?"Invalid":"Valid");
    
    console.log(formatNBlock(5,10));
    console.log(formatNBlock(5,5));
    console.log(formatNBlock(5,6));
    console.log("Get row from piece.");
    console.log(getRowFromPiece(0,z,3));
    console.log(getRowFromPiece(1,z,3));
    console.log(getRowFromPiece(2,z,3));
    console.log(getRowFromPiece(3,z,3));
**/
}
function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if ( checkPiecePosition(horizontal-1,vertical,current,rotation))
            {
               horizontal--;
            }
            break;
        case 'right':
            if ( checkPiecePosition(horizontal+1,vertical,current,rotation)) {
                horizontal++;
            }
            break;
        case 'down':
            if ( checkPiecePosition(horizontal,vertical+1,current,rotation)) {
                vertical++;
            }
            break;
        case 'rotate':
            if (checkPiecePosition(horizontal,vertical+1,current,(rotation+1)%4)) {
                rotation = (rotation+1)%4;
            }
            break;
    }
}

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

function printBoardToElement(board, element)
{
    console.log(board);
    var row = "";
    for(var i = 0; i < ROWS; i++)
    {
        tbody = document.getElementById(element);;
        tr = tbody.insertRow(-1);
        var td = document.createElement("td");
        row = "<td>";
        for(var j = 0; j < COLUMNS; j++)
        {
            row = row + "<span class='" + getColor(board[i][j]) + "'>" + board[i][j] + "</span>";
        }
        row = row + "</td>";
        td.innerHTML = row;
        tr.appendChild(td);
    }
}

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

TODO: Needs to check for bounds.
**/
function renderTetrimino(x, tetrimino, rotation)
{
    var arr = [];
    for(var i = 0; i < TETRIMINO_HEIGHT; i++)
    {
        var row = [];
        for(var j = 0; j < COLUMNS; j++)
        {
            row.push(0);
        }

        arr.push(row);
    }
    for(var i = 0; i < TETRIMINO_HEIGHT; i++)
    {
        for(var j = x; j - x < TETRIMINO_WIDTH; j++)
        {
            pos = j - x;
            block = tetrimino.blocks[rotation];
            mask = 0x000F << ((TETRIMINO_SIZE - (i + 1)) * 4);
            row = (block&mask) >> ((TETRIMINO_SIZE - (i + 1)) * 4) ;
            arr[i][j] = position(pos, row);
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

function init()
{
               board = [[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]];

                console.log("************");
                printBoardToConsole(test1);
                console.log("************");
                printBoardToElement(test2, "board");
                console.log("position: ");

                paintPiece(z, 2);

                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(0, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(1, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(2, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(3, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(4, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(5, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(6, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(7, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(8, z, 2));
                console.log("render tetrimino: ");
                printBoardToConsole(renderTetrimino(9, z, 2));

                console.log(format4block((0x0E80&0x0F00)>>8));
                console.log(position(0,  (0x0E80&0x0F00)>>8));
                console.log(position(1,  (0x0E80&0x0F00)>>8));
                console.log(position(2,  (0x0E80&0x0F00)>>8));
                console.log(position(3,  (0x0E80&0x0F00)>>8));


}


               test1 = [[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]];

                test2 = [[0,1,0,0,0,0,0,0,0,0],
                [0,0,2,0,0,0,0,0,0,0],
                [0,0,0,3,0,0,0,0,0,0],
                [7,0,0,0,4,0,0,0,0,0],
                [7,0,0,0,0,5,0,0,0,0],
                [7,0,0,0,0,0,6,0,0,0],
                [7,0,0,0,0,0,0,0,0,0],
                [7,0,0,0,0,0,0,0,1,0],
                [7,0,6,0,0,1,0,0,0,0],
                [7,0,6,0,0,2,0,0,0,0],
                [7,0,6,0,0,3,0,0,0,0],
                [7,0,6,0,0,4,0,0,0,0],
                [7,0,0,0,3,0,2,2,2,0],
                [7,0,0,0,3,0,2,2,2,0],
                [0,0,0,0,3,0,0,2,0,0],
                [1,1,1,1,3,0,0,2,0,0],
                [0,0,0,0,0,1,0,0,0,0],
                [0,0,0,0,0,2,0,0,0,0],
                [0,0,0,0,0,3,0,0,0,0],
                [0,0,0,0,0,4,0,0,0,0],
                [0,0,0,0,0,5,0,0,0,0],
                [0,0,0,0,0,6,0,0,0,0]];

/**
Main method of the game, it controls the initialization and the game loop.
**/
function tetris()
{
    clearInterval(interval);
    init();
    //newPiece();
    //interval = setInterval(update, 250);    
}

$(document).ready(function()
{
    tetris();
    test();
});

$(document).keydown(function( e ) {
    console.log("Key pressed");
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate'
    };
    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
        //update();
    }
});
