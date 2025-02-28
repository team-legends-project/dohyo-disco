import Phaser from "phaser";

export default class ChooseCharacter extends Phaser.Scene {
  constructor() {
    super("Choose Character");
    this.playerOneCharacter = 0;
    this.playerTwoCharacter = 4;
    this.playersChars = ["Haruto", "Jaydan", "Ryota", "Aeson", "Thorgar"];
  }

  init(data) {
    this.players = data.players;
  }
  preload() {
    this.load.image("background", "/textures/backgrounds/street.jpg");
    this.load.image("p1Select", "/assets/playerSelectOne.png");
    this.load.image("start", "/textures/buttons/startBtn.png");
    this.load.image("p2Select", "/assets/playerSelectTwo.png");
  }
  create() {
    this.inputEnabled = false;
    // set players and background
    const width = this.cameras.main.width;
    const halfWidth = width / 2;

    this.add.image(halfWidth, 90, "background").setScale(0.3).setOrigin(0.5);
    this.one = this.add.sprite(halfWidth - 200, 400, "Haruto").setScale(2);
    this.two = this.add.sprite(halfWidth - 100, 400, "Jaydan").setScale(2);
    this.three = this.add.sprite(halfWidth, 400, "Ryota").setScale(2);
    this.four = this.add.sprite(halfWidth + 100, 400, "Aeson").setScale(2);
    this.five = this.add.sprite(halfWidth + 200, 400, "Thorgar").setScale(2);
    // titles
    this.add
      .text(halfWidth, 40, "Choose your fighter", {
        fontFamily: "Crang",
        fontSize: 36,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    const config = {
      fontFamily: "Crang",
      fontSize: 18,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    };
    const textY = this.players === 2 ? this.scale.height / 2 : 80;
    const textX = this.players === 2 ? 100 : this.scale.width / 2;
    this.playerOneName = this.add
      .text(textX, textY, this.playersChars[0], config)
      .setOrigin(0.5)
      .setVisible(false);

    if (this.players === 2) {
      this.playerOneName.setAngle(90);
      this.playerTwoName = this.add
        .text(640, this.scale.height / 2, this.playersChars[4], config)
        .setOrigin(0.5)
        .setVisible(false)
        .setAngle(270);
    }

    // opening animation

    this.sprites = [this.one, this.two, this.three, this.four, this.five];
    let animationsComplete = 0;
    for (let i = 0; i < this.playersChars.length; i++) {
      const key = this.playersChars[i];

      this.sprites[i].play(`${key}:rear_walk_in`);
      this.tweens.add({
        targets: this.sprites[i],
        y: 160,
        duration: 3000,
        ease: "Linear",
        onComplete: () => {
          this.sprites[i].play(`${key}:front_player_idle`);
          animationsComplete++;
          if (animationsComplete === 4) {
            this.playerOneChoice = this.add
              .sprite(halfWidth - 200, 170, "p1Select")
              .setScale(0.2);
            this.playerOneName.setVisible(true);
            if (this.players === 2) {
              this.playerTwoName.setVisible(true);
              this.playerTwoChoice = this.add
                .sprite(halfWidth + 200, 170, "p2Select")
                .setScale(0.2);
            }
            this.addControls();
          }
        },
      });
    }
  }
  addControls() {
    const p1LeftX = this.players === 2 ? 40 : 710;
    const p1BtnY = this.players === 2 ? 200 : 80;
    this.playerOneLeftButton = this.add
      .image(35, 80, "inputButtons")
      .setScale(4)
      .setInteractive()
      .setFrame(427);
    this.playerOneLeftButton.setFlipX(true);
    this.playerOneRightButton = this.add
      .image(p1LeftX, p1BtnY, "inputButtons")
      .setScale(4)
      .setInteractive()
      .setFrame(427);

    this.playerOneLeftButton.on("pointerdown", (pointer) => {
      if (pointer.isDown) {
        if (this.playerOneCharacter > 0) {
          this.playerOneChoice.x -= 100;
          this.playerOneCharacter--;
          this.playerOneName.setText(
            this.playersChars[this.playerOneCharacter]
          );
        }
      }
    });
    this.playerOneRightButton.on("pointerdown", (pointer) => {
      if (pointer.isDown) {
        if (this.playerOneCharacter < 4) {
          this.playerOneChoice.x += 100;
          this.playerOneCharacter++;
          this.playerOneName.setText(
            this.playersChars[this.playerOneCharacter]
          );
        }
      }
    });
    this.start = this.add
      .image(this.scale.width / 2, 270, "start")
      .setInteractive()
      .setScale(0.5);
    if (this.players === 2) {
      this.playerTwoUpButton = this.add
        .image(700, 200, "inputButtons")
        .setScale(4)
        .setInteractive()
        .setFrame(427);
      this.playerTwoUpButton.setFlipX(true);
      this.playerTwoDownButton = this.add
        .image(705, 80, "inputButtons")
        .setScale(4)
        .setInteractive()
        .setFrame(427);

      this.playerTwoUpButton.on("pointerdown", (pointer) => {
        if (pointer.isDown) {
          if (this.playerTwoCharacter > 0) {
            this.playerTwoChoice.x -= 100;
            this.playerTwoCharacter--;
            this.playerTwoName.setText(
              this.playersChars[this.playerTwoCharacter]
            );
          }
        }
      });
      this.playerTwoDownButton.on("pointerdown", (pointer) => {
        if (pointer.isDown) {
          if (this.playerTwoCharacter < 4) {
            this.playerTwoChoice.x += 100;
            this.playerTwoCharacter++;
            this.playerTwoName.setText(
              this.playersChars[this.playerTwoCharacter]
            );
          }
        }
      });
    }

    this.start.on("pointerdown", (pointer) => {
      if (pointer.isDown) {
        this.tweens.add({
          targets: this.start,
          scaleX: 0.3,
          scaleY: 0.3,
          duration: 300,
          yoyo: true,
        });
        this.sprites[this.playerOneCharacter].play(
          `${this.playersChars[this.playerOneCharacter]}:front_taunt`
        );
        this.sprites[this.playerTwoCharacter].play(
          `${this.playersChars[this.playerTwoCharacter]}:front_taunt`
        );
        const config = {
          players: this.players,
          leftPlayer: this.playersChars[this.playerOneCharacter],
          rightPlayer: this.playersChars[this.playerTwoCharacter],
        };
        this.playerOneCharacter = 0;
        this.playerTwoCharacter = 4;
        this.time.delayedCall(3000, () => {
          const scene = this.players === 2 ? "Stage Two" : "Stage One";
          this.scene.start(scene, config);
        });
      }
    });
  }
}
