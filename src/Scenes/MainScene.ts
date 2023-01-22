import Phaser from 'phaser';

const font: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

const getTexts = () => ({
  pressMessage: window.innerWidth <= 640 ? 'Touch to start' : 'Click to Start',
  controlMessage:
    window.innerWidth <= 640 ? '' : 'use left and right\narrow keys to play',
});

export class MainScene extends Phaser.Scene {
  pressMessage = '';
  controlMessage = '';
  constructor() {
    super('mainScene');
    const { pressMessage, controlMessage } = getTexts();
    this.pressMessage = pressMessage;
    this.controlMessage = controlMessage;
  }
  create() {
    this.add
      .text(this.scale.width / 2, 24, 'Pixel Leap Cube', font)
      .setOrigin(0.5);

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
        this.scale.height - 24,
        'Sound from Zapsplat',
        font
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 128,
        this.controlMessage,
        font
      )
      .setAlign('center')
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
