import Phaser from 'phaser';

const font: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

export class GameOver extends Phaser.Scene {
  constructor() {
    super('gameOver');
  }
  create() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Game Over', font)
      .setOrigin(0.5);

    this.input.once(
      'pointerup',
      function () {
        this.scene.stop();
        this.scene.start('mainScene');
      },
      this
    );
  }
}
