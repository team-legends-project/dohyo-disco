import Phaser from "phaser";

import PreloaderDesk from "./desktop/Preloader";
import WelcomeDesk from "./desktop/Welcome";
import ChooseCharacterDesk from "./desktop/ChooseCharacter";
// @ts-ignore
import StageOneDesk from "./desktop/StageOne";
import EndGameDesk from "./desktop/End";
import Preloader from "./mobile/Preloader";
import Welcome from "./mobile/Welcome";
import ChooseCharacter from "./mobile/ChooseCharacter";
import StageOne from "./mobile/StageOne";
import EndGame from "./mobile/End";
const isMobile = window.innerWidth <= 900;

// Create an overlay for mobile users
const rotationOverlay = document.createElement("div");
rotationOverlay.id = "rotation-overlay";
rotationOverlay.style.position = "fixed";
rotationOverlay.style.top = "0";
rotationOverlay.style.left = "0";
rotationOverlay.style.width = "100vw";
rotationOverlay.style.height = "100vh";
rotationOverlay.style.background = "rgba(0, 0, 0, 0.8)";
rotationOverlay.style.color = "#fff";
rotationOverlay.style.display = "flex";
rotationOverlay.style.justifyContent = "center";
rotationOverlay.style.alignItems = "center";
rotationOverlay.style.fontSize = "20px";
rotationOverlay.style.textAlign = "center";
rotationOverlay.style.zIndex = "9999";
rotationOverlay.innerHTML =
  "Please rotate your device to landscape to start the game!";
document.body.appendChild(rotationOverlay);
rotationOverlay.style.display = "none"; // Initially hidden

// Function to start the correct version
function startGame(config) {
  new Phaser.Game(config);
}

// Function to check device orientation
function checkOrientationAndStart() {
  if (window.innerWidth > window.innerHeight) {
    rotationOverlay.style.display = "none"; // Hide message
    startGame(mobileConfig); // Start the mobile game
    window.removeEventListener("resize", checkOrientationAndStart);
  } else {
    rotationOverlay.style.display = "flex"; // Show message
  }
}

// Desktop config (runs immediately if on desktop)
const desktopConfig = {
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
  scene: [
    PreloaderDesk,
    WelcomeDesk,
    ChooseCharacterDesk,
    StageOneDesk,
    EndGameDesk,
  ],
};

// Mobile config (requires rotation check before running)
const mobileConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 740,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preloader, Welcome, ChooseCharacter, StageOne, EndGame], // Replace with mobile-specific scenes later
};

// Start desktop immediately, or check for mobile rotation
if (!isMobile) {
  startGame(desktopConfig);
} else {
  checkOrientationAndStart();
  window.addEventListener("resize", checkOrientationAndStart); // Keep checking on resize
}
