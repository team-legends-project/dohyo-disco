import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    // load in spritesheets for access throughout game
    this.load.spritesheet("playerOne", "/textures/sprites/playerOne.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("playerTwo", "/textures/sprites/playerTwo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("oldMan", "/textures/sprites/old_man.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("orc", "/textures/sprites/orc.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("minotaur", "/textures/sprites/minotaur.png", {
      frameWidth: 64,
      frameHeight: 64,
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
      "playerOne",
      "playerTwo",
      "oldMan",
      "orc",
      "minotaur",
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
      front_taunt: [{ start: 27, end: 32 }, 4, 1], // repeats are a bit weird here
      right_wins: [{ start: 182, end: 187 }, 5, 0], // use setFlipX(true) for left win on play
      fall_down: [{ start: 260, end: 265 }, 9, 0],
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

    // keypress animation loops
    const btnFlashes = {
      w: [348, 84],
      q: [347, 83],
      e: [349, 85],
      s: [382, 118],
      i: [354, 90],
      k: [388, 124],
      u: [353, 89],
      o: [355, 91],
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
    this.scene.start("Stage Two");
  }
}
