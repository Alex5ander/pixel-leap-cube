import { GameOver } from './gameoverscene.js';
import { GameScene } from './gamescene.js';
import { MainScene } from './mainscene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 540,
  height: 960,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 981 }, fixedStep: true, timeScale: 0.7 },
  },
  dom: {
    createContainer: true,
  },
  pixelArt: true,
  scale: {
    parent: document.getElementById('gameArea'),
    mode: Phaser.Scale.FIT,
    autoRound: true,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MainScene, GameScene, GameOver],
  title: 'Pixel Leap Cube',
});
