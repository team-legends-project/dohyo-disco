import Phaser from "phaser";
import "../../styles/styles.css";

export default class Welcome extends Phaser.Scene {
  constructor() {
    super("welcome");
  }

  preload() {
    this.load.image("openingImage", "/textures/backgrounds/openingImage.jpg");
    this.load.image("buttonNormal", "/textures/buttons/startBtn.png");
  }

  create() {
    // adds background image and placement
    const backGround = this.add.sprite(0, 80, "openingImage");
    backGround.setScale(0.5);
    backGround.setOrigin(0, 0);

    // creates title
    this.add.text(1000 * 0.5, 100, "Dohyo Disco", {
      fontFamily: "Arial",
      fontSize: 40,
      color: "#ffffff",
    });

    // opening animations
    this.anims.create({
      key: "left walk on",
      frames: this.anims.generateFrameNumbers("playerTwo", {
        start: 143,
        end: 151,
      }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: "right walk on",
      frames: this.anims.generateFrameNumbers("playerOne", {
        start: 117,
        end: 125,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "left idle",
      frames: this.anims.generateFrameNumbers("playerTwo", {
        start: 364,
        end: 365,
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "right idle",
      frames: this.anims.generateFrameNumbers("playerOne", {
        start: 364,
        end: 365,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "right front taunt",
      frames: this.anims.generateFrameNumbers("playerOne", {
        start: 27,
        end: 33,
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "left front taunt",
      frames: this.anims.generateFrameNumbers("playerTwo", {
        start: 27,
        end: 33,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.leftAnimatedCharacter = this.add.sprite(-50, 400, "playerTwo");
    this.rightAnimatedCharacter = this.add.sprite(800, 400, "playerOne");
    this.leftAnimatedCharacter.setScale(2);
    this.rightAnimatedCharacter.setScale(2);

    this.rightAnimatedCharacter.play("right walk on");
    this.leftAnimatedCharacter.play("left walk on");

    this.tweens.add({
      targets: this.leftAnimatedCharacter,
      x: 300,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        if (
          this.leftAnimatedCharacter.anims.currentAnim.key !== "left walk on"
        ) {
          this.leftAnimatedCharacter.play("left walk on", true);
        }
      },
      onComplete: () => {
        this.leftAnimatedCharacter.play("left idle");
        this.leftCharacterStopped = true;
        this.checkBothStopped();
      },
    });
    this.tweens.add({
      targets: this.rightAnimatedCharacter,
      x: 550,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        if (
          this.rightAnimatedCharacter.anims.currentAnim.key !== "right walk on"
        ) {
          this.rightAnimatedCharacter.play("right walk on", true);
        }
      },
      onComplete: () => {
        this.rightAnimatedCharacter.play("right idle");
        this.rightCharacterStopped = true;
        this.checkBothStopped();
      },
    });
  }
  checkBothStopped() {
    if (this.leftCharacterStopped && this.rightCharacterStopped) {
      this.showStartButton();
    }
  }
  showStartButton() {
    const button = this.add
      .image(420, 550, "buttonNormal")
      .setInteractive()
      .setOrigin(0.5)
      .setScale(0.75);

    button.on("pointerdown", () => {
      this.leftAnimatedCharacter.play("left front taunt");
      this.rightAnimatedCharacter.play("right front taunt");
    });
    button.on("pointerup", () => {
      this.time.delayedCall(1500, () => {
        this.scene.start("Choose Character");
      });
    });
  }
}
