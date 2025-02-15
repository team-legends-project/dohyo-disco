import Phaser from "phaser";
let spaceKey;
let spacePressed = false;
let spacePressedPerDelay = 0;
let timer;
let playerVelocity;
let velocityCheckDelayInSeconds = 1;
let text;

export default class Fight extends Phaser.Scene {
  constructor() {
    super("fight");
  }
 
  preload() {
    this.load.image("background", "/textures/backgrounds/street.jpg");
  }
  create() {
    // startTime = this.time.startTime
    playerVelocity = 0;
    timer = this.time.addEvent({
      delay: velocityCheckDelayInSeconds * 1000, //convert to milliseconds
      callback: this.checkSpeed,
      callbackScope: this,
      loop: true,
      paused: false,
    });
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.add.sprite(0, 0, "background").setScale(0.6).setOrigin(0, 0);

    text = this.add
      .text(20, 30, "", { font: "bold 72px system-ui" })
      .setShadow(2, 2, "#000080", 8);
  }

  update() {
    text.setText(playerVelocity + "\n presses per second");
    if (spaceKey.isDown && !spacePressed) {
      spacePressed = true;
      spacePressedPerDelay++;
    }
    if (spaceKey.isUp) {
      spacePressed = false;
    }
  }

  checkSpeed() {
    playerVelocity = spacePressedPerDelay / velocityCheckDelayInSeconds;
    spacePressedPerDelay = 0;
  }
}
