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

public class TetrisShape
{
	public TetrisShape(int x,
		int y,
		String color)
	{
		this.x = x;
		this.y = y;
		this.color = CssColor.make(color);
	}


	public void update()
	{
		if (isMove(this.x,
			this.y + Tetris.BLOCK_SIZE,
			this.orientation))
		{
			this.y += Tetris.BLOCK_SIZE;
		}

	}


	public void move(int direction)
	{
		if (direction < 0)
		{
			this.x -= Tetris.BLOCK_SIZE;
		}
		else if (direction > 0)
		{
			this.x += Tetris.BLOCK_SIZE;
		}
		else
		{
			this.y += Tetris.BLOCK_SIZE;
		}
	}


	public boolean isMove(int direction)
	{
		if (direction < 0)
		{
			return isMove(this.x - Tetris.BLOCK_SIZE,
				this.y,
				this.orientation);
		}
		else if (direction > 0)
		{
			return isMove(this.x + Tetris.BLOCK_SIZE,
				this.y,
				this.orientation);
		}
		else
		{
			return isMove(this.x,
				this.y + Tetris.BLOCK_SIZE,
				this.orientation);
		}
	}


	public void draw(Context2d context)
	{
		printBlock(orientation % 4,
			context);
	}


	public boolean canRotate()
	{

		return isMove(this.x,
			this.y + Tetris.BLOCK_SIZE,
			this.orientation + 1);
	}


	public void rotateClockWise()
	{
		orientation++;
	}

	private int orientation = 0;


	public static void main(String args[])
	{
		printBlock(0);
		System.out.println("****");
		printBlock(1);
		System.out.println("****");
		printBlock(2);
		System.out.println("****");
		printBlock(3);

	}


	public static void printBlock(int k)
	{
		for (int i = 0; i < lines.length; i++)
		{
			for (int j = 0; j < 4; j++)
			{
				int b =
					(((lines[i] & block[k]) >> (lines.length - (1 + i)) * 4) >> 3 - j) & 1;

				System.out
					.print(b +
						"");
			}
			System.out.println("");
		}
	}


	public void printBlock(int k,
		Context2d context)
	{
		for (int i = 0; i < lines.length; i++)
		{
			for (int j = 0; j < 4; j++)
			{
				int b =
					(((lines[i] & block[k]) >> (lines.length - (1 + i)) * 4) >> 3 - j) & 1;

				if (b == 1)
				{
					context.setFillStyle(color);

					context.fillRect(this.x + j * Tetris.BLOCK_SIZE,
						this.y + i * Tetris.BLOCK_SIZE,
						Tetris.BLOCK_SIZE,
						Tetris.BLOCK_SIZE);
				}
			}
		}
	}


	public boolean isMove(int newX,
		int newY,
		int k)
	{
		for (int i = 0; i < lines.length; i++)
		{
			for (int j = 0; j < 4; j++)
			{
				int b =
					(((lines[i] & block[k]) >> (lines.length - (1 + i)) * 4) >> 3 - j) & 1;

				if (b == 1)
				{
					if (newX + j * Tetris.BLOCK_SIZE < 0)
					{
						return false;
					}
					if (newX + j * Tetris.BLOCK_SIZE + Tetris.BLOCK_SIZE > Tetris.width)
					{
						return false;
					}

					if (newY + i * Tetris.BLOCK_SIZE + Tetris.BLOCK_SIZE > Tetris.height)
					{
						return false;
					}
				}
			}
		}
		return true;
	}

	private static int[] lines = { 0xF000,
		0x0F00,
		0x00F0,
		0x000F
	};

	private static int[] block = { 0x0C60,
		0x4C80,
		0xC600,
		0x2640
	};

	protected int first = 0xF000;

	protected int second = 0x0F00;

	protected int third = 0x00F0;

	protected int fourth = 0x000F;

	public CssColor color;

	public int x;

	public int y;

}
