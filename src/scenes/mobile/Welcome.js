import Phaser from "phaser";

export default class Welcome extends Phaser.Scene {
  constructor() {
    super("Welcome");
  }

  preload() {
    this.load.image("openingImage", "/textures/backgrounds/openingImage.jpg");
    this.load.image("onePlayerSelect", "/textures/buttons/1player.png");
    this.load.image("twoPlayerSelect", "/textures/buttons/2player.png");
    this.load.image("controls", "/textures/buttons/start.png");
    this.load.image("cursor", "/assets/cursor.png");
  }

  create() {
    // adds background image and placement
    const backGround = this.add.image(-50, -80, "openingImage");
    backGround.setScale(0.5);
    backGround.setOrigin(0, 0);

    // creates title
    this.add.text(430, 15, "Dohyo Disco", {
      fontFamily: "Crang",
      fontSize: 40,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    });

    // create and place sprites
    this.leftAnimatedCharacter = this.add.sprite(-50, 210, "Haruto");
    this.rightAnimatedCharacter = this.add.sprite(810, 210, "Jaydan");
    this.leftAnimatedCharacter.setScale(2);
    this.rightAnimatedCharacter.setScale(2);

    // opening animations
    this.rightAnimatedCharacter.play("Haruto:right_walk_in_slow");
    this.leftAnimatedCharacter.play("Jaydan:left_walk_in_slow");
    const width = this.cameras.main.width;
    this.tweens.add({
      targets: this.leftAnimatedCharacter,
      x: width / 2 - 140,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        if (
          this.leftAnimatedCharacter.anims.currentAnim.key !==
          "Jaydan:left_walk_in_slow"
        ) {
          this.leftAnimatedCharacter.play("Jaydan:left_walk_in_slow", true);
        }
      },
      onComplete: () => {
        this.leftAnimatedCharacter.play("Jaydan:front_player_idle");
        this.leftCharacterStopped = true;
        this.checkBothStopped();
      },
    });
    this.tweens.add({
      targets: this.rightAnimatedCharacter,
      x: width / 2 + 140,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        if (
          this.rightAnimatedCharacter.anims.currentAnim.key !==
          "Haruto:right_walk_in_slow"
        ) {
          this.rightAnimatedCharacter.play("Haruto:right_walk_in_slow", true);
        }
      },
      onComplete: () => {
        this.rightAnimatedCharacter.play("Haruto:front_player_idle");
        this.rightCharacterStopped = true;
        this.checkBothStopped();
      },
    });
  }

  // buttons and selectors toggle on after animation ends.
  checkBothStopped() {
    if (this.leftCharacterStopped && this.rightCharacterStopped) {
      this.showStartButton();
    }
  }
  showStartButton() {
    const width = this.scale.width;
    // adds buttons
    this.onePlayerButton = this.add
      .image(width / 2, 140, "onePlayerSelect")
      .setInteractive()
      .setScale(0.6)
      .setOrigin(0.5);
    this.twoPlayerButton = this.add
      .image(width / 2, 240, "twoPlayerSelect")
      .setInteractive()
      .setScale(0.6)
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
        this.playTaunt();
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
        this.playTaunt();
        this.time.delayedCall(1500, () => {
          this.scene.start("Choose Character", {
            players: 2,
          });
        });
      }
    });
  }
  playTaunt() {
    this.leftAnimatedCharacter.play("Jaydan:front_taunt");
    this.rightAnimatedCharacter.play("Haruto:front_taunt");
  }
}
