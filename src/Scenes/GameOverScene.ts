import Phaser from 'phaser';

const font: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

const saveScore = async (name: string, score: number) =>
  await fetch('/api/addscore?name=' + name + '&score=' + score);

export class GameOver extends Phaser.Scene {
  score = 0;

  constructor() {
    super('gameOver');
  }
  init(data: { score: number }) {
    this.score = data.score;
  }
  create() {
    const goHome = () => {
      this.scene.stop('gameOver');
      this.scene.start('mainScene');
    };

    const element = this.add
      .dom(this.scale.width / 2, this.scale.height / 2 + 100)
      .createFromCache('form')
      .setOrigin(0.5, 0);

    const form = element.getChildByID('form') as HTMLFormElement;
    const button = element.getChildByID('home') as HTMLButtonElement;
    button.onclick = () => {
      this.scene.stop('gameOver');
      this.scene.start('mainScene');
    };
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = e.target['name'].value;
      try {
        const response = await saveScore(name, this.score);
        if (response.status == 200) {
          goHome();
        } else {
          alert('Ouve um erro tente novamente');
        }
      } catch (error) {
        alert('Ouve um erro tente novamente');
      }
    };

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
