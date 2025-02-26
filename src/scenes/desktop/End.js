import Phaser from "phaser";

export default class EndGame extends Phaser.Scene {
  constructor() {
    super("End Game");
    this.cursorIndex = 0;
  }
  preload() {
    this.load.image("courtyard", "/textures/backgrounds/openingImage.jpg");
    this.load.image("onePlayerSelect", "/textures/buttons/1player.png");
    this.load.image("twoPlayerSelect", "/textures/buttons/2player.png");
    this.load.image("cursor", "/assets/cursor.png");
  }
  create() {
    this.add.image(0, 80, "courtyard").setScale(0.5).setOrigin(0, 0);
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.add
      .text(screenCenterX, 150, "Thank you for playing!\nWant to play again?", {
        fontFamily: "Crang",
        fontSize: 36,
        color: "#ffffff",
        align: "center",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.cursor = this.add.sprite(530, 345, "cursor").setScale(2);
    // creates inputs
    this.keyObjects = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      select: Phaser.Input.Keyboard.KeyCodes.ENTER,
      close: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
    this.tweens.add({
      targets: this.cursor,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
    this.onePlayerButton = this.add
      .image(screenCenterX, 340, "onePlayerSelect")
      .setInteractive()
      .setScale(0.75)
      .setOrigin(0.5);
    this.twoPlayerButton = this.add
      .image(screenCenterX, 440, "twoPlayerSelect")
      .setInteractive()
      .setScale(0.75)
      .setOrigin(0.5);
    this.add
      .text(
        screenCenterX,
        550,
        "created with love and some swearing by:\n verity gregory   katherine hurst   niamh smith",
        {
          fontFamily: "Crang",
          fontSize: 18,
          color: "#ffffff",
          align: "center",
          stroke: "#000000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5);
  }
  handleInputs() {
    if (
      this.cursorIndex < 1 &&
      Phaser.Input.Keyboard.JustDown(this.keyObjects.down)
    ) {
      this.cursor.y += 100;
      this.cursorIndex++;
    }
    if (
      this.cursorIndex > 0 &&
      Phaser.Input.Keyboard.JustDown(this.keyObjects.up)
    ) {
      this.cursor.y -= 100;
      this.cursorIndex--;
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyObjects.select)) {
      if (this.cursorIndex === 0) {
        this.tweens.add({
          targets: this.onePlayerButton,
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 300,
          yoyo: true,
        });
      } else {
        this.tweens.add({
          targets: this.twoPlayerButton,
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 300,
          yoyo: true,
        });
      }
      this.time.delayedCall(1500, () => {
        this.scene.start("Choose Character", {
          players: this.cursorIndex + 1,
        });
      });
    }
  }
  update() {
    this.handleInputs();
  }
}
