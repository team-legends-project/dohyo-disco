import Phaser from "phaser";
let timer;
export default class StageTwoPlayer extends Phaser.Scene {
  constructor() {
    super("Stage Two");
    this.matchStart = false;
    this.matchEnd = false;
    this.combinedVelocity = 0;
    this.velocityCheckDelayInSeconds = 1;
    this.haveCollided = false;
    this.gameWon = false;
    this.mashButtons = ["A", "B", "X", "Y"];
    this.player1 = {
      currentKeyIndex: 0,
      keyPressesPerDelay: 0,
      velocity: 0,
      direction: 1,
      spriteKey: null,
      sprite: null,
      isMoving: false,
      wins: 0,
      inputStates: {
        A: false,
        B: false,
        X: false,
        Y: false,
      },
    };
    this.player2 = {
      currentKeyIndex: 0,
      keyPressesPerDelay: 0,
      velocity: 0,
      direction: -1,
      spriteKey: null,
      sprite: null,
      isMoving: false,
      wins: 0,
      inputStates: {
        A: false,
        B: false,
        X: false,
        Y: false,
      },
    };
  }
  init(data) {
    this.player1.spriteKey = data.leftPlayer;
    this.player2.spriteKey = data.rightPlayer;
    // resets game state
    this.matchEnd = false;
    this.matchStart = false;
    this.haveCollided = false;
  }
  preload() {}
  create() {
    this.inputEnabled = false;
    // this isn't wrong, accounts for device in landscape
    const height = this.scale.height;
    const width = this.scale.width;
    // adds play area
    this.circle = this.add
      .circle(width / 2, height / 2, height / 2, 0xff0000)
      .setOrigin(0.5);
    // player 1
    this.player1.sprite = this.physics.add
      .sprite(110, height / 2, this.player1.spriteKey)
      .setOrigin(0.5)
      .setScale(1.2)
      .setSize(15, 20);
    this.player1.sprite.angle = 90;
    // player 2
    this.player2.sprite = this.physics.add
      .sprite(630, height / 2, this.player2.spriteKey)
      .setOrigin(0.5)
      .setScale(1.2)
      .setSize(15, 20);
    this.player2.sprite.angle = 270;
    // adds referee
    this.referee = this.add
      .sprite(this.scale.width / 2, 30, "referee")
      .setScale(1.2)
      .play("idle");

    // round won icons
    this.playerOneRoundOne = this.add
      .sprite(90, 260, "inputButtons")
      .setScale(1.2)
      .setDepth(4);
    this.player1.wins === 1
      ? this.playerOneRoundOne.setFrame(0)
      : this.playerOneRoundOne.setFrame(12);
    this.playerOneRoundTwo = this.add
      .sprite(90, 240, "inputButtons")
      .setFrame(12)
      .setScale(1.2)
      .setDepth(4);
    this.playerTwoRoundOne = this.add
      .sprite(650, 40, "inputButtons")
      .setScale(1.2)
      .setDepth(4);
    this.player2.wins === 1
      ? this.playerTwoRoundOne.setFrame(0)
      : this.playerTwoRoundOne.setFrame(12);
    this.playerTwoRoundTwo = this.add
      .sprite(650, 60, "inputButtons")
      .setFrame(12)
      .setScale(1.2)
      .setDepth(4);
    // player names
    const textConfig = {
      fontFamily: "Crang",
      fontSize: 18,
      color: "#ffffff",
    };
    this.playerOneName = this.add.text(
      110,
      15,
      `${this.player1.spriteKey}`,
      textConfig
    );
    this.playerOneName.angle = 90;
    this.playerTwoName = this.add.text(
      630,
      285,
      `${this.player2.spriteKey}`,
      textConfig
    );

    // walk on
    this.tweens.add({
      targets: this.player1.sprite,
      x: 300,
      duration: 2000,
      ease: "Linear",
      onUpdate: () => {
        this.player1.sprite.play(
          `${this.player1.spriteKey}:rear_walk_in`,
          true
        );
      },
      onComplete: () => {
        this.player1.sprite
          .play(`${this.player1.spriteKey}:rear_salutation`)
          .chain(`${this.player1.spriteKey}:rear_idle`)
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
          `${this.player2.spriteKey}:rear_walk_in`,
          true
        );
      },
      onComplete: () => {
        this.player2.sprite
          .play(`${this.player2.spriteKey}:rear_salutation`)
          .chain(`${this.player2.spriteKey}:rear_idle`)
          .on("animationcomplete", checkAnimationsComplete);
      },
    });
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
              this.time.delayedCall(500, () => {
                this.countdownText.destroy();
                this.startFight();
              });
            }
          },
        });
      }
    };
    this.playerTwoName.angle = 270;
    // player buttons
    this.p1AButton = this.add
      .sprite(40, 40, "inputButtons")
      .setFrame(46)
      .setScale(3)
      .setInteractive();
    this.p1BButton = this.add
      .sprite(40, 110, "inputButtons")
      .setFrame(47)
      .setScale(3)
      .setInteractive();

    this.p1XButton = this.add
      .sprite(40, 190, "inputButtons")
      .setFrame(48)
      .setScale(3)
      .setInteractive();

    this.p1YButton = this.add
      .sprite(40, 260, "inputButtons")
      .setFrame(49)
      .setScale(3)
      .setInteractive();
    this.p1AButton.angle = 90;
    this.p1BButton.angle = 90;
    this.p1XButton.angle = 90;
    this.p1YButton.angle = 90;

    this.p2AButton = this.add
      .sprite(700, 260, "inputButtons")
      .setFrame(46)
      .setScale(3)
      .setInteractive();
    this.p2BButton = this.add
      .sprite(700, 190, "inputButtons")
      .setFrame(47)
      .setScale(3)
      .setInteractive();

    this.p2XButton = this.add
      .sprite(700, 110, "inputButtons")
      .setFrame(48)
      .setScale(3)
      .setInteractive();

    this.p2YButton = this.add
      .sprite(700, 40, "inputButtons")
      .setFrame(49)
      .setScale(3)
      .setInteractive();
    this.p2AButton.angle = 270;
    this.p2BButton.angle = 270;
    this.p2XButton.angle = 270;
    this.p2YButton.angle = 270;

    // adds button listeners
    this.p1AButton.on("pointerdown", () => {
      this.player1.inputStates.A = true;
    });
    this.p1AButton.on("pointerup", () => {
      this.player1.inputStates.A = false;
    });
    this.p1BButton.on("pointerdown", () => {
      this.player1.inputStates.B = true;
    });
    this.p1BButton.on("pointerup", () => {
      this.player1.inputStates.B = false;
    });
    this.p1XButton.on("pointerdown", () => {
      this.player1.inputStates.X = true;
    });
    this.p1XButton.on("pointerup", () => {
      this.player1.inputStates.X = false;
    });
    this.p1YButton.on("pointerdown", () => {
      this.player1.inputStates.Y = true;
    });
    this.p1YButton.on("pointerup", () => {
      this.player1.inputStates.Y = false;
    });

    this.p2AButton.on("pointerdown", () => {
      this.player2.inputStates.A = true;
    });
    this.p2AButton.on("pointerup", () => {
      this.player2.inputStates.A = false;
    });
    this.p2BButton.on("pointerdown", () => {
      this.player2.inputStates.B = true;
    });
    this.p2BButton.on("pointerup", () => {
      this.player2.inputStates.B = false;
    });
    this.p2XButton.on("pointerdown", () => {
      this.player2.inputStates.X = true;
    });
    this.p2XButton.on("pointerup", () => {
      this.player2.inputStates.X = false;
    });
    this.p2YButton.on("pointerdown", () => {
      this.player2.inputStates.Y = true;
    });
    this.p2YButton.on("pointerup", () => {
      this.player2.inputStates.Y = false;
    });
    // adds mash icons
    this.playerOneMash = this.add
      .sprite(this.player1.sprite.x, 255, "inputButtons")
      .setScale(2.4)
      .setOrigin(0.5)
      .play(`${this.mashButtons[this.player1.currentKeyIndex]}`)
      .setVisible(false)
      .setAngle(90);

    this.playerTwoMash = this.add
      .sprite(this.player2.sprite.x, 250, "inputButtons")
      .setScale(2.4)
      .setOrigin(0.5)
      .play(`${this.mashButtons[this.player2.currentKeyIndex]}`)
      .setVisible(false)
      .setAngle(270);

    // creates a timer for five seconds to randomise an index of keypress
    this.time.addEvent({
      delay: 5000,
      callback: this.changeMashButton,
      callbackScope: this,
      loop: true,
    });
    // collision detection
    this.physics.add.collider(this.player1.sprite, this.player2.sprite);
    this.physics.world.gravity.y = 0;

    // check the player input
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
        `${this.mashButtons[this.player1.currentKeyIndex]}`
      );

      this.playerTwoMash.play(
        `${this.mashButtons[this.player2.currentKeyIndex]}`
      );
    }
  }
  startFight() {
    this.matchStart = true;
    this.inputEnabled = true;
    this.playerOneMash.setVisible(true);
    this.playerTwoMash.setVisible(true);
  }
  checkPlayerVelocity(player) {
    player.velocity =
      (player.keyPressesPerDelay * player.direction) /
      this.velocityCheckDelayInSeconds;
    player.keyPressesPerDelay = 0;
    if (!player.isMoving && Math.abs(player.velocity) > 0) {
      player.sprite.play(`${player.spriteKey}:rear_run`);
      player.isMoving = true;
    } else if (player.isMoving && Math.abs(player.velocity) === 0) {
      player.sprite.play(`${player.spriteKey}:rear_idle`);
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

  // move players and button sprites
  updatePlayers() {
    this.updatePlayer(this.player1);
    this.updatePlayer(this.player2);
    this.playerTwoMash.x = this.player2.sprite.x;
    this.playerOneMash.x = this.player1.sprite.x;
  }
  updatePlayer(player) {
    const currCorrectKey = this.mashButtons[player.currentKeyIndex];
    if (player.inputStates[currCorrectKey]) {
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
    if (this.player1.sprite.x <= 245) {
      this.player2.wins++;
      this.declareWinner(this.player2, this.player1, "right");
      if (this.player2.wins === 1) {
        this.playerTwoRoundOne.setFrame(0);
      } else {
        this.playerTwoRoundTwo.setFrame(0);
      }
    }
    if (this.player2.sprite.x >= 500) {
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

    this.playerTwoMash.setVisible(false);

    winner.wins === 2 ? (this.gameWon = true) : (this.gameWon = false);
    const winText = this.gameWon
      ? `${winner.spriteKey} wins the game!`
      : `${winner.spriteKey} wins the round!`;
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 80, `${winText}`, {
        fontFamily: "Crang",
        fontSize: 28,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
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
          this.scene.start("Stage Two");
        }
      });
    });
  }
}
