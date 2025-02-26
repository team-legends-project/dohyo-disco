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
    this.inputStates = {
      A: false,
      B: false,
      X: false,
      Y: false,
    };
    this.player1 = {
      key: null,
      currentKeyIndex: 0,
      keyPressesPerDelay: 0,
      velocity: 0,
      direction: 1,
      mashButtons: ["A", "B", "X", "Y"],
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
    console.log(data);
    this.players = data.players;
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

    const width = this.cameras.main.width;
    // adds assets
    this.add.image(0, -210, "stageOneBG").setOrigin(0, 0).setScale(0.5);
    this.add.sprite(width / 2, 270, "ring").setScale(0.4);
    this.sideBarLeft = this.add.rectangle(0, 0, 135, 740, 0x00000).setDepth(3);
    this.sideBarRight = this.add
      .rectangle(740, 0, 135, 740, 0x00000)
      .setDepth(3);
    this.banner = this.add.rectangle(0, 0, 1600, 120, 0x00000).setDepth(4);
    const textConfig = {
      fontFamily: "Crang",
      fontSize: 24,
      color: "#ffffff",
    };

    this.add.text(20, 5, `${this.player1.spriteKey}`, textConfig).setDepth(4);
    this.add
      .text(720, 5, `${this.player2.spriteKey}`, textConfig)
      .setOrigin(1, 0)
      .setDepth(4);
    this.playerOneRoundOne = this.add
      .sprite(30, 50, "inputButtons")
      .setScale(1.2)
      .setDepth(4);
    this.player1.wins === 1
      ? this.playerOneRoundOne.setFrame(0)
      : this.playerOneRoundOne.setFrame(12);
    this.playerOneRoundTwo = this.add
      .sprite(50, 50, "inputButtons")
      .setFrame(12)
      .setScale(1.2)
      .setDepth(4);
    this.playerTwoRoundOne = this.add
      .sprite(710, 50, "inputButtons")
      .setScale(1.2)
      .setDepth(4);
    this.player2.wins === 1
      ? this.playerTwoRoundOne.setFrame(0)
      : this.playerTwoRoundOne.setFrame(12);
    this.playerTwoRoundTwo = this.add
      .sprite(690, 50, "inputButtons")
      .setFrame(12)
      .setScale(1.2)
      .setDepth(4);

    this.player1.sprite = this.physics.add
      .sprite(-50, 215, this.player1.spriteKey)
      .setScale(2)
      .setSize(20, 60)
      .setDepth(1);

    this.player2.sprite = this.physics.add
      .sprite(810, 215, this.player2.spriteKey)
      .setScale(2)
      .setSize(20, 60)
      .setDepth(1);

    this.referee = this.add
      .sprite(width / 2, 200, "referee")
      .setScale(2)
      .setDepth(0)
      .play("idle");

    // adds on screen buttons
    this.aButton = this.add
      .sprite(35, 100, "inputButtons")
      .setFrame(46)
      .setScale(3)
      .setInteractive()
      .setDepth(4);
    this.bButton = this.add
      .sprite(35, 175, "inputButtons")
      .setFrame(47)
      .setScale(3)
      .setInteractive()
      .setDepth(4);
    this.xButton = this.add
      .sprite(715, 100, "inputButtons")
      .setFrame(48)
      .setScale(3)
      .setInteractive()
      .setDepth(4);
    this.yButton = this.add
      .sprite(715, 175, "inputButtons")
      .setFrame(49)
      .setScale(3)
      .setInteractive()
      .setDepth(4);

    // adds button listeners
    this.aButton.on("pointerdown", () => {
      this.inputStates.A = true;
    });
    this.aButton.on("pointerup", () => {
      this.inputStates.A = false;
    });
    this.bButton.on("pointerdown", () => {
      this.inputStates.B = true;
    });
    this.bButton.on("pointerup", () => {
      this.inputStates.B = false;
    });
    this.xButton.on("pointerdown", () => {
      this.inputStates.X = true;
    });
    this.xButton.on("pointerup", () => {
      this.inputStates.X = false;
    });
    this.yButton.on("pointerdown", () => {
      this.inputStates.Y = true;
    });
    this.yButton.on("pointerup", () => {
      this.inputStates.Y = false;
    });
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
      x: 440,
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
    this.playerOneMash = this.add
      .sprite(this.player1.sprite.x, 130, "inputButtons")
      .setScale(3)
      .play(`${this.player1.mashButtons[this.player1.currentKeyIndex]}`)
      .setVisible(false);

    if (this.players === 2) {
      this.playerTwoMash = this.add
        .sprite(this.player2.sprite.x, 130, "inputButtons")
        .setScale(3)
        .play(`${this.player2.mashButtons[this.player2.currentKeyIndex]}`)
        .setVisible(false);
    }
    let animationsComplete = 0;
    const checkAnimationsComplete = () => {
      animationsComplete++;

      if (animationsComplete === 2) {
        // Countdown logic
        this.countdownText = this.add
          .text(this.cameras.main.width / 2, 100, "3", {
            fontFamily: "Crang",
            fontSize: 54,
            color: "#ffffff",
          })
          .setOrigin(0.5);
        let countDown = 3;
        this.time.addEvent({
          delay: 1000,
          repeat: 3,
          callback: () => {
            countDown--;
            if (countDown > 0) {
              this.countdownText.setText(`${countDown}`);
            } else {
              this.countdownText.setText("Go!");

              this.countdownText.destroy();
              this.startFight();
            }
          },
        });
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
      delay: Phaser.Math.Between(50, 300), // AI presses every 200-400ms
      callback: this.aiPress,
      callbackScope: this,
      loop: true,
    });
  }
  startFight() {
    this.matchStart = true;
    this.inputEnabled = true;
    this.playerOneMash.setVisible(true);
    if (this.players === 2) {
      this.playerTwoMash.setVisible(true);
    }
  }
  aiPress() {
    if (this.matchStart && this.players === 1) {
      this.player2.keyPressesPerDelay += 3;
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
        this.player1.sprite.setVelocity(this.player1.velocity * 10, 0);
        this.player2.sprite.setVelocity(this.player2.velocity * 10, 0);
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
    const currCorrectKey = player.mashButtons[player.currentKeyIndex];
    if (this.inputStates[currCorrectKey]) {
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
    if (this.player1.sprite.x <= 115) {
      this.player2.wins++;
      this.declareWinner(this.player2, this.player1, "right");
      if (this.player2.wins === 1) {
        this.playerTwoRoundOne.setFrame(0);
      } else {
        this.playerTwoRoundTwo.setFrame(0);
      }
    }
    if (this.player2.sprite.x >= 620) {
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
      .text(this.cameras.main.width / 2, 100, `${winText}`, {
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
          this.scene.start("End Game");
        } else {
          this.scene.start("Stage One");
        }
      });
    });
  }
}
