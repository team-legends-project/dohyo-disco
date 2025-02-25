import Phaser from "phaser";

export default class Welcome extends Phaser.Scene {
  constructor() {
    super("Welcome");
    this.cursorIndex = 0;
  }
  init() {
    this.input.setDefaultCursor("none");
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
    const backGround = this.add.sprite(0, 80, "openingImage");
    backGround.setScale(0.5);
    backGround.setOrigin(0, 0);

    // creates title
    this.add.text(450, 100, "Dohyo Disco", {
      fontFamily: "Crang",
      fontSize: 40,
      color: "#ffffff",
    });
    // creates inputs
    this.keyObjects = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      select: Phaser.Input.Keyboard.KeyCodes.ENTER,
      close: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    // create and place sprites
    this.leftAnimatedCharacter = this.add.sprite(-50, 400, "Haruto");
    this.rightAnimatedCharacter = this.add.sprite(800, 400, "Jaydan");
    this.leftAnimatedCharacter.setScale(2);
    this.rightAnimatedCharacter.setScale(2);
    this.cursor = this.add
      .sprite(540, 245, "cursor")
      .setScale(2)
      .setVisible(false);
    // opening animations
    this.rightAnimatedCharacter.play("Haruto:right_walk_in_slow");
    this.leftAnimatedCharacter.play("Jaydan:left_walk_in_slow");

    this.tweens.add({
      targets: this.leftAnimatedCharacter,
      x: 250,
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
      x: 600,
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
    // creates menu
    const menuBackGround = this.add
      .rectangle(400, 340, 500, 300, 0x000000)
      .setDepth(2);
    const fontConfig = {
      fontFamily: "Crang",
      fontSize: 18,
      color: "#ffffff",
    };
    const instructions = this.add
      .text(
        190,
        210,
        "Player one controls:\nleft: a       right: d       mash: q,w,e,\n\n         hotseat\n\nPlayer two controls:\nleft: j       right: l       mash: u,i,o\n\npress esc to close",
        fontConfig
      )
      .setDepth(3);
    this.menuContainer = this.add.container(0, 0, [
      menuBackGround,
      instructions,
    ]);
    this.menuContainer.setDepth(2);
    this.menuContainer.setVisible(false);
  }

  // buttons and selectors toggle on after animation ends.
  checkBothStopped() {
    if (this.leftCharacterStopped && this.rightCharacterStopped) {
      this.showStartButton();
    }
  }
  showStartButton() {
    // adds cursor
    this.cursor.setVisible(true);
    this.tweens.add({
      targets: this.cursor,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
    // adds on screen hint
    this.add.text(150, 530, "use the up and down keys, press enter to select", {
      fontFamily: "Crang",
      fontSize: 18,
      color: "#ffffff",
    });
    // adds buttons
    this.onePlayerButton = this.add
      .image(420, 240, "onePlayerSelect")
      .setInteractive()
      .setScale(0.75);
    this.twoPlayerButton = this.add
      .image(420, 340, "twoPlayerSelect")
      .setInteractive()
      .setScale(0.75);
    this.controlsBtn = this.add
      .image(420, 440, "controls")
      .setInteractive()
      .setScale(0.75);
    this.controlBtnText = this.add
      .text(420, 435, "controls", {
        fontFamily: "Crang",
        fontSize: 28,
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }
  handleInputs() {
    if (
      this.cursorIndex < 2 &&
      Phaser.Input.Keyboard.JustDown(this.keyObjects.down)
    ) {
      this.cursor.y += 100;
      this.cursorIndex++;
    }
    if (
      this.cursorIndex > 0 &&
      Phaser.Input.Keyboard.JustDown(this.keyObjects.up)
    ) {
      this.cursor.y -= 100;
      this.cursorIndex--;
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyObjects.select)) {
      if (this.cursorIndex < 2) {
        this.leftAnimatedCharacter.play("Jaydan:front_taunt");
        this.rightAnimatedCharacter.play("Haruto:front_taunt");
        if (this.cursorIndex === 0) {
          this.tweens.add({
            targets: this.onePlayerButton,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 300,
            yoyo: true,
          });
        } else {
          this.tweens.add({
            targets: this.twoPlayerButton,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 300,
            yoyo: true,
          });
        }
        this.time.delayedCall(1500, () => {
          this.scene.start("Choose Character", {
            players: this.cursorIndex + 1,
          });
        });
      } else {
        this.tweens.add({
          targets: this.controlsBtn,
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 300,
          yoyo: true,
        });
        this.tweens.add({
          targets: this.controlBtnText,
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 300,
          yoyo: true,
        });
        this.time.delayedCall(400, () => {
          this.menuContainer.setVisible(true);
        });
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyObjects.close)) {
      this.menuContainer.setVisible(false);
    }
  }
  update() {
    this.handleInputs();
  }
}
