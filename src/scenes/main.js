import Phaser from "phaser";

import Preloader from "./Preloader";
import Welcome from "./Welcome";
import ChooseCharacter from "./ChooseCharacter";
import Stage from "./Stage";

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
  scene: [Preloader, Welcome, ChooseCharacter, Stage],
};

export default new Phaser.Game(config);
