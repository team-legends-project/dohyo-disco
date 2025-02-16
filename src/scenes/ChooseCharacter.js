import Phaser from "phaser";

export default class ChooseCharacter extends Phaser.Scene {
  constructor() {
    super("Choose Character");
  }

  init(data) {
    // this.players = data.players;
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  preload() {
    this.load.image("background", "/textures/backgrounds/street.jpg");
    this.load.image("start", "/textures/buttons/startBtn.png");
  }
  create() {
    this.players = 2;
    // set players and background
    this.add.sprite(0, 0, "background").setScale(0.5).setOrigin(0, 0);
    this.one = this.add.sprite(100, 900, "playerOne").setScale(2);
    this.two = this.add.sprite(250, 900, "playerTwo").setScale(2);
    this.three = this.add.sprite(550, 900, "oldMan").setScale(2);
    this.four = this.add.sprite(400, 900, "minotaur").setScale(2);
    this.five = this.add.sprite(700, 900, "orc").setScale(2);

    // opening animation
    this.one.play("playerOne:rear_walk_in");
    const players = [
      [this.one, "playerOne"],
      [this.two, "playerTwo"],
      [this.three, "oldMan"],
      [this.four, "minotaur"],
      [this.five, "orc"],
    ];

    for (let i = 0; i < players.length; i++) {
      const [sprite, key] = players[i];
      sprite.play(`${key}:rear_walk_in`);
      this.tweens.add({
        targets: sprite,
        y: 450,
        duration: 3000,
        ease: "Linear",
        onComplete: () => {
          sprite.play(`${key}:front_player_idle`);
        },
      });
    }

    // titles
    this.add.text(220, 100, "Choose your fighter", {
      fontSize: 45,
      color: "#ffffff",
    });
    this.add.text(20, 200, "Player One:");

    this.players === 2 ? this.add.text(500, 200, "Player Two:") : null;
  }
}
