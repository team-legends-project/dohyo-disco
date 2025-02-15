import Phaser from "phaser";
import "../../styles/styles.css";

export default class Welcome extends Phaser.Scene {
  constructor() {
    super("Welcome");
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

    // create and place sprites
    this.leftAnimatedCharacter = this.add.sprite(-50, 400, "playerTwo");
    this.rightAnimatedCharacter = this.add.sprite(800, 400, "playerOne");
    this.leftAnimatedCharacter.setScale(2);
    this.rightAnimatedCharacter.setScale(2);

    // opening animations
    this.rightAnimatedCharacter.play("playerOne:right_walk_in");
    this.leftAnimatedCharacter.play("playerTwo:left_walk_in");

    this.tweens.add({
      targets: this.leftAnimatedCharacter,
      x: 300,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        if (
          this.leftAnimatedCharacter.anims.currentAnim.key !==
          "playerTwo:left_walk_in"
        ) {
          this.leftAnimatedCharacter.play("playerTwo:left_walk_in", true);
        }
      },
      onComplete: () => {
        this.leftAnimatedCharacter.play("playerTwo:front_player_idle");
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
          this.rightAnimatedCharacter.anims.currentAnim.key !==
          "playerOne:right_walk_in"
        ) {
          this.rightAnimatedCharacter.play("playerOne:right_walk_in", true);
        }
      },
      onComplete: () => {
        this.rightAnimatedCharacter.play("playerOne:front_player_idle");
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
      this.leftAnimatedCharacter.play("playerTwo:front_taunt");
      this.rightAnimatedCharacter.play("playerOne:front_taunt");
    });
    button.on("pointerup", () => {
      this.time.delayedCall(1500, () => {
        this.scene.start("stage one");
      });
    });
  }
}
