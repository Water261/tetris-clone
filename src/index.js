//@ts-check
// TODO: Implement piece dropping
// TODO: Fix piece collision
// TODO: Add scoring
// TODO: Add end game
// TODO: Implement piece checker for rotation
//? Change rotation point for 'I' block?

import Phaser from "phaser";

const shapeTypes = ["I", "J", "L", "O", "S", "T", "Z"];
// const shapeTypes = ["I"];
const shapes = {
	I: {
		coordinates: {
			// Rotations
			[0]: [
				[0, 0],
				[40, 0],
				[80, 0],
				[120, 0],
			],
			[90]: [
				[0, 0],
				[0, 40],
				[0, 80],
				[0, 120],
			],
			[180]: [
				[0, 0],
				[-40, 0],
				[-80, 0],
				[-120, 0],
			],
			[270]: [
				[0, 0],
				[0, -40],
				[0, -80],
				[0, -120],
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
const columns = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440];
const rows = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 840];

//* The game's tick speed in milliseconds
const gameTickSpeed = 1000;

const availableColours = 7;
class Tetris extends Phaser.Scene {
	/**
	 * @type {Phaser.GameObjects.Image[]}
	 */
	currentPiece = [];
	/**
	 * @type {Phaser.GameObjects.Image[][] | undefined[][]}
	 */
	staticPieces = [];
	/**
	 * @type {Phaser.GameObjects.Image[]}
	 */
	allPieces = [];
	/**
	 * @type {boolean[][]}
	 */
	pieceMatrix = [];
	/**
	 * @type {string}
	 */
	currentPieceType;
	/**
	 * @type {number}
	 */
	currentRotation;
	/**
	 * @type {boolean}
	 */
	isPaused = false;
	/**
	 * @type {boolean}
	 */
	isGameOver = false;
	/**
	 * @type {Phaser.GameObjects.Text}
	 */
	pausedText;
	/**
	 * @type {NodeJS.Timer}
	 */
	physTick;
	/**
	 * @type {number}
	 */
	currentScore = 0;
	/**
	 * @type {Phaser.GameObjects.Text}
	 */
	scoreText;

	preload() {
		this.load.spritesheet(
			"blocks",
			"src/assets/BlockSpriteSheet.png",
			{
				frameWidth: 40,
				frameHeight: 40,
			}
		);
	}

	create() {
		const cam = this.cameras.add(0, 0, 480, 880);
		cam.setBackgroundColor(0x000000);

		rows.forEach((row) => {
			this.pieceMatrix[row] = [];
			this.staticPieces[row] = [];

			const rowLine = this.add.rectangle(0, row, 480, 1, 0x333333);
			rowLine.setOrigin(0, 0);

			columns.forEach((column) => {
				this.pieceMatrix[row][column] = false;
				this.staticPieces[row][column] = undefined;

				const columnLine = this.add.rectangle(column, 0, 1, 880, 0x333333);
				columnLine.setOrigin(0, 0);
			});
		});

		this.spawnTetromino();

		this.scoreText = this.add.text(10, 10, `Score: ${this.currentScore}`, { fontSize: "24px" });
		this.physTick = setInterval(() => this.physicsTick(), gameTickSpeed);

		this.input.keyboard.on("keydown", this.handleKeyDown, this);
	}

	/**
	 * @param {number} keyCode
	 */
	rotatePiece(keyCode) {
		let canRotate = true;
		let newRotation = this.currentRotation;

		if (keyCode === Phaser.Input.Keyboard.KeyCodes.UP) {
			if (newRotation >= 270) {
				newRotation = 0;
			} else {
				newRotation += 90;
			}
		} else if (keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) {
			if (newRotation <= 0) {
				newRotation = 270
			} else {
				newRotation -= 90;
			}
		}

		const oldCoords = shapes[this.currentPieceType].coordinates[this.currentRotation];
		const newCoords = shapes[this.currentPieceType].coordinates[newRotation];
		let firstPieceCoords;

		this.currentPiece.forEach((piece, index) => {
			if (index === 0) {
				firstPieceCoords = [piece.x - oldCoords[index][0], piece.y - oldCoords[index][1]];
				return;
			}

			const newXPos = firstPieceCoords[0] + newCoords[index][0];
			const newYPos = firstPieceCoords[1] + newCoords[index][1];

			if (newXPos < 0 || newXPos > gameConfig.width - 40) {
				canRotate = false;
			}

			if (newYPos < 0 || newYPos > gameConfig.height - 40) {
				canRotate = false;
			}
		});

		if (canRotate) {
			this.currentRotation = newRotation;

			this.currentPiece.forEach((piece, index) => {
				const newXPos = firstPieceCoords[0] + newCoords[index][0];
				const newYPos = firstPieceCoords[1] + newCoords[index][1];

				piece.setX(newXPos);
				piece.setY(newYPos);
			});
		}
	}

	/**
	 * @param {{ keyCode: any; }} event
	 */
	handleKeyDown(event) {
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;

		if (event.keyCode === keyCodes.ESC) {
			this.isPaused = !this.isPaused;

			if (this.isPaused) {
				this.pausedText = this.add.text(gameConfig.width / 2, gameConfig.height / 2, "Paused", { fontSize: "64px" });
				this.pausedText.setOrigin(0.5, 0.5);
				clearInterval(this.physTick)
			} else {
				this.pausedText.destroy();

				this.physTick = setInterval(() => this.physicsTick(), gameTickSpeed);
			}
		}

		if (this.isPaused || this.isGameOver) {
			return;
		}

		switch (event.keyCode) {
			case keyCodes.UP:
			case keyCodes.DOWN:
				this.rotatePiece(event.keyCode);
				break;

			case keyCodes.LEFT:
				let canMoveLeft = true;
				this.currentPiece.forEach((piece) => {
					if (piece.x <= 0) {
						canMoveLeft = false;
					}

					if (this.pieceMatrix[piece.y][piece.x - 40] === true) {
						canMoveLeft = false;
					}
				});

				if (canMoveLeft) {
					this.currentPiece.forEach((piece) => piece.x -= 40);
				}

				break;

			case keyCodes.RIGHT:
				let canMoveRight = true;
				this.currentPiece.forEach((piece) => {
					if (piece.x >= gameConfig.width - 40) {
						canMoveRight = false;
					}

					if (this.pieceMatrix[piece.y][piece.x + 40] === true) {
						canMoveLeft = false;
					}
				});

				if (canMoveRight) {
					this.currentPiece.forEach((piece) => piece.x += 40);
				}

				break;

			case keyCodes.SPACE:
				const dropDistances = [];
				let maxPieceYPos = 0;

				this.currentPiece.forEach((piece) => {
					if (piece.y > maxPieceYPos) {
						maxPieceYPos = piece.y;
					}
				});

				this.currentPiece.forEach((piece) => {
					let highestDropDistance = 0;
					let maxDropDistanceReached = false;

					this.pieceMatrix.forEach((row, rowPos) => {
						if (rowPos > piece.y && rowPos < gameConfig.height) {
							if (maxDropDistanceReached) {
								return;
							}

							if (row[piece.x] === true) {
								maxDropDistanceReached = true;
								return;
							}

							if (rowPos > highestDropDistance) {
								highestDropDistance = rowPos - maxPieceYPos;
							}
						}
					});

					dropDistances.push(highestDropDistance);
				});

				dropDistances.sort();

				this.currentPiece.forEach((piece, index) => {
					piece.y += dropDistances[0];

					this.pieceMatrix[piece.y][piece.x] = true;
					this.staticPieces[piece.y][piece.x] = piece;
					delete this.currentPiece[index];
				});
				this.spawnTetromino();
				break;
		}
	}

	physicsTick() {
		if (this.isPaused || this.isGameOver) {
			return;
		}

		let stopPiece = false;

		this.currentPiece.forEach((piece) => {
			if (stopPiece) {
				return;
			}

			const xPos = piece.x;
			const yPos = piece.y;

			if (yPos + 40 > gameConfig.height - 40) {
				stopPiece = true;
				return;
			}

			const nextPosOccupied = this.pieceMatrix[yPos + 40][xPos];

			if (nextPosOccupied) {
				stopPiece = true;
				return;
			}
		});

		if (stopPiece) {
			this.currentPiece.forEach((piece, index) => {
				this.pieceMatrix[piece.y][piece.x] = true;
				this.staticPieces[piece.y][piece.x] = piece;
				delete this.currentPiece[index];
			});

			this.spawnTetromino();
		} else {
			this.currentPiece.forEach((piece) => piece.y += 40);
		}

		this.pieceMatrix.forEach((row, rowPos) => {
			let destroyRow = true;
			row.forEach((column) => {
				if (column === false) {
					destroyRow = false;
				}
			});

			if (destroyRow) {
				columns.forEach((column) => {
					this.pieceMatrix[rowPos][column] = false;
				});

				this.staticPieces[rowPos].forEach((piece, columnPos) => {
					delete this.allPieces[this.allPieces.indexOf(piece)];
					piece.destroy();
					this.staticPieces[rowPos][columnPos] = undefined;
				});
				this.staticPieces.forEach((row, rowPos) => {
					row.forEach((piece, columnPos) => {
						if (piece !== undefined) {
							this.pieceMatrix[rowPos][columnPos] = false;
							this.pieceMatrix[rowPos + 40][columnPos] = true;
							piece.y += 40;
						}
					});
				});

				this.currentScore += 100;
				this.scoreText.setText(`Score: ${this.currentScore}`);
				this.scoreText.updateText();
			}
		});

		this.pieceMatrix[0].forEach((piece) => {
			if (piece === true) {
				this.isGameOver = true;

				// Add game over text
				const gameOverText = this.add.text(gameConfig.width / 2, gameConfig.height / 2, "Game Over", { fontSize: "64px" });
				const finalScoreText = this.add.text(gameConfig.width / 2, gameConfig.height / 2 + 50, `Final Score: ${this.currentScore}`, { fontSize: "32px" });
				gameOverText.setOrigin(0.5, 0.5);
				finalScoreText.setOrigin(0.5, 0.5);

				this.scoreText.destroy();

				// Destroy the current piece
				this.currentPiece.forEach((piece) => piece.destroy());

				let timeToDestroy = 1000;
				// let totalTimeToDestroy = timeToDestroy + 250 * this.staticPieces.length + 50;
				// Cinematically destroy each row
				this.staticPieces.slice().reverse().forEach((row, index) => {
					setTimeout(() => {
						row.forEach((piece) => {
							if (piece !== undefined) {
								piece.destroy();
								delete this.allPieces[this.allPieces.indexOf(piece)];
							}
						});
					}, timeToDestroy);
					timeToDestroy += 250;

					if (index === this.staticPieces.length - 1) {
						setTimeout(() => this.allPieces.forEach((piece) => piece.destroy()), timeToDestroy);
					}
				});
			}
		});
	}

	/**
	 * @param {{ coordinates: { 0: number[][]; 90: number[][]; 180: number[][]; 270: number[][]; }; gridSize: number; }} shape
	 * @param {number[]} offset
	 */
	checkMapBounds(shape, offset) {
		const [x, y] = offset;

		if (shape.gridSize * 40 + x > 480 || shape.gridSize * 40 + y > 880) {
			return false;
		}

		return true;
	}

	/**
	 * @param {number[][]} newCoords
	 * @param {number[]} offset
	 */
	checkPieceBounds(newCoords, offset) {
		let isOkay = true;

		newCoords.forEach((coordinate) => {
			const xPos = offset[0] + coordinate[0];
			const yPos = offset[1] + coordinate[1];

			if (this.pieceMatrix[yPos][xPos] === true) {
				isOkay = false;
			}
		});

		return isOkay;
	}

	spawnTetromino() {
		const shapeKey = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
		const shape = shapes[shapeKey];
		const colour = Math.floor(Math.random() * availableColours);
		let xOffset;

		for (let i = 5; i >= 0; i--) {
			const xOffsetTmp = columns[Math.floor(Math.random() * columns.length)];

			if (!this.checkMapBounds(shape, [xOffsetTmp, 0]) || !this.checkPieceBounds(shape.coordinates[0], [xOffsetTmp, 0])) {
				continue;
			}

			xOffset = xOffsetTmp;
			break;
		}

		this.currentPiece = shape.coordinates[0].map((coords) => {
			const xPos = coords[0] + xOffset;
			const yPos = coords[1];

			const tetromino = this.add.image(xPos, yPos, "blocks", colour);
			tetromino.setOrigin(0, 0);

			this.allPieces.push(tetromino);

			return tetromino;
		});
		this.currentPieceType = shapeKey;
		this.currentRotation = 0;
	}
}

const gameConfig = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 480,
	height: 880,
	scene: Tetris,
};

const game = new Phaser.Game(gameConfig);
