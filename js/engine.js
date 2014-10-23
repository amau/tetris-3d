var board;

var interval;

var i = { id: 'i', size: 4, blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: 'cyan'   };
var j = { id: 'j', size: 3, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'   };
var l = { id: 'l', size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' };
var o = { id: 'o', size: 2, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' };
var s = { id: 's', size: 3, blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'  };
var t = { id: 't', size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' };
var z = { id: 'z', size: 3, blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'    };

var columns = 10;
var rows = 22;

function paintPieceInBoard(x,y,piece,direction)
{
	
}

function paintPiece(piece,direction)
{
	var blocks = piece.blocks[direction];
	var first =  0xF000;
	var second = 0x0F00;
	var third =  0x00F0;
	var fourth = 0x000F;
	
	console.log(format4block((blocks&first) >>12));
	console.log(format4block((blocks&second) >>8));
	console.log(format4block((blocks&third) >>4));
	console.log(format4block(blocks&fourth));
}

function checkLines()
{
	var x, y, complete;
	for(y = rows -1 ; y >= 0 ; y--) {
		console.log(y);
		complete = true;
		for(x = 0; x < columns ; x++)
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

	
function removeLine(n)
{
	var y;
	for(y=n;y>0;y--)
	{
		board[y]=board[y-1];
	}
	board[0] = [0,0,0,0,0,0,0,0,0,0];
}

function checkPiecePosition(x,y,piece,direction)
{
	var blocks = piece.blocks[direction];
	var row = 0;
	var column = 0;
	for ( bit = 0x8000 ; bit > 0 ; bit = bit >> 1)
	{
	//	console.log("----------------------------");
	//	console.log(format16block(blocks));
	//	console.log(format16block(bit));
	//	console.log(bit & blocks);
	//	console.log(bit & blocks?"true":"false");
		
		if(bit & blocks)
		{
			if(isInvalid(x+column,y+row))
			{
				return false;
			}
		}
		
	//	console.log("("+column+","+row+")");
		
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

function getRowFromPiece(row,piece,direction)
{
	var mask = 0xF << (row * 4);
	var blocks = piece.blocks[direction];
	var row = (mask&blocks)>>(row * 4);
	
	return new Array(row&(1<<3),row&(1<<2),row&(1<<1),row&1);
	
}

function getBoardPosition(x,y)
{
	return board[y][x];
}

function isInvalid(x,y)
{
	if ((x < 0) || (x >= columns) || (y < 0) || (y >= rows) || getBoardPosition(x,y))
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
	for ( var y = 2; y < rows ; y++ )
	{
		var newRowContent = "<tr><td>"+drawRow(board[y])+"</td></tr>";
		//console.log(newRowContent);
		$("#tetris tbody").append(newRowContent);
	}
}

function drawRow(row)
{
	var out = "";
	for ( var x = 0; x < columns ; x++ )
	{
		out = out + (row[x]?"<span class='red'>1</span>":"<span class='white'>0</span>");
	}
	return out;
}


function drawRowPieceAndBoard(c,pieceRow,row,color)
{
	var out = "";
	var col = 0;
	
	
	for ( var x = 0; x < columns ; x++ )
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
	for ( var yay = 2; yay < rows ; yay++ )
	{
		if(yay==y+row)
		{
			newRowContent = "<tr><td>"+drawRowPieceAndBoard(x,getRowFromPiece((3-row),piece,direction),board[yay],piece.color)+"</td></tr>";
			row++;
			if(row%4==0)
			{
				row=0;
			}
		}
		else
		{
		//	console.log("alooo" + board[yay]);
			newRowContent = "<tr><td>"+drawRow(board[yay])+"</td></tr>";
			
		}
		//console.log(newRowContent);
		$("#tetris tbody").append(newRowContent);
	}
}

function persistPiece(x,y,piece,direction)
{
	var blocks = piece.blocks[direction];
	var row = 0;
	var column = 0;
	for ( bit = 0x8000 ; bit > 0 ; bit = bit >> 1)
	{
		//	console.log("----------------------------");
		//	console.log(format16block(blocks));
		//	console.log(format16block(bit));
		//	console.log(bit & blocks);
		//	console.log(bit & blocks?"true":"false");
		
		if(bit & blocks)
		{
			board[y+row][x+column]=1;
			
		}
		
		//	console.log("("+column+","+row+")");
		
		column++;
		if(column%4 == 0)
		{
			row++;
			column=0;
		}
	}
	return true;
}

function tetris()
{
	clearInterval(interval);
    init();
    //newShape();
	newPiece();
    //lose = false;
    interval = setInterval( update, 250 );
	
}

var vertical = 0;
var horizontal = 4;
var rotation = 0;
var current;
var pieces = [i,s,z,l,j,o,t];

function newPiece()
{
	vertical = 0;
	horizontal = 4;
	rotation = 0;
	current = pieces[Math.floor((Math.random()*7))];
	
}

function update()
{
	console.log("update");
	if(checkPiecePosition(horizontal,vertical+1,current,rotation))
	{
		vertical++;
		$("#board").empty();
		drawPieceAndBoard(horizontal,vertical,current,rotation);
	}
	else
	{
		persistPiece(horizontal,vertical,current,rotation);
		checkLines();
		newPiece();
		if(!checkPiecePosition(horizontal,vertical+1,current,rotation))
		{
			init();
		}
		$("#board").empty();
		drawPieceAndBoard(horizontal,vertical,current,rotation);
	}
}


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

function test()
{
	printAllPieces();

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
	
	
	console.log(isInvalid(3, 5)?"Invalid":"Valid");
	console.log(isInvalid(0, 0)?"Invalid":"Valid");
	
	console.log(formatNBlock(5,10));
	console.log(formatNBlock(5,5));
	console.log(formatNBlock(5,6));
	console.log(getRowFromPiece(0,z,3));
	console.log(getRowFromPiece(1,z,3));
	console.log(getRowFromPiece(2,z,3));
	console.log(getRowFromPiece(3,z,3));
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
}

$(document).ready(function()
{
	tetris();
	//test();
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
