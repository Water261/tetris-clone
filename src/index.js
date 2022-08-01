//@ts-check

import Phaser from "phaser";

class MyGame extends Phaser.Scene {
	preload() {
		this.load.image("logo", "src/assets/logo.png");
	}

	create() {
		this.graphics = {
			red: this.addNewGraphics(0xff0000),
			orange: this.addNewGraphics(0xffa500),
			yellow: this.addNewGraphics(0xffff00),
			purple: this.addNewGraphics(0x800080),
			blue: this.addNewGraphics(0x0000ff),
			cyan: this.addNewGraphics(0x00ffff),
			green: this.addNewGraphics(0x00ff00),
		};
		this.colours = [
			"red",
			"orange",
			"yellow",
			"purple",
			"blue",
			"cyan",
			"green",
		];

		const rectangleA = new Phaser.Geom.Rectangle(0, 0, 150, 150);
		const randNum = Math.floor(Math.random() * this.colours.length);
		const randColour = this.colours[randNum];

		this.graphics[randColour].fillRectShape(rectangleA);
	}

	/**
	 * Adds a new graphics object and returns it
	 * @param {number} colour 
	 */
	addNewGraphics(colour) {
		return this.add.graphics({
			fillStyle: {
				color: colour,
			},
		});
	}
}

const config = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 500,
	height: 800,
	scene: MyGame,
};

const game = new Phaser.Game(config);
