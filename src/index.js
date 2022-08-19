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
const ShapeTypes = [
	ShapeType.I,
	ShapeType.J,
	ShapeType.L,
	ShapeType.O,
	ShapeType.S,
	ShapeType.T,
	ShapeType.Z,
];
// The board dimensions
const BoardGrid = {
	Columns: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440],
	Rows: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 840],
};
const Shapes = {
	I: {
		coordinates: {
			// Rotations
			[0]: [
				[40, 0],
				[80, 0],
				[120, 0],
				[160, 0],
			],
			[90]: [
				[0, 40],
				[0, 80],
				[0, 120],
				[0, 160],
			],
			[180]: [
				[0, 0],
				[40, 0],
				[80, 0],
				[120, 0],
			],
			[270]: [
				[0, 0],
				[0, 40],
				[0, 80],
				[0, 120],
			],
		},
		gridSize: 4,
	},
	J: {
		coordinates: {
			[0]: [
				[0, 0],
				[0, 40],
				[40, 40],
				[80, 40],
			],
			[90]: [
				[80, 0],
				[40, 0],
				[40, 40],
				[40, 80],
			],
			[180]: [
				[80, 80],
				[80, 40],
				[40, 40],
				[0, 40],
			],
			[270]: [
				[40, 0],
				[40, 40],
				[40, 80],
				[0, 80],
			]
		},
		gridSize: 3,
	},
	L: {
		coordinates: {
			[0]: [
				[80, 0],
				[80, 40],
				[40, 40],
				[0, 40],
			],
			[90]: [
				[40, 0],
				[40, 40],
				[40, 80],
				[80, 80],
			],
			[180]: [
				[0, 80],
				[0, 40],
				[40, 40],
				[80, 40],
			],
			[270]: [
				[0, 0],
				[40, 0],
				[40, 40],
				[40, 80],
			]
		},
		gridSize: 3,
	},
	O: {
		coordinates: {
			[0]: [
				[0, 0],
				[0, 40],
				[40, 40],
				[40, 0],
			],
			[90]: [
				[0, 0],
				[0, 40],
				[40, 40],
				[40, 0],
			],
			[180]: [
				[0, 0],
				[0, 40],
				[40, 40],
				[40, 0],
			],
			[270]: [
				[0, 0],
				[0, 40],
				[40, 40],
				[40, 0],
			],
		},
		gridSize: 3,
	},
	S: {
		coordinates: {
			[0]: [
				[0, 40],
				[40, 40],
				[40, 0],
				[80, 0],
			],
			[90]: [
				[40, 0],
				[40, 40],
				[80, 40],
				[80, 80],
			],
			[180]: [
				[0, 80],
				[40, 80],
				[40, 40],
				[80, 40],
			],
			[270]: [
				[0, 0],
				[0, 40],
				[40, 40],
				[40, 80],
			]
		},
		gridSize: 3,
	},
	T: {
		coordinates: {
			[0]: [
				[0, 40],
				[40, 40],
				[80, 40],
				[40, 0],
			],
			[90]: [
				[40, 0],
				[40, 40],
				[40, 80],
				[80, 40],
			],
			[180]: [
				[0, 40],
				[40, 40],
				[80, 40],
				[40, 80],
			],
			[270]: [
				[40, 0],
				[40, 40],
				[40, 80],
				[0, 40],
			]
		},
		gridSize: 3,
	},
	Z: {
		coordinates: {
			[0]: [
				[0, 0],
				[40, 0],
				[40, 40],
				[80, 40],
			],
			[90]: [
				[80, 0],
				[80, 40],
				[40, 40],
				[40, 80],
			],
			[180]: [
				[0, 40],
				[40, 40],
				[40, 80],
				[80, 80],
			],
			[270]: [
				[40, 0],
				[40, 40],
				[0, 40],
				[0, 80],
			],
		},
		gridSize: 3,
	}
}

//* Game Constants
const GameTickSpeed = 1000; // In Milliseconds
const NumSpritesheetColours = 7;
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

	/**
	 * @readonly
	 * @type {number}
	 */
	x;

	/**
	 * @readonly
	 * @type {number}
	 */
	y;
}

class Cell extends Phaser.GameObjects.Image {
	/**
	 * @param {Phaser.Scene} scene The scene to display on
	 * @param {Vector2} position The position of the cell
	 * @param {string | Phaser.Textures.Texture} texture The texture id
	 * @param {string | number | undefined} frame The frame of the texture
	 */
	constructor(scene, position, texture, frame) {
		super(scene, position.x, position.y, texture, frame);

		scene.add.existing(this);
	}
}

class StaticPieces extends Phaser.GameObjects.Group {
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene) {
		super(scene);

		scene.add.existing(this);
	}

	/**
	 * @param {number} row
	 */
	clearRow(row) {
		const piecesToRemove = this.getChildren().filter(
			/**
			 * @param {Cell} p
			 */
			//@ts-ignore
			(p) => p.y === row
		);

		piecesToRemove.forEach((p) => p.destroy());
	}
}

class Piece extends Phaser.GameObjects.Group {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {string} shapeType
	 * @param {number} xOffset
	 * @param {number} colour
	 */
	constructor(scene, shapeType, xOffset, colour) {
		super(scene, undefined, { name: "CurrentPiece" });

		scene.add.existing(this);

		this._currentRotation = 0;
		this._shapeType = shapeType;
		
		const shapesToAdd = Shapes[shapeType].coordinates[this._currentRotation].map((coordinate) => {
			const position = new Vector2(coordinate[0] + xOffset, coordinate[1]);

			const tetromino = new Cell(scene, position, "tetrominos", colour);
			tetromino.setOrigin(0, 0);

			return tetromino;
		});

		this.addMultiple(shapesToAdd);
	}

	get currentRotation() {
		return this._currentRotation;
	}

	set currentRotation(newRot) {
		this._currentRotation = newRot;
	}

	/**
	 * @private
	 * @type {number}
	 */
	_currentRotation;

	/**
	 * @private
	 * @readonly
	 * @type {string}
	 */
	_shapeType;
}

class ScoreText extends Phaser.GameObjects.Text {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {Vector2} position
	 * @param {Phaser.Types.GameObjects.Text.TextStyle} style
	 */
	constructor(scene, position, style, initialScore = 0) {
		super(scene, position.x, position.y, `Score: ${initialScore}`, style);

		scene.add.existing(this);
		this._currentscore = initialScore;
	}

	get currentScore() {
		return this._currentscore;
	}

	set currentScore(newScore) {
		this._currentscore = newScore;
		this.setText(`Score: ${newScore}`);
	}

	/**
	 * @private
	 * @type {number}
	 */
	_currentscore;
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

	/**
	 * @param {Vector2} position
	 * @param {boolean} newValue
	 */
	setCell(position, newValue) {
		this._pieceMatrix[position.x][position.y] = newValue;
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

		this._keydownEvent = this.input.keyboard.on("keydown", this.keyDown, this);
		this._scoreText = new ScoreText(this, new Vector2(10, 10), { fontSize: "24px" });
		this._staticPieces = new StaticPieces(this);

		this.spawnTetromino();

		this.updateTickSpeed(GameTickSpeed);
	}

	//* Lifecycle Events
	/**
	 * @param {Tetris} game
	 */
	physicsStep(game) { //! Do not remove the game parameter, it breaks the entire thing and I have no clue why
		if (this._isGameOver) {
			return;
		}

		let stopPiece = false;

		this._currentPiece.getChildren().forEach(
			/**
			 * @param {Cell} child
			 */
			// @ts-ignore
			(child) => {
			if (stopPiece) {
				return;
			}

			const nextPos = new Vector2(child.x, child.y + 40);

			if (nextPos.y > GameConfig.height - 40) {
				stopPiece = true;
				return;
			}

			if (this._pieceMatrix.getCell(nextPos)) {
				stopPiece = true;
				return;
			}
		});

		if (stopPiece) {
			this._currentPiece.getChildren().forEach(
				/**
				 * @param {Cell} piece
				 */
				// @ts-ignore
				(piece) => {
				const pos = new Vector2(piece.x, piece.y);
				this._pieceMatrix.setCell(pos, true);

				this._staticPieces.add(piece);
				this._currentPiece.remove(piece);
			});

			this.spawnTetromino();
		} else {
			this._currentPiece.incY(40);
		}

		BoardGrid.Rows.forEach((row) => {
			let destroyRow = true;

			BoardGrid.Columns.forEach((column) => {
				const pos = new Vector2(column, row);

				if (!this._pieceMatrix.getCell(pos)) {
					destroyRow = false;
				}
			});

			if (destroyRow) {
				BoardGrid.Columns.forEach((column) => {
					const pos = new Vector2(column, row);
					this._pieceMatrix.setCell(pos, false);
				});

				const piecesToDestroy = this._staticPieces.getChildren().filter(
					/**
					 * @param {Cell} p
					 */
					// @ts-ignore
					(p) => p.y === row
				);
				piecesToDestroy.forEach((p) => p.destroy());

				this._staticPieces.incY(40);

				this._scoreText.currentScore += 100;
			}
		});

		BoardGrid.Columns.forEach((column) => {
			const pos = new Vector2(column, 0);

			if (this._pieceMatrix.getCell(pos)) {
				this._isGameOver = true;

				const gameOverText = this.add.text(GameConfig.width / 2, GameConfig.height / 2, "Game Over", { fontSize: "64px" });
				const finalScoreText = this.add.text(GameConfig.width / 2, GameConfig.height / 2 + 50, `Final Score: ${this._scoreText.currentScore}`, { fontSize: "32px" });
				gameOverText.setOrigin(0.5, 0.5);
				finalScoreText.setOrigin(0.5, 0.5);

				this._scoreText.destroy();
				
				this._currentPiece.destroy(true, true);

				let timeToDestroy = 1000;
				BoardGrid.Rows.slice().reverse().forEach((row) => {
					setTimeout(() => {
						this._staticPieces.clearRow(row);
					}, timeToDestroy);
					timeToDestroy += 250;
				});
			}
		});
	}
	/**
	 * @param {Phaser.Input.Keyboard.Key} key 
	 */
	keyDown(key) { }

	spawnTetromino() {
		const shapeType = ShapeTypes[Math.floor(Math.random() * (ShapeTypes.length - 1))];
		const shapeToSpawn = Shapes[shapeType];
		const colour = Math.floor(Math.random() * NumSpritesheetColours);
		let xOffset = 0;

		for (let i = 5; i >= 0; i--) {
			const xOffsetTmp = BoardGrid.Columns[Math.floor(Math.random() * BoardGrid.Columns.length)];
			const coordinates = shapeToSpawn.coordinates[0].map((coordinates) => {
				return new Vector2(coordinates[0], coordinates[1]);
			});

			if (!this.checkMapBounds(shapeToSpawn, new Vector2(xOffsetTmp, 0))) {
				continue;
			}

			if (!this.checkPieceBounds(coordinates, new Vector2(xOffsetTmp, 0))) {
				continue;
			}

			xOffset = xOffsetTmp;
			break;
		}

		if (this._currentPiece) {
			this._currentPiece.destroy();
		}

		this._currentPiece = new Piece(this, shapeType, xOffset, colour);
	}

	/**
	 * @param {{ coordinates: { 0: number[][]; 90: number[][]; 180: number[][]; 270: number[][]; }; gridSize: number; }} piece
	 * @param {number} rotation
	 */
	rotatePiece(piece, rotation) { }

	/**
	 * @param {{ coordinates: { 0: number[][]; 90: number[][]; 180: number[][]; 270: number[][]; }; gridSize: number; }} shape
	 * @param {Vector2} offset
	 * @returns {boolean}
	 */
	checkMapBounds(shape, offset) {
		if (shape.gridSize * 40 + offset.x > 480 || shape.gridSize * 40 + offset.y > 880) {
			return false;
		}

		return true;
	}

	/**
	 * @param {Vector2[]} positions
	 * @param {Vector2} offset
	 * @returns {boolean}
	 */
	checkPieceBounds(positions, offset) {
		let isOkay = true;

		positions.forEach((position) => {
			const xPos = offset.x + position.x;
			const yPos = offset.y + position.y;

			if (this._pieceMatrix.getCell(new Vector2(xPos, yPos))) {
				isOkay = false;
			}
		});

		return isOkay;
	}


	/**
	 * @param {number} speed
	 */
	updateTickSpeed(speed) {
		clearInterval(this._physicsInterval);

		this._physicsInterval = setInterval(() => this.physicsStep(this), speed);
	}


	//* Class Variables
	_pieceMatrix = new PieceMatrix(BoardGrid.Columns, BoardGrid.Rows);

	/**
	 * @private
	 * @type {Phaser.Cameras.Scene2D.Camera}
	 */
	_camera;

	/**
	 * @private
	 * @type {Phaser.GameObjects.Rectangle[]}
	 */
	_gridLines = [];

	/**
	 * @private
	 * @type {NodeJS.Timer}
	 */
	_physicsInterval;

	/**
	 * @private
	 * @type {Phaser.Input.Keyboard.KeyboardPlugin}
	 */
	_keydownEvent;

	/**
	 * @private
	 * @type {ScoreText}
	 */
	_scoreText;

	/**
	 * @private
	 * @type {Piece}
	 */
	_currentPiece;

	/**
	 * @private
	 * @type {StaticPieces}
	 */
	_staticPieces;

	/**
	 * @private
	 * @type {boolean}
	 */
	_isGameOver = false;
}

const GameConfig = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 480,
	height: 880,
	scene: Tetris,
};
const Game = new Phaser.Game(GameConfig);

