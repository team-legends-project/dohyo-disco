import Phaser from "phaser";

export default class Stage extends Phaser.Scene {
  constructor() {
    super("stage one");
  }
  init(data) {
    // in selection scene set {fighter:selectedFighter} in this.scene.start
    // selected fighter is found here
  }
  preload() {
    this.load.image("stageOneBG", "/textures/backgrounds/woodland.png");
  }
  create() {
    this.add.sprite(-80, 30, "stageOneBG").setOrigin(0, 0).setScale(0.5);
  }
}
