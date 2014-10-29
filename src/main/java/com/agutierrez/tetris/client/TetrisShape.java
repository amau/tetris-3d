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
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.Random;

import java.util.logging.Logger;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

public class TetrisShape
{
	public TetrisShape(int x,
		int y,
		String color)
	{
		this.x = x;
		this.y = y;
		this.color = CssColor.make(color);
		
		int random = Random.nextInt(6);
		switch(random)
		{
			case 0:
				this.block = TetrisShape.I;
				break;
			case 1:
				this.block = TetrisShape.J;
				break;
			case 2:
				this.block = TetrisShape.L;
				break;
			case 3:
				this.block = TetrisShape.O;
				break;
			case 4:
				this.block = TetrisShape.S;
				break;
			case 5:
				this.block = TetrisShape.T;
				break;
			case 6:
				this.block = TetrisShape.Z;
				break;
		}
	}


	public void update()
	{

		this.y += Tetris.BLOCK_SIZE;

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


	public boolean isMove(int direction,
		List<Block> blocks)
	{
		if (direction < 0)
		{
			return isMove(this.x - Tetris.BLOCK_SIZE,
				this.y,
				this.orientation,
				blocks);
		}
		else if (direction > 0)
		{
			return isMove(this.x + Tetris.BLOCK_SIZE,
				this.y,
				this.orientation,
				blocks);
		}
		else
		{
			return isMove(this.x,
				this.y + Tetris.BLOCK_SIZE,
				this.orientation,
				blocks);
		}
	}


	public void draw(Context2d context)
	{
		printBlock(orientation % 4,
			context);
	}


	public boolean canRotate(
		List<Block> blocks)
	{

		return isMove(this.x,
			this.y + Tetris.BLOCK_SIZE,
			this.orientation + 1,
			blocks);
	}


	public void rotateClockWise()
	{
		orientation++;
	}

	private int orientation = 0;


	public void printBlock(int k)
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


	public List<Block> getBlocks()
	{
		return getBlocks(this.orientation);
	}


	protected List<Block> getBlocks(int k)
	{
		List<Block> blocks = new ArrayList<Block>();
		for (int i = 0; i < lines.length; i++)
		{
			for (int j = 0; j < 4; j++)
			{
				int b =
					(((lines[i] & block[k]) >> (lines.length - (1 + i)) * 4) >> 3 - j) & 1;

				if (b == 1)
				{
					blocks.add(new Block(this.x + j * Tetris.BLOCK_SIZE,
						this.y + i * Tetris.BLOCK_SIZE,
						color.toString()));
				}
			}
		}
		return blocks;
	}


	public boolean isMove(int newX,
		int newY,
		int k,
		List<Block> blocks)
	{
		for (int i = 0; i < lines.length; i++)
		{
			for (int j = 0; j < 4; j++)
			{
				int cube =
					(((lines[i] & block[k]) >> (lines.length - (1 + i)) * 4) >> 3 - j) & 1;

				if (cube == 1)
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
					for (Block b : blocks)
					{
						if ((this.x + j * Tetris.BLOCK_SIZE) == b.getX() &&
							(this.y + i * Tetris.BLOCK_SIZE + Tetris.BLOCK_SIZE) == b
								.getY())
						{
							Logger logger = Logger.getLogger("NameOfYourLogger");
							logger.log(Level.SEVERE,
								(this.y + i * Tetris.BLOCK_SIZE) + "," + b.getY());

							return false;
						}
						if ((this.x + j * Tetris.BLOCK_SIZE + Tetris.BLOCK_SIZE) == b
							.getX() &&
							(this.y + i * Tetris.BLOCK_SIZE) == b.getY())
						{
							Logger logger = Logger.getLogger("NameOfYourLogger");
							logger.log(Level.SEVERE,
								(this.y + i * Tetris.BLOCK_SIZE) + "," + b.getY());

							return false;
						}
						if ((this.x + j * Tetris.BLOCK_SIZE - Tetris.BLOCK_SIZE) == b
							.getX() &&
							(this.y + i * Tetris.BLOCK_SIZE + Tetris.BLOCK_SIZE) == b
								.getY())
						{
							Logger logger = Logger.getLogger("NameOfYourLogger");
							logger.log(Level.SEVERE,
								(this.y + i * Tetris.BLOCK_SIZE) + "," + b.getY());

							return false;
						}
					}
				}
			}
		}
		return true;
	}

	private final static int[] lines = { 0xF000,
		0x0F00,
		0x00F0,
		0x000F
	};

	private int[] block;

	private final static int[] I = { 0x0F00,
		0x2222,
		0x00F0,
		0x4444
	};

	private final static int[] J = { 0x44C0,
		0x8E00,
		0x6440,
		0x0E20
	};

	private final static int[] L = { 0x4460,
		0x0E80,
		0xC440,
		0x2E00
	};

	private static int[] O = { 0xCC00,
		0xCC00,
		0xCC00,
		0xCC00
	};

	private final static int[] S = { 0x06C0,
		0x8C40,
		0x6C00,
		0x4620
	};

	private final static int[] T = { 0x0E40,
		0x4C40,
		0x4E00,
		0x4640
	};

	private final static int[] Z = { 0x0C60,
		0x4C80,
		0xC600,
		0x2640
	};

	public CssColor color;

	public int x;

	public int y;

}
