const font = {
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
  leaderboard = [];

  constructor() {
    super('mainScene');
    const { pressMessage, controlMessage } = getTexts();
    this.pressMessage = pressMessage;
    this.controlMessage = controlMessage;
  }
  preload() {
    const graphics = this.add.graphics();

    this.load.setPath('assets');
    this.load.on('progress', (value) => {
      const rect = new Phaser.Geom.Rectangle(
        0,
        this.scale.height / 2 - 32,
        this.scale.width,
        64
      );

      graphics.fillStyle(0xffffff, 1);
      graphics.fillRectShape(rect);

      graphics.fillStyle(0x000000);
      rect.setPosition(1, this.scale.height / 2 - 30);
      rect.setSize(this.scale.width - 2, 60);
      graphics.fillRectShape(rect);

      graphics.fillStyle(0xffffff);
      rect.setPosition(2, this.scale.height / 2 - 29);
      rect.setSize((this.scale.width - 4) * value, 58);
      graphics.fillRectShape(rect);
    });

    const text = this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'LOADING', {
        ...font,
        color: '#000',
      })
      .setOrigin(0.5);

    this.load.on('complete', () => {
      graphics.destroy();
      text.destroy();
    });

    this.load.audio(
      'jumping',
      'zapsplat_cartoon_springing_boing_jump_jaw_harp_001_72946.mp3'
    );
    this.load.image('particle', 'particle.png');
    this.load.spritesheet('touch', 'touchspritesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
      startFrame: 0,
      endFrame: 3,
    });
  }
  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.text(centerX, 24, this.game.config.gameTitle, font).setOrigin(0.5);

    const message = this.add
      .text(centerX, centerY, this.pressMessage, font)
      .setOrigin(0.5);

    this.tweens.addCounter({
      to: 0.5,
      from: 1,
      duration: 1000,
      repeat: -1,
      yoyo: true,
      onUpdate: (e) => {
        message.setAlpha(e.getValue());
      },
    });

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
