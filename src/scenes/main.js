import Phaser from "phaser";

import Preloader from "./Preloader";
import welcome from "./Welcome";

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
  scene: [Preloader, welcome],
};

export default new Phaser.Game(config);
