import Phaser from "phaser";

export default class ChooseCharacter extends Phaser.Scene {
  constructor() {
    super("Choose Character");
  }

  preload() {
    this.load.image("background", "/textures/backgrounds/street.jpg");
  }
  create() {
    this.add.sprite(0, 0, "background").setScale(0.5).setOrigin(0, 0);
    this.testCharacter = this.add.sprite(400, 400, "orc").setScale(2);
    this.testCharacter.play("orc:right_taunt");
  }
}
