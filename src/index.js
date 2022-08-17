//@ts-check

import Phaser from "phaser";

//* Game Mappings
// The available types of shapes
const ShapeType = {
	I: "I",
	J: "J",
	L: "L",
	O: "O",
	S: "S",
	T: "T",
	Z: "Z",
};
// The board dimensions
const BoardGrid = {
	Columns: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440],
	Rows: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 840],
};

//* Game Constants
const GameTickSpeed = 1000; // In Milliseconds
const SpritesheetColours = 7;
const GridSize = 40; // In Pixels

//* Game Classes
class Vector2 {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Cell extends Phaser.GameObjects.Image {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {Vector2} position
	 * @param {string | Phaser.Textures.Texture} texture
	 * @param {string | number | undefined} frame
	 */
	constructor(scene, position, texture, frame) {
		super(scene, position.x, position.y, texture, frame);
	}
}

class Piece extends Phaser.GameObjects.Group {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children
	 * @param {Phaser.Types.GameObjects.Group.GroupConfig | undefined} configuration
	 */
	constructor(scene, children, configuration) {
		super(scene, children, configuration);
	}
}

class ScoreText extends Phaser.GameObjects.Text {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {Vector2} position
	 * @param {string | string[]} text
	 * @param {Phaser.Types.GameObjects.Text.TextStyle} style
	 */
	constructor(scene, position, text, style) {
		super(scene, position.x, position.y, text, style);
	}
}

class PieceMatrix {
	/**
	 * @param {number[]} columns
	 * @param {number[]} rows
	 */
	constructor(columns, rows) {
		// Define the size of the piece matrix
		this.xSize = columns[columns.length - 1] / GridSize;
		this.ySize = rows[rows.length - 1] / GridSize;

		// Set up the piece matrix
		columns.forEach((x) => {
			this._pieceMatrix[x] = [];

			rows.forEach((y) => {
				this._pieceMatrix[x][y] = false;
			});
		});
	}

	/**
	 * @param {Vector2} position
	 * @param {boolean} newValue
	 */
	setCell(position, newValue) {
		this._pieceMatrix[position.x][position.y] = newValue;
	}

	/**
	 * @param {Vector2[]} positions
	 * @returns {boolean}
	 */
	checkCollision(positions) {
		let isOk = true;

		positions.forEach((vector2) => {
			if (this.getCell(vector2)) {
				isOk = false;
			}
		});

		return isOk;
	}

	/**
	 * @param {Vector2} position
	 * @returns {boolean}
	 */
	getCell(position) {
		return this._pieceMatrix[position.x][position.y];
	}

	//* Class Variables
	/**
	 * @type {number}
	 */
	xSize;

	/**
	 * @type {number}
	 */
	ySize;

	/**
	 * @type {boolean[][]}
	 */
	_pieceMatrix = [];
}

//* Main Scene
class Tetris extends Phaser.Scene {
	preload() {
		this.load.spritesheet(
			"tetrominos",
			"src/assets/BlockSpriteSheet.png",
			{ frameWidth: 40, frameHeight: 40 }
		);
	}

	create() {
		// Set up the game's main camera
		const cameraPosition = new Vector2(0, 0);
		const cameraSize = new Vector2(GameConfig.width, GameConfig.height);
		this._camera = this.cameras.add(cameraPosition.x, cameraPosition.y, cameraSize.x, cameraSize.y, true, "TetrisMain");
		this._camera.setBackgroundColor(0x000000);

		BoardGrid.Columns.forEach((x) => {
			const rectPos = new Vector2(x, 0);
			const rectSize = new Vector2(1, GameConfig.height);
			const gridLine = this.add.rectangle(rectPos.x, rectPos.y, rectSize.x, rectSize.y, 0x333333);

			gridLine.setOrigin(0, 0);

			this._gridLines.push(gridLine);
		});

		BoardGrid.Rows.forEach((y) => {
			const rectPos = new Vector2(0, y);
			const rectSize = new Vector2(GameConfig.width, 1);
			const gridLine = this.add.rectangle(rectPos.x, rectPos.y, rectSize.x, rectSize.y, 0x333333);

			gridLine.setOrigin(0, 0);

			this._gridLines.push(gridLine);
		});

		this.updateTickSpeed(GameTickSpeed);

		this._keydownEvent = this.input.keyboard.on("keydown", this.keyDown, this);
	}

	//* Lifecycle Events
	physicsStep() {}
	/**
	 * @param {Phaser.Input.Keyboard.Key} key 
	 */
	keyDown(key) {}


	/**
	 * @param {number} speed
	 */
	updateTickSpeed(speed) {
		clearInterval(this._physicsInterval);

		this._physicsInterval = setInterval(this.physicsStep, speed);
	}


	//* Class Variables
	_pieceMatrix = new PieceMatrix(BoardGrid.Columns, BoardGrid.Rows);
	
	/**
	 * @type {Phaser.Cameras.Scene2D.Camera}
	 */
	_camera;

	/**
	 * @type {Phaser.GameObjects.Rectangle[]}
	 */
	_gridLines = [];

	/**
	 * @type {NodeJS.Timer}
	 */
	_physicsInterval;

	/**
	 * @type {Phaser.Input.Keyboard.KeyboardPlugin}
	 */
	_keydownEvent;
}

const GameConfig = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 480,
	height: 880,
	scene: Tetris,
};
const Game = new Phaser.Game(GameConfig);

