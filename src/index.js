//@ts-check

import Phaser from "phaser";

const shapeTypes = ["I", "J", "L", "O", "S", "T", "Z"];
const shapes = new Map([
	["I", {
		coords: [
			[0, 0],
			[40, 0],
			[80, 0],
			[120, 0]
		],
		maxWidth: 160,
		maxHeight: 40,
	}],
	["J", {
		coords: [
			[0, 0],
			[0, 40],
			[40, 40],
			[80, 40],
		],
		maxWidth: 120,
		maxHeight: 120,
	}],
	["L", {
		coords: [
			[0, 40],
			[40, 40],
			[80, 40],
			[80, 0],
		],
		maxWidth: 120,
		maxHeight: 80,
	}],
	["O", {
		coords: [
			[0, 0],
			[40, 0],
			[0, 40],
			[40, 40],
		],
		maxWidth: 80,
		maxHeight: 80,
	}],
	["S", {
		coords: [
			[0, 40],
			[40, 40],
			[40, 0],
			[80, 0],
		],
		maxWidth: 120,
		maxHeight: 80,
	}],
	["T", {
		coords: [
			[0, 40],
			[40, 40],
			[80, 40],
			[40, 0],
		],
		maxWidth: 120,
		maxHeight: 80,
	}],
	["Z", {
		coords: [
			[0, 0],
			[40, 0],
			[40, 40],
			[80, 40],
		],
		maxWidth: 120,
		maxHeight: 80,
	}]
]);
const columns = [
	0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440
];
const rows = [
	0, 40, 80, 1280, 160, 200, 240, 280, 320, 360, 400, 440, 480,
	520, 560, 600, 640, 680, 720, 760, 800, 840
];

class Tetris extends Phaser.Scene {
	tetrominoPhysicsGroup;
	lastPhysicsTick = Date.now();

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
		this.tetrominoPhysicsGroup = this.physics.add.group();
		this.physics.collide(this.tetrominoPhysicsGroup);
		this.spawnTetromino();
	}

	update() {
		this.physics.pause();

		this.tetrominoPhysicsGroup.getChildren().forEach((child) => child.setVelocity(0, 0));

		this.physics.resume();
	}

	checkMapBounds(shape, offset) {
		const [x, y] = offset;

		if (shape.maxWidth + x > 480) {
			return false;
		}

		if (shape.maxHeight + y > 880) {
			return false;
		}

		return true;
	}

	spawnTetromino() {
		const wantedType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

		shapes.forEach((shape, key) => {
			if (key !== wantedType) {
				return;
			}

			const colour = Math.floor(Math.random() * 7);
			let xOffset;

			for (let i = 5; i >= 0; i--) {
				const xOffsetTmp = columns[Math.floor(Math.random() * columns.length)];

				if (!this.checkMapBounds(shape, [xOffsetTmp, 0])) {
					console.error("Piece is outside of map bounds");
					console.debug(`Piece type: ${key}`);
					continue;
				}

				xOffset = xOffsetTmp;
				break;
			}

			shape.coords.forEach((coords) => {
				const tetromino = this.tetrominoPhysicsGroup.create(coords[0] + xOffset, coords[1] + 0, "blocks", colour);
				tetromino.setOrigin(0, 0);
				tetromino.setCollideWorldBounds(true);
			});

			this.canSpawn = false;
		});
	}

}

const config = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 480,
	height: 880,
	physics: {
        default: "arcade",
        arcade: {
			fps: 1,
            gravity: { y: 40 },
            debug: true,
        }
    },
	
	scene: Tetris,
};

const game = new Phaser.Game(config);
