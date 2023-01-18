import Phaser from 'phaser';

const font: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

const saveScore = async (name: string, score: number) => {
  try {
    await fetch('/api/addscore?name=' + name + '&score=' + score);
  } catch (error) {
    //
  }
};

export class GameOver extends Phaser.Scene {
  score = 0;
  constructor() {
    super('gameOver');
  }
  init(data: { score: number }) {
    this.score = data.score;
  }
  create() {
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

    this.input.once(
      'pointerup',
      function () {
        this.scene.stop('gameOver');
        this.scene.start('mainScene');
      },
      this
    );
  }
}
