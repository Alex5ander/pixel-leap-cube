const font = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

export class GameOver extends Phaser.Scene {
  score = 0;

  constructor() {
    super('gameOver');
  }
  init(data) {
    this.score = data.score;
  }
  create() {
    const goHome = () => {
      this.scene.stop('gameOver');
      this.scene.start('mainScene');
    };

    this.input.once('pointerup', goHome);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Game Over', font)
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 64,
        'Your score: ' + this.score,
        font
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 64,
        'Your score: ' + this.score,
        font
      )
      .setOrigin(0.5);
  }
}
