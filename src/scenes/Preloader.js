import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.spritesheet("playerOne", "/textures/sprites/playerOne.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("playerTwo", "/textures/sprites/playerTwo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("femalePlayer", "/textures/sprites/woman.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("orc", "/textures/sprites/orc.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }
  create() {
    this.scene.start("welcome");
  }
}
