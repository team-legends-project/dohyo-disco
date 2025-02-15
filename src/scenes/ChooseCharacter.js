import Phaser from "phaser";

export default class ChooseCharacter extends Phaser.Scene {
  constructor() {
    super("Choose Character");
  }

  preload() {
    this.load.image("background", "/textures/backgrounds/street.jpg");
  }
  create() {
    this.add.sprite(0, 0, "background").setScale(0.6).setOrigin(0, 0);
  }
}
