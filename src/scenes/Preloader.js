import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.spritesheet("playerOne", "/textures/playerOne.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("playerTwo", "/textures/playerTwo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }
  create() {
    this.scene.start("welcome");
  }
}
