import Phaser from "phaser";

export default class EndGame extends Phaser.Scene {
  e;
  constructor() {
    super("End Game");
    this.cursorIndex = 0;
  }
  preload() {
    this.load.image("courtyard", "/textures/backgrounds/courtyard.jpg");
    this.load.image("onePlayerSelect", "/textures/buttons/1player.png");
    this.load.image("twoPlayerSelect", "/textures/buttons/2player.png");
    this.load.image("cursor", "/assets/cursor.png");
  }
  create() {
    this.add.image(0, -200, "courtyard").setScale(0.5).setOrigin(0, 0);
    const screenCenterX = this.scale.width / 2;
    const screenCenterY = this.scale.height / 2;
    this.add
      .text(screenCenterX, 80, "Thank you for playing!\nWant to play again?", {
        fontFamily: "Crang",
        fontSize: 24,
        color: "#ffffff",
        align: "center",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.onePlayerButton = this.add
      .image(screenCenterX - 100, 180, "onePlayerSelect")
      .setInteractive()
      .setScale(0.6)
      .setOrigin(0.5);
    this.twoPlayerButton = this.add
      .image(screenCenterX + 100, 180, "twoPlayerSelect")
      .setInteractive()
      .setScale(0.6)
      .setOrigin(0.5);
    this.add
      .text(
        screenCenterX,
        260,
        "created with love and some swearing by:\n verity gregory   katherine hurst   niamh smith",
        {
          fontFamily: "Crang",
          fontSize: 16,
          color: "#ffffff",
          align: "center",
          stroke: "#000000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5);
    this.onePlayerButton.on("pointerdown", (pointer) => {
      if (pointer.isDown) {
        this.tweens.add({
          targets: this.onePlayerButton,
          scaleX: 0.45,
          scaleY: 0.45,
          duration: 300,
          yoyo: true,
        });

        this.time.delayedCall(1500, () => {
          this.scene.start("Choose Character", {
            players: 1,
          });
        });
      }
    });
    this.twoPlayerButton.on("pointerdown", (pointer) => {
      if (pointer.isDown) {
        this.tweens.add({
          targets: this.twoPlayerButton,
          scaleX: 0.45,
          scaleY: 0.45,
          duration: 300,
          yoyo: true,
        });

        this.time.delayedCall(1500, () => {
          this.scene.start("Choose Character", {
            players: 2,
          });
        });
      }
    });
  }
}
