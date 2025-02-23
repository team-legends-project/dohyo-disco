import Phaser from "phaser";
let timer;

let player1 = {
  key: null,
  keyValue: Phaser.Input.Keyboard.KeyCodes.SPACE,
  keyPressed: false,
  keyPressesPerDelay: 0,
  velocity: 0,
  direction: 1,
};
let player2 = {
  key: null,
  keyValue: Phaser.Input.Keyboard.KeyCodes.ENTER,
  keyPressed: false,
  keyPressesPerDelay: 0,
  velocity: 0,
  direction: -1,
};

let combinedVelocity = 0;
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
    player1.velocity = 0;
    player2.velocity = 0;
    timer = this.time.addEvent({
      delay: velocityCheckDelayInSeconds * 1000, //convert to milliseconds
      callback: this.checkAllVelocities,
      callbackScope: this,
      loop: true,
      paused: false,
    });
    player1.key = this.input.keyboard.addKey(player1.keyValue);
    player2.key = this.input.keyboard.addKey(player2.keyValue);

    this.add.sprite(0, 0, "background").setScale(0.6).setOrigin(0, 0);
    text = this.add
      .text(20, 30, "", { font: "bold 40px system-ui" })
      .setShadow(2, 2, "#000080", 8);
  }

  update() {
    text.setText(`
      ${player1.velocity}
      player1 - presses per second
      ${player2.velocity}
      player2 - presses per second
      ${combinedVelocity}
      combined velocity
      `);
    this.detectKeyPress(player1);
    this.detectKeyPress(player2);
  }

  detectKeyPress(player) {
    if (player.key.isDown && !player.keyPressed) {
      player.keyPressed = true;
      player.keyPressesPerDelay++;
    }
    if (player.key.isUp) {
      player.keyPressed = false;
    }
  }

  checkAllVelocities() {
    this.checkPlayerVelocity(player1);
    this.checkPlayerVelocity(player2);
    this.checkCombinedVelocity();
  }

  checkPlayerVelocity(player) {
    player.velocity =
      (player.keyPressesPerDelay * player.direction) /
      velocityCheckDelayInSeconds;
    player.keyPressesPerDelay = 0;
  }

  checkCombinedVelocity() {
    combinedVelocity = player2.velocity + player1.velocity;
  }
}
