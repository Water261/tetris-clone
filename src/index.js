//@ts-check

import Phaser from "phaser";

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
	preload() {
		this.load.spritesheet("blocks", "src/assets/BlockSpriteSheet.png", { frameWidth: 40, frameHeight: 40 });
	}
	create() {
		const camera = this.cameras.add(0, 0, 480, 880);
		camera.setBackgroundColor(0x777777);

		shapes.forEach((shape, key) => {
			const colour = Math.floor(Math.random() * 7);
			const xOffset = columns[Math.floor(Math.random() * columns.length)];
			const yOffset = rows[Math.floor(Math.random() * rows.length)];

			if (!this.checkMapBounds(shape, [xOffset, yOffset])) {
				console.error("Piece is outside of map bounds");
				console.debug(`Piece type: ${key}`);
				return;
			}

			shape.coords.forEach((coords) => {
				const tetromino = this.add.image(coords[0] + xOffset, coords[1] + yOffset, "blocks", colour);
				tetromino.setOrigin(0, 0);
			});
		});
	}
	update() { }

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
}

const config = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 480,
	height: 880,
	scene: Tetris,
};

const game = new Phaser.Game(config);
