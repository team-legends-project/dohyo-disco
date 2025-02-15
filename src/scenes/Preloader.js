import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.spritesheet("playerOne", "/textures/sprites/playerOne.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("playerTwo", "/textures/sprites/playerTwo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("femalePlayer", "/textures/sprites/woman.png", {
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
  }
  create() {
    const playableCharacters = [
      "playerOne",
      "playerTwo",
      "femalePlayer",
      "orc",
      "minotaur",
    ];
    const animsFrames = {
      front_player_idle: [[364, 365], 3, -1],
      left_face_idle: [[377, 378], 3, -1],
      right_face_idle: [[351, 352], 3, -1], // lol
      left_walk_in_slow: [{ start: 143, end: 151 }, 7, -1],
      right_walk_in_slow: [{ start: 117, end: 125 }, 7, -1],
      front_walk_slow: [{ start: 130, end: 138 }, 10, -1],
      left_salutation: [{ start: 195, end: 200 }, 4, 1], // use with caution, looks a bit right wing
      right_salutation: [{ start: 169, end: 174 }, 4, 1], // use with caution, looks a bit right wing
      left_taunt: [{ start: 39, end: 45 }, 4, 1], // repeats are a bit weird here
      right_taunt: [{ start: 13, end: 19 }, 4, 1], // repeats are a bit weird here
      front_taunt: [{ start: 27, end: 32 }, 4, 1], // repeats are a bit weird here
      right_wins: [{ start: 182, end: 187 }, 5, 0], // use setFlipX(true) for left win on play
      fall_down: [{ start: 260, end: 265 }, 9, 0],
    };
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

    // starts the first scene
    this.scene.start("Choose Character");
  }
}
