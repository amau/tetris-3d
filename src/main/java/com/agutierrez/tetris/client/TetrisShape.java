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

import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class TetrisShape
{
	public TetrisShape(int x,
		int y,
		String color)
	{
		this.x = x;
		this.y = y;
		this.color = CssColor.make(color);

		blocks = new ArrayList<List<Block>>();

		List<Block> one = new ArrayList<Block>();

		one.add(new Block(x + 1 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));
		one.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));
		one.add(new Block(x + 3 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));
		one.add(new Block(x + 1 * Tetris.BLOCK_SIZE,
			y + 2 * Tetris.BLOCK_SIZE,
			color));
		List<Block> two = new ArrayList<Block>();

		two.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 0 * Tetris.BLOCK_SIZE,
			color));
		two.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));
		two.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 2 * Tetris.BLOCK_SIZE,
			color));
		two.add(new Block(x + 3 * Tetris.BLOCK_SIZE,
			y + 2 * Tetris.BLOCK_SIZE,
			color));

		List<Block> three = new ArrayList<Block>();

		three.add(new Block(x + 3 * Tetris.BLOCK_SIZE,
			y + 0 * Tetris.BLOCK_SIZE,
			color));
		three.add(new Block(x + 1 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));
		three.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));
		three.add(new Block(x + 3 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));

		List<Block> four = new ArrayList<Block>();

		four.add(new Block(x + 1 * Tetris.BLOCK_SIZE,
			y + 0 * Tetris.BLOCK_SIZE,
			color));
		four.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 0 * Tetris.BLOCK_SIZE,
			color));
		four.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 1 * Tetris.BLOCK_SIZE,
			color));
		four.add(new Block(x + 2 * Tetris.BLOCK_SIZE,
			y + 2 * Tetris.BLOCK_SIZE,
			color));

		blocks = new ArrayList<List<Block>>(4);
		blocks.add(one);
		blocks.add(two);
		blocks.add(three);
		blocks.add(four);
	}


	public void update()
	{
		if (isMove(0))
		{
			move(0);
		}

	}


	public void draw(Context2d context)
	{
		for (Block block : blocks.get(orientation % blocks.size()))
		{
			block.draw(context);
		}
	}


	public void rotateClockWise()
	{
		orientation++;
	}

	private List<List<Block>> blocks;

	private int orientation = 0;

	private static int[] lines = { 0xF000,
		0x0F00,
		0x00F0,
		0x000F
	};

	protected int first = 0xF000;

	protected int second = 0x0F00;

	protected int third = 0x00F0;

	protected int fourth = 0x000F;

	public CssColor color;

	public int x;

	public int y;


	public void move(int i)
	{
		for (Block block : blocks.get(orientation % blocks.size()))
		{
			block.move(i);
		}

	}


	public boolean isMove(int i)
	{
		boolean res = true;
		for (Block block : blocks.get(orientation % blocks.size()))
		{
			res &= block.isMove(i);
		}
		return res;
	}
}
