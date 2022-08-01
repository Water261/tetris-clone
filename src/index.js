//@ts-check

import Phaser from "phaser";

class MyGame extends Phaser.Scene {
  preload() {
    this.load.image("logo", "src/assets/logo.png");
  }

  create() {
    const logo = this.add.image(250, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 600,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
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
