import Phaser from "phaser";

import Preloader from "./Preloader";
import welcome from "./Welcome";
import ChooseCharacter from "./ChooseCharacter";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preloader, welcome, ChooseCharacter],
};

export default new Phaser.Game(config);
