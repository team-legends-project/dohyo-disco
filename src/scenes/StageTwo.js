export default class StageTwo extends Phaser.Scene {
  constructor() {
    super("Stage Two");
    this.playerOneMashButtons = ["Q", "W", "E"];
    this.playerTwoMashButtons = ["U", "I", "O"];
    this.playerOneCorrectButton = 0;
    this.playerTwoCorrectButton = 0;
    this.playerOneMove = false;
  }
  preload() {
    this.load.image("streetFight", "/textures/backgrounds/street.jpg");
    this.load.image("ring", "/assets/ring.png");
  }
  create() {
    this.add.image(-50, 0, "streetFight").setOrigin(0, 0).setScale(0.55);
    this.playerOneMash = this.add
      .sprite(170, 250, "inputButtons")
      .setScale(2)
      .play(`${this.playerOneMashButtons[this.playerOneCorrectButton]}`)
      .setVisible(true);
    this.playerTwoMash = this.add
      .sprite(680, 250, "inputButtons")
      .setScale(2)
      .play(`${this.playerTwoMashButtons[this.playerTwoCorrectButton]}`)
      .setVisible(true);
    const textConfig = {
      fontFamily: "Crang",
      fontSize: 20,
      color: "#ffffff",
    };
    this.playerOneMashText = this.add
      .text(50, 232, "press", textConfig)
      .setVisible(true);
    this.playerTwoMashText = this.add
      .text(550, 232, "press", textConfig)
      .setVisible(true);

    // creates a timer for five seconds to randomise an index
    this.time.addEvent({
      delay: 5000,
      callback: this.changeMashButton,
      callbackScope: this,
      loop: true,
    });

    this.playerOne = this.physics.add
      .sprite(100, 470, "playerOne")
      .setScale(2.5)
      .setSize(20, 60)
      .setDepth(1)
      .play("playerOne:left_face_idle");
    this.physics.world.gravity.y = 0;
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      Q: Phaser.Input.Keyboard.KeyCodes.Q,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      U: Phaser.Input.Keyboard.KeyCodes.U,
      I: Phaser.Input.Keyboard.KeyCodes.I,
      O: Phaser.Input.Keyboard.KeyCodes.O,
    });
  }
  changeMashButton() {
    this.playerOneCorrectButton = Phaser.Math.Between(0, 2);
    this.playerTwoCorrectButton = Phaser.Math.Between(0, 2);
    this.playerOneMash.play(
      `${this.playerOneMashButtons[this.playerOneCorrectButton]}`
    );
    this.playerTwoMash.play(
      `${this.playerTwoMashButtons[this.playerTwoCorrectButton]}`
    );
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.keys[this.playerOneMashButtons[this.playerOneCorrectButton]]
      )
    ) {
      console.log(
        `Valid Key Pressed: ${
          this.playerOneMashButtons[this.playerOneCorrectButton]
        }`
      );
      this.playerOne.x += 10;
      this.playerOne.play("playerOne:left_run");
    }
  }
}
