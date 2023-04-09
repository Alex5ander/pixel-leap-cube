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

const getScore = async () => {
  const request = await fetch('/api/leaderboard');
  return request.json();
};

export class MainScene extends Phaser.Scene {
  pressMessage = '';
  controlMessage = '';
  leaderboard: { name: string; score: number }[] = [];

  constructor() {
    super('mainScene');
    const { pressMessage, controlMessage } = getTexts();
    this.pressMessage = pressMessage;
    this.controlMessage = controlMessage;
  }
  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const offsetY = 64;
    const spacing = 24;

    getScore().then((e) => {
      this.add
        .text(centerX, centerY + 48, 'Top 10 players', font)
        .setOrigin(0.5);

      e.forEach((e, i) => {
        const { name, score } = e;
        const s = 28 - Math.floor(name.length + score.toString().length + 1);

        this.add
          .text(
            centerX,
            centerY + offsetY + spacing * (i + 1),
            `${i + 1}.${'_'.repeat(2)}${name}${'_'.repeat(s)}${score}`,
            { ...font, fontSize: '16px' }
          )
          .setOrigin(0.5);
      });
    });

    this.add.text(centerX, 24, 'Pixel Leap Cube', font).setOrigin(0.5);

    this.add.text(centerX, centerY, this.pressMessage, font).setOrigin(0.5);

    this.add
      .text(centerX, this.scale.height - 64, this.controlMessage, {
        ...font,
        fontSize: '1rem',
      })
      .setAlign('center')
      .setOrigin(0.5);

    this.add
      .text(centerX, this.scale.height - 24, 'Sound from Zapsplat', {
        ...font,
        fontSize: '1rem',
      })
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
