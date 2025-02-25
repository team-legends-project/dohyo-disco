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
    this.gameWon = false;
    this.player1 = {
      key: null,
      currentKeyIndex: 0,
      keyPressesPerDelay: 0,
      velocity: 0,
      direction: 1,
      mashButtons: ["Q", "W", "E"],
      spriteKey: null,
      sprite: null,
      isMoving: false,
      wins: 0,
    };
    this.player2 = {
      key: null,
      currentKeyIndex: 0,
      keyPressesPerDelay: 0,
      velocity: 0,
      direction: -1,
      mashButtons: ["U", "I", "O"],
      spriteKey: null,
      sprite: null,
      isMoving: false,
      wins: 0,
    };
  }
  init(data) {
    // config sent from character selection of players
    this.players = data.players;
    this.input.setDefaultCursor("none");
    this.player1.spriteKey = data.leftPlayer;
    this.player2.spriteKey = data.rightPlayer;

    // resets game state
    this.matchEnd = false;
    this.matchStart = false;
    this.haveCollided = false;
  }
  preload() {
    // background image of stage
    this.load.image("stageOneBG", "/textures/backgrounds/forest.jpg");
    this.load.image("ring", "/textures/backgrounds/ring.png");
  }

  create() {
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
    this.add.sprite(-80, -120, "stageOneBG").setOrigin(0, 0).setScale(0.6);
    this.add.sprite(400, 480, "ring").setScale(0.5);
    this.add.rectangle(0, 0, 1600, 300, 0x00000);
    const textConfig = {
      fontFamily: "Crang",
      fontSize: 36,
      color: "#ffffff",
    };

    this.add.text(20, 15, `${this.player1.spriteKey}`, textConfig);
    this.add
      .text(780, 15, `${this.player2.spriteKey}`, textConfig)
      .setOrigin(1, 0);
    this.playerOneRoundOne = this.add
      .sprite(60, 100, "inputButtons")
      .setScale(2);
    this.player1.wins === 1
      ? this.playerOneRoundOne.setFrame(0)
      : this.playerOneRoundOne.setFrame(12);
    this.playerOneRoundTwo = this.add
      .sprite(100, 100, "inputButtons")
      .setFrame(12)
      .setScale(2);
    this.playerTwoRoundOne = this.add
      .sprite(740, 100, "inputButtons")
      .setScale(2);
    this.player2.wins === 1
      ? this.playerTwoRoundOne.setFrame(0)
      : this.playerTwoRoundOne.setFrame(12);
    this.playerTwoRoundTwo = this.add
      .sprite(700, 100, "inputButtons")
      .setFrame(12)
      .setScale(2);
    this.player1.sprite = this.physics.add
      .sprite(-50, 410, this.player1.spriteKey)
      .setScale(2.5)
      .setSize(20, 60)
      .setDepth(1);

    this.player2.sprite = this.physics.add
      .sprite(850, 410, this.player2.spriteKey)
      .setScale(2.5)
      .setSize(20, 60)
      .setDepth(1);

    this.referee = this.add
      .sprite(400, 360, "referee")
      .setScale(2.5)
      .setDepth(0)
      .play("idle");

    // creates a timer for five seconds to randomise an index of keypress
    this.time.addEvent({
      delay: 5000,
      callback: this.changeMashButton,
      callbackScope: this,
      loop: true,
    });

    // walk on
    this.tweens.add({
      targets: this.player1.sprite,
      x: 300,
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
      x: 500,
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
          .sprite(this.player1.sprite.x, 300, "inputButtons")
          .setScale(3)
          .play(`${this.player1.mashButtons[this.player1.currentKeyIndex]}`);

        if (this.players === 2) {
          this.playerTwoMash = this.add
            .sprite(this.player2.sprite.x, 300, "inputButtons")
            .setScale(3)
            .play(`${this.player2.mashButtons[this.player2.currentKeyIndex]}`);
        }
      }
    };

    // collision detection
    this.physics.add.collider(
      this.player1.sprite,
      this.player2.sprite,
      this.handlePlayerCollide
    );
    this.physics.world.gravity.y = 0;
    // check the player input
    timer = this.time.addEvent({
      delay: this.velocityCheckDelayInSeconds * 1000, //convert to milliseconds
      callback: this.checkAndApplyAllVelocities,
      callbackScope: this,
      loop: true,
      paused: false,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(200, 400), // AI presses every 200-400ms
      callback: this.aiPress,
      callbackScope: this,
      loop: true,
    });
  }
  aiPress() {
    if (this.matchStart) {
      this.player2.keyPressesPerDelay += 2;
    }
  }
  changeMashButton() {
    if (this.matchStart) {
      this.player1.currentKeyIndex = Phaser.Math.Between(0, 2);
      this.player2.currentKeyIndex = Phaser.Math.Between(0, 2);
      this.playerOneMash.play(
        `${this.player1.mashButtons[this.player1.currentKeyIndex]}`
      );
      if (this.players === 2) {
        this.playerTwoMash.play(
          `${this.player2.mashButtons[this.player2.currentKeyIndex]}`
        );
      }
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

  // hope to change sprites here, may not be needed
  handlePlayerCollide() {}

  // move players and button sprites
  updatePlayers() {
    this.updatePlayer(this.player1);
    if (this.players === 2) {
      this.updatePlayer(this.player2);
      this.playerTwoMash.x = this.player2.sprite.x;
    }
    this.playerOneMash.x = this.player1.sprite.x;
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
      this.player2.wins++;
      this.declareWinner(this.player2, this.player1, "right");
      if (this.player2.wins === 1) {
        this.playerTwoRoundOne.setFrame(0);
      } else {
        this.playerTwoRoundTwo.setFrame(0);
      }
    }
    if (this.player2.sprite.x >= 725) {
      this.player1.wins++;
      this.declareWinner(this.player1, this.player2, "left");
      if (this.player1.wins === 1) {
        this.playerOneRoundOne.setFrame(0);
      } else {
        this.playerOneRoundTwo.setFrame(0);
      }
    }
  }

  declareWinner(winner, loser, side) {
    this.matchEnd = true;
    this.playerOneMash.setVisible(false);
    if (this.players === 2) {
      this.playerTwoMash.setVisible(false);
    }
    winner.wins === 2 ? (this.gameWon = true) : (this.gameWon = false);
    const winText = this.gameWon
      ? `${winner.spriteKey} wins the game!`
      : `${winner.spriteKey} wins the round!`;
    this.add
      .text(this.cameras.main.width / 2, 200, `${winText}`, {
        fontFamily: "Crang",
        fontSize: 36,
        color: "#ffffff",
      })
      .setOrigin(0.5);
    // Disable player input
    this.inputEnabled = false;
    // Stop update loop
    this.matchStart = false;

    // Stop all movements
    winner.sprite.setVelocity(0, 0);
    loser.sprite.setVelocity(0, 0);

    // Stop any running animations before playing new ones
    winner.sprite.anims.stop();
    loser.sprite.anims.stop();

    // Play winner animation and delay scene pause
    this.referee.play(`${side}_win`);
    side === "left" ? (winner.sprite.x -= 40) : (winner.sprite.x += 40);
    winner.sprite.play(`${winner.spriteKey}:front_taunt`);
    loser.sprite.play(`${loser.spriteKey}:fall_down`);

    // Wait until animations complete before pausing the update loop
    winner.sprite.once("animationcomplete", () => {
      this.time.delayedCall(2000, () => {
        this.scene.pause();
        if (this.gameWon) {
          this.player1.wins = 0;
          this.player2.wins = 0;
          this.scene.start("Choose Character");
        } else {
          this.scene.start("Stage One");
        }
      });
    });
  }
}
