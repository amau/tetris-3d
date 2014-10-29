//
// Tom Sawyer Software
// Copyright 1992 - 2014
// All rights reserved.
//
// www.tomsawyer.com
//

package com.agutierrez.tetris.client;

import com.google.gwt.canvas.dom.client.Context2d;
import com.google.gwt.canvas.dom.client.CssColor;

public class Block
{
	public Block(int x,
		int y,
		String color)
	{
		this.x = x;
		this.y = y;
		this.color = CssColor.make(color);
	}


	public void update()
	{
		this.y += Tetris.BLOCK_SIZE;
	}


	public void draw(Context2d context)
	{
		context.setFillStyle(color);

		context.fillRect(this.x,
			this.y,
			Tetris.BLOCK_SIZE,
			Tetris.BLOCK_SIZE);
	}

	public int getX()
	{
		return x;
	}


	public void setX(int x)
	{
		this.x = x;
	}


	public int getY()
	{
		return y;
	}


	public void setY(int y)
	{
		this.y = y;
	}

	public CssColor color;

	public int x;

	public int y;


	public void move(int i)
	{
		if (i < 0)
		{
			this.x -= Tetris.BLOCK_SIZE;
		}
		else if (i > 0)
		{
			this.x += Tetris.BLOCK_SIZE;
		}else
		{
			this.y += Tetris.BLOCK_SIZE;
		}

	}


	public boolean isMove(int i)
	{
		if (i < 0)
		{
			return !((this.x - Tetris.BLOCK_SIZE) < 0);
		}
		else if (i > 0)
		{
			return !((this.x + Tetris.BLOCK_SIZE + Tetris.BLOCK_SIZE) > Tetris.width);
		}else
		{
			return !((this.y + Tetris.BLOCK_SIZE + Tetris.BLOCK_SIZE) > Tetris.height);
		}
	}
}
