import Phaser from "phaser";

let timer;

export default class StageOne extends Phaser.Scene {
  constructor() {
    super("Stage One");
    this.matchStart = false;
    this.matchEnd = false;
    this.combinedVelocity = 0;
    this.velocityCheckDelayInSeconds = 1;
    this.haveCollided = false;
  }
  init(data) {
    console.log(data);
    // config sent from character selection of players
    this.players = data.players;
    this.input.setDefaultCursor("none");

    this.player1 = {
      key: null,
      currentKeyIndex: 0,
      keyPressesPerDelay: 0,
      velocity: 0,
      direction: 1,
      mashButtons: ["Q", "W", "E"],
      spriteKey: data.leftPlayer,
      sprite: null,
      isMoving: false,
    };
    this.player2 = {
      key: null,
      currentKeyIndex: 0,
      keyPressesPerDelay: 0,
      velocity: 0,
      direction: -1,
      mashButtons: ["U", "I", "O"],
      spriteKey: data.rightPlayer,
      sprite: null,
      isMoving: false,
    };
  }
  preload() {
    // background image of stage
    this.load.image("stageOneBG", "/textures/backgrounds/woodland.png");
  }

  create() {
    this.matchEnd = false;
    this.matchStart = false;
    this.haveCollided = false;
    //* for debugging collision detection, shows boundary boxes
    // this.physics.world.createDebugGraphic();

    // disable controls until animations end
    this.inputEnabled = false;
    // adds inputs
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      Q: Phaser.Input.Keyboard.KeyCodes.Q,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      U: Phaser.Input.Keyboard.KeyCodes.U,
      I: Phaser.Input.Keyboard.KeyCodes.I,
      O: Phaser.Input.Keyboard.KeyCodes.O,
    });

    // adds assets
    this.add.sprite(-80, 30, "stageOneBG").setOrigin(0, 0).setScale(0.5);
    this.player1.sprite = this.physics.add
      .sprite(-50, 470, this.player1.spriteKey)
      .setScale(2.5)
      .setSize(20, 60)
      .setDepth(1);

    this.player2.sprite = this.physics.add
      .sprite(850, 470, this.player2.spriteKey)
      .setScale(2.5)
      .setSize(20, 60)
      .setDepth(1);

    this.referee = this.add
      .sprite(420, 430, "referee")
      .setScale(2.5)
      .setDepth(0)
      .play("idle");

    // creates a timer for five seconds to randomise an index
    this.time.addEvent({
      delay: 5000,
      callback: this.changeMashButton,
      callbackScope: this,
      loop: true,
    });

    // walk on

    this.tweens.add({
      targets: this.player1.sprite,
      x: 200,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        this.player1.sprite.play(
          `${this.player1.spriteKey}:left_walk_in_slow`,
          true
        );
      },
      onComplete: () => {
        this.player1.sprite
          .play(`${this.player1.spriteKey}:left_salutation`)
          .chain(`${this.player1.spriteKey}:left_face_idle`)
          .on("animationcomplete", checkAnimationsComplete);
      },
    });
    this.tweens.add({
      targets: this.player2.sprite,
      x: 650,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        this.player2.sprite.play(
          `${this.player2.spriteKey}:right_walk_in_slow`,
          true
        );
      },
      onComplete: () => {
        this.player2.sprite
          .play(`${this.player2.spriteKey}:right_salutation`)
          .chain(`${this.player2.spriteKey}:right_face_idle`)
          .on("animationcomplete", checkAnimationsComplete);
      },
    });
    let animationsComplete = 0;
    const checkAnimationsComplete = () => {
      animationsComplete++;

      if (animationsComplete === 2) {
        this.matchStart = true;
        this.inputEnabled = true;

        this.playerOneMash = this.add
          .sprite(170, 250, "inputButtons")
          .setScale(2)
          .play(`${this.player1.mashButtons[this.player1.currentKeyIndex]}`);

        this.playerTwoMash = this.add
          .sprite(680, 250, "inputButtons")
          .setScale(2)
          .play(`${this.player2.mashButtons[this.player2.currentKeyIndex]}`);

        const textConfig = {
          fontFamily: "Crang",
          fontSize: 20,
          color: "#ffffff",
        };

        this.playerOneMashText = this.add.text(50, 232, "press", textConfig);

        this.playerTwoMashText = this.add.text(550, 232, "press", textConfig);
      }
    };

    // collision detection
    this.physics.add.collider(
      this.player1.sprite,
      this.player2.sprite,
      this.handlePlayerCollide
    );
    this.physics.world.gravity.y = 0;

    timer = this.time.addEvent({
      delay: this.velocityCheckDelayInSeconds * 1000, //convert to milliseconds
      callback: this.checkAndApplyAllVelocities,
      callbackScope: this,
      loop: true,
      paused: false,
    });
  }

  changeMashButton() {
    if (this.matchStart) {
      this.player1.currentKeyIndex = Phaser.Math.Between(0, 2);
      this.player2.currentKeyIndex = Phaser.Math.Between(0, 2);
      this.playerOneMash.play(
        `${this.player1.mashButtons[this.player1.currentKeyIndex]}`
      );
      this.playerTwoMash.play(
        `${this.player2.mashButtons[this.player2.currentKeyIndex]}`
      );
    }
  }

  checkPlayerVelocity(player) {
    const facing = player.direction === -1 ? "right" : "left";
    player.velocity =
      (player.keyPressesPerDelay * player.direction) /
      this.velocityCheckDelayInSeconds;
    player.keyPressesPerDelay = 0;
    if (!player.isMoving && Math.abs(player.velocity) > 0) {
      player.sprite.play(`${player.spriteKey}:${facing}_run`);
      player.isMoving = true;
    } else if (player.isMoving && Math.abs(player.velocity) === 0) {
      player.sprite.play(`${player.spriteKey}:${facing}_face_idle`);
      player.isMoving = false;
    }
  }
  checkAndApplyAllVelocities() {
    if (!this.matchEnd) {
      this.checkPlayerVelocity(this.player1);
      this.checkPlayerVelocity(this.player2);
      // this.checkCombinedVelocity();

      if (this.haveCollided) {
        console.log("HULLO");
      } else {
        this.player1.sprite.setVelocity(this.player1.velocity * 50, 0);
        this.player2.sprite.setVelocity(this.player2.velocity * 50, 0);
      }
    }
  }

  // checkCombinedVelocity() {
  //   this.combinedVelocity = this.player2.velocity + this.player1.velocity;
  // }

  // hope to change sprites here, may not be needed
  handlePlayerCollide() {}

  updatePlayers() {
    this.updatePlayer(this.player1);
    this.updatePlayer(this.player2);
  }

  updatePlayer(player) {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.keys[player.mashButtons[player.currentKeyIndex]]
      )
    ) {
      player.keyPressesPerDelay++;
    }
  }

  update() {
    // if the match hasn't started or has ended, stop the update loop
    if (!this.matchStart || this.matchEnd) {
      return;
    }
    // controls movement of players
    this.updatePlayers();

    // win state detection
    if (this.player1.sprite.x <= 85) {
      this.declareWinner(this.player2.sprite, this.player1.sprite, "right");
    }
    if (this.player2.sprite.x >= 725) {
      this.declareWinner(this.player1.sprite, this.player2.sprite, "left");
    }
  }

  declareWinner(winner, loser, side) {
    this.matchEnd = true;

    // Disable player input
    this.inputEnabled = false;
    this.matchStart = false; // Stop update loop

    // Stop all movements
    winner.setVelocity(0, 0);
    loser.setVelocity(0, 0);

    // Stop any running animations before playing new ones
    winner.anims.stop();
    loser.anims.stop();

    // Play winner animation and delay scene pause
    this.referee.play(`${side}_win`);
    side === "left" ? (winner.x -= 40) : (winner.x += 40);
    winner.play(`${winner.texture.key}:front_taunt`);
    loser.play(`${loser.texture.key}:fall_down`);

    // Wait until animations complete before pausing the update loop
    winner.once("animationcomplete", () => {
      this.time.delayedCall(2000, () => {
        this.scene.pause();
        // config to track how many rounds won
        const config = {
          players: this.players,
          leftPlayer: this.player1.spriteKey,
          rightPlayer: this.player2.spriteKey,
          win: "player one",
        };
        // current issue, second fight doesn't allow keyboard inputs
        this.scene.start("Stage One", config);
      });
    });
  }
}
