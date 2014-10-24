
package com.agutierrez.tetris.client;

import com.google.gwt.canvas.client.Canvas;
import com.google.gwt.canvas.dom.client.Context2d;
import com.google.gwt.canvas.dom.client.CssColor;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.dom.client.KeyPressEvent;
import com.google.gwt.event.dom.client.KeyPressHandler;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;

public class Tetris implements EntryPoint
{
	public void onModuleLoad()
	{
		canvas = Canvas.createIfSupported();
		backBuffer = Canvas.createIfSupported();

		RootPanel.get().add(new Label(upgradeMessage));
		// init the canvases
		canvas.setWidth(width + "px");
		canvas.setHeight(height + "px");
		canvas.setCoordinateSpaceWidth(width);
		canvas.setCoordinateSpaceHeight(height);
		backBuffer.setCoordinateSpaceWidth(width);
		backBuffer.setCoordinateSpaceHeight(height);
		RootPanel.get(holderId).add(canvas);

		context = canvas.getContext2d();
		backBufferContext = backBuffer.getContext2d();
		// context.fillText("Hello Canvas!", 100, 100);

		block = new TetrisShape(0,
			0,
			"rgba(255,0,255,1)");
		initHandlers();

		canvas.setFocus(true);
		// setup timer
		final Timer timer = new Timer()
		{
			@Override
			public void run()
			{
				update();
			}
		};
		timer.scheduleRepeating(refreshRate);
	}


	public void update()
	{
		block.update();
		context = canvas.getContext2d();
		context.setFillStyle("rgba(155,0,255,1)");
		context.fillRect(0,
			0,
			width,
			height);
		context.setFillStyle("rgba(0,0,255,1)");
		context.fillRect(0,
			0,
			width,
			2 * Tetris.BLOCK_SIZE);
		block.draw(context);
	}


	public void initHandlers()
	{
		canvas.addKeyDownHandler(new KeyDownHandler()
		{

			public void onKeyDown(KeyDownEvent event)
			{
				int code = event.getNativeKeyCode();
				if (KeyCodes.KEY_DOWN == code)
				{
					if (block.isMove(0))
					{
						block.move(0);
					}
				}
				else if (KeyCodes.KEY_LEFT == code)
				{
					if (block.isMove(-1))
					{
						block.move(-1);
					}
				}
				else if (KeyCodes.KEY_RIGHT == code)
				{
					if (block.isMove(1))
					{
						block.move(1);
					}
				}
				else if (KeyCodes.KEY_SPACE == code)
				{
					if (block.canRotate())
					{
						block.rotateClockWise();
					}
				}
			}
		});
	}

	protected TetrisShape block;

	protected Canvas canvas;

	protected Canvas backBuffer;

	protected Context2d context;

	protected Context2d backBufferContext;

	// canvas size, in px
	static final int height = Tetris.BLOCK_SIZE * 22;

	static final int width = Tetris.BLOCK_SIZE * 10;

	static final int BLOCK_SIZE = 20;

	static final int refreshRate = 500;

	static final String holderId = "tetriscontainer";

	static final String upgradeMessage =
		"Your browser does not support the HTML5 Canvas. Please upgrade your browser to view this demo.";
}