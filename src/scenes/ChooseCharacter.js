import Phaser from "phaser";

export default class ChooseCharacter extends Phaser.Scene {
  constructor() {
    super("Choose Character");
    this.playerOneCharacter = 0;
    this.playerTwoCharacter = 4;
    this.playersChars = ["playerOne", "playerTwo", "oldMan", "minotaur", "orc"];
  }

  init(data) {
    this.input.setDefaultCursor("none");
    this.players = data.players;
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  preload() {
    this.load.image("background", "/textures/backgrounds/street.jpg");
    this.load.image("start", "/textures/buttons/startBtn.png");
    this.load.image("p1Select", "/assets/playerSelectOne.png");
    this.load.image("p2Select", "/assets/playerSelectTwo.png");
  }
  create() {
    this.inputEnabled = false;

    // set players and background
    this.add.sprite(0, 0, "background").setScale(0.5).setOrigin(0, 0);
    this.one = this.add.sprite(100, 900, "playerOne").setScale(2);
    this.two = this.add.sprite(250, 900, "playerTwo").setScale(2);
    this.three = this.add.sprite(550, 900, "oldMan").setScale(2);
    this.four = this.add.sprite(400, 900, "minotaur").setScale(2);
    this.five = this.add.sprite(700, 900, "orc").setScale(2);

    // opening animation
    this.one.play("playerOne:rear_walk_in");
    this.sprites = [this.one, this.two, this.three, this.four, this.five];
    let animationsComplete = 0;
    for (let i = 0; i < this.playersChars.length; i++) {
      const key = this.playersChars[i];

      this.sprites[i].play(`${key}:rear_walk_in`);
      this.tweens.add({
        targets: this.sprites[i],
        y: 450,
        duration: 3000,
        ease: "Linear",
        onComplete: () => {
          this.sprites[i].play(`${key}:front_player_idle`);
          animationsComplete++;
          if (animationsComplete === 4) {
            this.add.text(200, 550, "press enter to start the match", {
              fontFamily: "Crang",
              fontSize: 18,
              color: "#ffffff",
            });
            this.playerOneChoice = this.add
              .sprite(100, 455, "p1Select")
              .setScale(0.2);
            if (this.players === 2) {
              this.playerTwoChoice = this.add
                .sprite(700, 455, "p2Select")
                .setScale(0.2);
            }
          }
        },
      });
    }

    // titles
    this.add.text(120, 80, "Choose your fighter", {
      fontFamily: "Crang",
      fontSize: 45,
      color: "#ffffff",
    });
    this.add.text(20, 200, "Player One", {
      fontFamily: "Crang",
      fontSize: 18,
      color: "#ffffff",
    });

    if (this.players === 2) {
      this.add.text(500, 200, "Player Two", {
        fontFamily: "Crang",
        fontSize: 18,
        color: "#ffffff",
      });
    }
    // creates inputs
    this.keyObjects = this.input.keyboard.addKeys({
      p1Left: Phaser.Input.Keyboard.KeyCodes.A,
      p1Right: Phaser.Input.Keyboard.KeyCodes.D,
      p1Select: Phaser.Input.Keyboard.KeyCodes.S,
      p2Left: Phaser.Input.Keyboard.KeyCodes.J,
      p2Right: Phaser.Input.Keyboard.KeyCodes.L,
      p2Select: Phaser.Input.Keyboard.KeyCodes.K,
      start: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });
  }
  update() {
    this.inputEnabled = true;
    if (
      Phaser.Input.Keyboard.JustDown(this.keyObjects.p1Right) &&
      this.playerOneCharacter < 4
    ) {
      this.playerOneChoice.x += 150;
      this.playerOneCharacter++;
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keyObjects.p1Left) &&
      this.playerOneCharacter > 0
    ) {
      this.playerOneChoice.x -= 150;
      this.playerOneCharacter--;
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keyObjects.p2Right) &&
      this.playerTwoCharacter < 4
    ) {
      this.playerTwoChoice.x += 150;
      this.playerTwoCharacter++;
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keyObjects.p2Left) &&
      this.playerTwoCharacter > 0
    ) {
      this.playerTwoChoice.x -= 150;
      this.playerTwoCharacter--;
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyObjects.start)) {
      const leftPlayer = this.playersChars[this.playerOneCharacter];
      const rightPlayer = this.playersChars[this.playerTwoCharacter];
      const config = { players: this.players, leftPlayer, rightPlayer };
      console.log(config);
      this.sprites[this.playerOneCharacter].play(
        `${this.playersChars[this.playerOneCharacter]}:front_taunt`
      );
      this.sprites[this.playerTwoCharacter].play(
        `${this.playersChars[this.playerTwoCharacter]}:front_taunt`
      );
      this.time.delayedCall(3000, () => {
        this.scene.start("Stage One", config);
      });
    }
  }
}
