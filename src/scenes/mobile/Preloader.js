import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    // load in spritesheets for access throughout game
    this.load.spritesheet("Haruto", "/textures/sprites/playerOne.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("Jaydan", "/textures/sprites/playerTwo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("Ryota", "/textures/sprites/old_man.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("Thorgar", "/textures/sprites/orc.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("Aeson", "/textures/sprites/minotaur.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("woman", "/textures/sprites/woman.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("referee", "/textures/sprites/referee.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet(
      "inputButtons",
      "/textures/buttons/tilemap_white.png",
      {
        frameWidth: 17,
        frameHeight: 17,
      }
    );
  }
  create() {
    // animations library, if new players are added, add key to playable characters and loop will build animations
    const playableCharacters = [
      "Haruto",
      "Jaydan",
      "Ryota",
      "Aeson",
      "Thorgar",
    ];
    const animsFrames = {
      front_player_idle: [[364, 365], 2, -1],
      left_face_idle: [[377, 378], 3, -1],
      right_face_idle: [[351, 352], 3, -1], // lol
      left_walk_in_slow: [{ start: 143, end: 151 }, 7, -1],
      left_run: [{ start: 533, end: 540 }, 7, -1],
      right_walk_in_slow: [{ start: 117, end: 125 }, 7, -1],
      right_run: [{ start: 507, end: 514 }, 7, -1],
      front_walk_slow: [{ start: 130, end: 138 }, 10, -1],
      rear_walk_in: [{ start: 104, end: 112 }, 7, -1],
      left_salutation: [{ start: 195, end: 200 }, 4, 1], // use with caution, looks a bit right wing
      right_salutation: [{ start: 169, end: 174 }, 4, 1], // use with caution, looks a bit right wing
      left_taunt: [{ start: 39, end: 45 }, 4, 0], // repeats are a bit weird here
      right_taunt: [{ start: 13, end: 19 }, 4, 0], // repeats are a bit weird here
      front_taunt: [{ start: 27, end: 32 }, 4, 0], // repeats are a bit weird here
      right_wins: [{ start: 182, end: 187 }, 5, 0], // use setFlipX(true) for left win on play
      fall_down: [{ start: 260, end: 264 }, 9, 0],
    };

    // loops all playable characters and animations. Key sticks to "<characterKey>:<animsFrames[key]>" format.
    for (const player of playableCharacters) {
      for (const animName in animsFrames) {
        const [framesDisplay, frameRate, repeat] = animsFrames[animName];

        let frames;
        if (Array.isArray(framesDisplay)) {
          frames = this.anims.generateFrameNumbers(player, {
            frames: framesDisplay,
          });
        } else if (
          typeof framesDisplay === "object" &&
          framesDisplay.start !== undefined
        ) {
          frames = this.anims.generateFrameNumbers(player, {
            start: framesDisplay.start,
            end: framesDisplay.end,
          });
        } else {
          console.warn(`Invalid frame data for ${animName}`);
          continue;
        }

        this.anims.create({
          key: `${player}:${animName}`,
          frames,
          frameRate,
          repeat,
        });
      }
    }
    // referee animations
    const ref = {
      walk_in: [{ start: 244, end: 251 }, 5, -1],
      idle: [{ start: 261, end: 261 }, 5, -1],
      left_win: [{ start: 288, end: 293 }, 7, 0],
      right_win: [{ start: 306, end: 311 }, 7, 0],
    };

    for (const key in ref) {
      const [cells, frameRate, repeat] = ref[key];
      const { start, end } = cells;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers("referee", { start, end }),
        frameRate,
        repeat,
      });
    }
    // keypress animation loops
    const btnFlashes = {
      A: [4, 41],
      B: [5, 42],
      X: [6, 43],
      Y: [7, 44],
      I: [354, 90],
      K: [388, 124],
      U: [353, 89],
      O: [355, 91],
    };

    for (const key in btnFlashes) {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers("inputButtons", {
          frames: btnFlashes[key],
        }),
        frameRate: 3,
        repeat: -1,
      });
    }
    // starts the first scene with the Scene key from the super.
    this.scene.start("Welcome");
  }
}
