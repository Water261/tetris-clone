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
	Rows: [
		0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560,
		600, 640, 680, 720, 760, 800, 840,
	],
};
const Shapes = {
	I: {
		coordinates: {
			// Rotations
			[0]: [
				[0, 80],
				[40, 80],
				[80, 80],
				[120, 80],
			],
			[90]: [
				[40, 0],
				[40, 40],
				[40, 80],
				[40, 120],
			],
			[180]: [
				[0, 40],
				[40, 40],
				[80, 40],
				[120, 40],
			],
			[270]: [
				[80, 0],
				[80, 40],
				[80, 80],
				[80, 120],
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
			],
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
			],
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
			],
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
			],
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
	},
};

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
	destroyRow(row) {
		const piecesToRemove = this.getChildren().filter(
			/**
			 * @param {Cell} p
			 */
			//@ts-ignore
			(p) => p.y === row,
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

		const shapesToAdd = Shapes[shapeType].coordinates[
			this._currentRotation
		].map((coordinate) => {
			const position = new Vector2(
				coordinate[0] + xOffset,
				coordinate[1],
			);

			const tetromino = new Cell(scene, position, "tetrominos", colour);
			tetromino.setOrigin(0, 0);

			return tetromino;
		});

		this.addMultiple(shapesToAdd);

		if (shapeType === ShapeType.I) {
			this.incY(-80);
		}
	}

	/**
	 * @param {number} newRot
	 * @param {PieceMatrix} pieceMatrix
	 */
	rotatePiece(newRot, pieceMatrix) {
		const shapeCoordinates = Shapes[this._shapeType].coordinates;
		const currentCoords = shapeCoordinates[this._currentRotation];
		const newCoords = shapeCoordinates[newRot];
		const firstPieceCoords = new Vector2(
			//@ts-ignore
			this.getChildren()[0].x - currentCoords[0][0],
			//@ts-ignore
			this.getChildren()[0].y - currentCoords[0][1],
		);
		let canRotate = true;

		this.getChildren().forEach(
			/**
			 * @param {Cell} piece
			 * @param {number} index
			 */
			//@ts-ignore
			(piece, index) => {
				const newPos = new Vector2(
					firstPieceCoords.x + newCoords[index][0],
					firstPieceCoords.y + newCoords[index][1],
				);

				if (newPos.x < 0 || newPos.x > GameConfig.width - 40) {
					canRotate = false;
				}

				if (newPos.y < 0 || newPos.y > GameConfig.height - 40) {
					canRotate = false;
				}

				if (pieceMatrix.getCell(newPos)) {
					canRotate = false;
				}
			},
		);

		if (canRotate) {
			this.getChildren().forEach(
				/**
				 * @param {Cell} piece
				 * @param {number} index
				 */
				//@ts-ignore
				(piece, index) => {
					const newPos = new Vector2(
						firstPieceCoords.x + newCoords[index][0],
						firstPieceCoords.y + newCoords[index][1],
					);

					piece.setPosition(newPos.x, newPos.y);
				},
			);

			this._currentRotation = newRot;
		}
	}

	get currentRotation() {
		return this._currentRotation;
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
		const row = this._pieceMatrix[position.x];

		if (row !== undefined) {
			return row[position.y];
		} else {
			return false;
		}
	}

	/**
	 * @param {Vector2} position
	 * @param {boolean} newValue
	 */
	setCell(position, newValue) {
		this._pieceMatrix[position.x][position.y] = newValue;
	}

	/**
	 * @param {number} row
	 */
	getRow(row) {
		return BoardGrid.Columns.map((col) => {
			return this._pieceMatrix[col][row];
		});
	}

	/**
	 * @param {number} row
	 * @param {boolean} newValue
	 */
	setRow(row, newValue) {
		BoardGrid.Columns.forEach((col) => {
			this._pieceMatrix[col][row] = newValue;
		});
	}

	/**
	 * Shift the entire piece matrix down by
	 * @param {number} shiftBy
	 */
	shiftDown(shiftBy) {
		let newMatrix = [];

		BoardGrid.Columns.forEach((col) => {
			newMatrix[col] = [];

			BoardGrid.Rows.forEach((row) => (newMatrix[col][row] = false));
		});

		this._pieceMatrix.forEach((column, columnIndex) => {
			column.forEach((piece, pieceIndex) => {
				if (pieceIndex + 40 >= GameConfig.height) {
					this.setRow(pieceIndex, false);
					return;
				}

				newMatrix[columnIndex][pieceIndex + 40] = piece;
			});
		});

		this._pieceMatrix = newMatrix;
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
		this.load.spritesheet("tetrominos", "src/assets/BlockSpriteSheet.png", {
			frameWidth: 40,
			frameHeight: 40,
		});
	}

	create() {
		// Set up the game's main camera
		const cameraPosition = new Vector2(0, 0);
		const cameraSize = new Vector2(GameConfig.width, GameConfig.height);
		this._camera = this.cameras.add(
			cameraPosition.x,
			cameraPosition.y,
			cameraSize.x,
			cameraSize.y,
			true,
			"TetrisMain",
		);
		this._camera.setBackgroundColor(0x000000);

		BoardGrid.Columns.forEach((x) => {
			const rectPos = new Vector2(x, 0);
			const rectSize = new Vector2(1, GameConfig.height);
			const gridLine = this.add.rectangle(
				rectPos.x,
				rectPos.y,
				rectSize.x,
				rectSize.y,
				0x333333,
			);

			gridLine.setOrigin(0, 0);

			this._gridLines.push(gridLine);
		});

		BoardGrid.Rows.forEach((y) => {
			const rectPos = new Vector2(0, y);
			const rectSize = new Vector2(GameConfig.width, 1);
			const gridLine = this.add.rectangle(
				rectPos.x,
				rectPos.y,
				rectSize.x,
				rectSize.y,
				0x333333,
			);

			gridLine.setOrigin(0, 0);

			this._gridLines.push(gridLine);
		});

		this._keydownEvent = this.input.keyboard.on(
			"keydown",
			this.keyDown,
			this,
		);
		this._keyupEvent = this.input.keyboard.on("keyup", this.keyUp, this);
		this._scoreText = new ScoreText(this, new Vector2(10, 10), {
			fontSize: "24px",
		});
		this._staticPieces = new StaticPieces(this);

		this.spawnTetromino();

		this.updateTickSpeed(this._currentTickSpeed);
	}

	//* Lifecycle Events
	/**
	 * @param {Tetris} game
	 */
	physicsStep(game) {
		//! Do not remove the game parameter, it breaks the entire thing and I have no clue why
		if (this._isGameOver) {
			return;
		}

		let stopPiece = false;

		this._currentPiece.getChildren().forEach(
			/**
			 * @param {Cell} piece
			 */
			// @ts-ignore
			(piece) => {
				if (stopPiece) {
					return;
				}

				const nextPos = new Vector2(piece.x, piece.y + 40);

				if (!this.checkPosition(nextPos)) {
					stopPiece = true;
					return;
				}
			},
		);

		if (stopPiece) {
			this._currentPiece.getChildren().forEach((piece) =>
				this._pieceMatrix.setCell(
					// @ts-ignore
					new Vector2(piece.x, piece.y),
					true,
				),
			);

			this._staticPieces.addMultiple(this._currentPiece.getChildren());
			this._currentPiece.destroy(false, false);

			this.spawnTetromino();
		} else {
			this._currentPiece.incY(40);
		}

		BoardGrid.Rows.slice()
			.reverse()
			.forEach((row) => {
				const matrixRow = this._pieceMatrix.getRow(row);
				let shouldDestroyRow = true;

				matrixRow.forEach((isOccupied) => {
					if (!isOccupied) {
						shouldDestroyRow = false;
					}
				});

				if (shouldDestroyRow) {
					this._pieceMatrix.shiftDown(40);

					this._staticPieces.destroyRow(row);
					this._staticPieces.incY(40);

					this._scoreText.currentScore += 100;

					if (this._currentTickSpeed > GameTickSpeed / 2) {
						this._currentTickSpeed -= 0.025;
						this.updateTickSpeed(this._currentTickSpeed);
					}					
				}
			});

		BoardGrid.Columns.forEach((column) => {
			const pos = new Vector2(column, 0);

			if (this._pieceMatrix.getCell(pos)) {
				this._isGameOver = true;

				const gameOverText = this.add.text(
					GameConfig.width / 2,
					GameConfig.height / 2,
					"Game Over",
					{ fontSize: "64px" },
				);
				const finalScoreText = this.add.text(
					GameConfig.width / 2,
					GameConfig.height / 2 + 50,
					`Final Score: ${this._scoreText.currentScore}`,
					{ fontSize: "32px" },
				);
				gameOverText.setOrigin(0.5, 0.5);
				finalScoreText.setOrigin(0.5, 0.5);

				this._scoreText.destroy();

				this._currentPiece.destroy(true, true);

				let timeToDestroy = 1000;
				BoardGrid.Rows.slice()
					.reverse()
					.forEach((row) => {
						setTimeout(() => {
							this._staticPieces.destroyRow(row);
						}, timeToDestroy);
						timeToDestroy += 250;
					});
			}
		});
	}
	/**
	 * @param {Phaser.Input.Keyboard.Key} key
	 */
	keyDown(key) {
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;

		if (key.keyCode === keyCodes.ESC) {
			this._isPaused = !this._isPaused;

			if (this._isPaused) {
				this._pausedText = this.add.text(
					GameConfig.width / 2,
					GameConfig.height / 2,
					"Paused",
					{
						fontSize: "64px",
					},
				);
				this._pausedText.setOrigin(0.5, 0.5);

				clearInterval(this._physicsInterval);
			} else {
				this._pausedText.destroy();

				this.updateTickSpeed(this._currentTickSpeed);
			}
		}

		if (this._isPaused) {
			return;
		}

		switch (key.keyCode) {
			case keyCodes.UP:
			case keyCodes.Z:
				this.rotatePiece(key);
				break;

			case keyCodes.LEFT:
				let canMoveLeft = true;
				this._currentPiece.getChildren().forEach(
					/**
					 * @param {Cell} piece
					 */
					//@ts-ignore
					(piece) => {
						const nextPos = new Vector2(piece.x - 40, piece.y);

						if (!this.checkPosition(nextPos)) {
							canMoveLeft = false;
						}
					},
				);

				if (canMoveLeft) {
					this._currentPiece.incX(-40);
				}
				break;

			case keyCodes.RIGHT:
				let canMoveRight = true;
				this._currentPiece.getChildren().forEach(
					/**
					 * @param {Cell} piece
					 */
					//@ts-ignore
					(piece) => {
						const nextPos = new Vector2(piece.x + 40, piece.y);

						if (!this.checkPosition(nextPos)) {
							canMoveRight = false;
						}
					},
				);

				if (canMoveRight) {
					this._currentPiece.incX(40);
				}
				break;

			case keyCodes.DOWN:
				this._isSpedUp = true;
				this.updateTickSpeed(Math.floor(this._currentTickSpeed / 2));
				this.physicsStep(this);
		}
	}

	/**
	 * @param {Phaser.Input.Keyboard.Key} key
	 */
	keyUp(key) {
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;

		switch (key.keyCode) {
			case keyCodes.DOWN:
				this._isSpedUp = false;
				this.updateTickSpeed(GameTickSpeed);
		}
	}

	spawnTetromino() {
		const shapeType =
			ShapeTypes[Math.floor(Math.random() * (ShapeTypes.length - 1))];
		const shapeToSpawn = Shapes[shapeType];
		const colour = Math.floor(Math.random() * NumSpritesheetColours);
		let xOffset = 0;

		for (let i = 5; i >= 0; i--) {
			const xOffsetTmp =
				BoardGrid.Columns[
					Math.floor(Math.random() * BoardGrid.Columns.length)
				];

			let isOk = true;

			shapeToSpawn.coordinates[0].forEach((coords) => {
				const position = new Vector2(coords[0] + xOffsetTmp, coords[1]);
				if (!this.checkPosition(position)) {
					isOk = false;
				}
			});

			if (!isOk) {
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
	 * @param {Phaser.Input.Keyboard.Key} key
	 */
	rotatePiece(key) {
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;
		let newRotation = this._currentPiece.currentRotation;

		if (key.keyCode === keyCodes.UP) {
			if (newRotation >= 270) {
				newRotation = 0;
			} else {
				newRotation += 90;
			}
		} else if (key.keyCode === keyCodes.Z) {
			if (newRotation <= 0) {
				newRotation = 270;
			} else {
				newRotation -= 90;
			}
		}

		this._currentPiece.rotatePiece(newRotation, this._pieceMatrix);
	}

	/**
	 * @param {Vector2} position
	 * @returns {boolean}
	 */
	checkPosition(position) {
		const mapBounds = new Vector2(
			GameConfig.width - 40,
			GameConfig.height - 40,
		);

		if (position.x > mapBounds.x || position.x < 0) {
			return false;
		}

		if (position.y > mapBounds.y || position.y < 0) {
			return false;
		}

		if (this._pieceMatrix.getCell(position)) {
			return false;
		}

		return true;
	}

	/**
	 * @param {number} speed
	 */
	updateTickSpeed(speed) {
		clearInterval(this._physicsInterval);

		this._physicsInterval = setInterval(
			() => this.physicsStep(this),
			speed,
		);
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

	/**
	 * @private
	 * @type {Phaser.GameObjects.Text}
	 */
	_pausedText;

	/**
	 * @private
	 * @type {boolean}
	 */
	_isPaused = false;

	/**
	 * @private
	 * @type {boolean}
	 */
	_isSpedUp = false;

	/**
	 * @private
	 * @type {Phaser.Input.Keyboard.KeyboardPlugin}
	 */
	_keyupEvent;

	/**
	 * @private
	 * @type {number}
	 */
	_currentTickSpeed = GameTickSpeed;
}

const GameConfig = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 480,
	height: 880,
	scene: Tetris,
};
const Game = new Phaser.Game(GameConfig);
