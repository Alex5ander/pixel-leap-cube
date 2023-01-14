import Phaser from 'phaser';

const font: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

export class MainScene extends Phaser.Scene {
  pressMessage = '';
  constructor() {
    super('mainScene');
    this.pressMessage =
      window.innerWidth <= 640 ? 'Touch to start' : 'Click to Start';
  }
  create() {
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        this.pressMessage,
        font
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 48,
        'Sound from Zapsplat',
        font
      )
      .setOrigin(0.5);

    this.input.once(
      'pointerup',
      function () {
        this.scene.stop();
        this.scene.start('gameScene');
      },
      this
    );
  }
}
