import Phaser from 'phaser';

const font: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

export class GameScene extends Phaser.Scene {
  score = 0;
  scoreText: Phaser.GameObjects.Text;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  controls: Phaser.Types.Input.Keyboard.CursorKeys;
  jumpingSound: Phaser.Sound.BaseSound;

  constructor() {
    super('gameScene');
    this.score = 0;
  }
  preload() {
    this.load.audio(
      'jumping',
      '/assets/zapsplat_cartoon_springing_boing_jump_jaw_harp_001_72946.mp3'
    );
  }
  randomPositionX() {
    return Phaser.Math.Between(-170, 170);
  }
  create() {
    const bg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      540,
      960,
      0x0000ff
    );
    bg.setScrollFactor(0);

    this.controls = this.input.keyboard.createCursorKeys();

    const rect = this.add.rectangle(50, 0, 32, 32, 0xff0000);
    this.player = this.physics.add.existing(rect);

    const playerBody = this.player.body;
    playerBody.setBounceY(10);
    playerBody.setMaxVelocityY(1000);
    playerBody.checkCollision.up = false;
    playerBody.checkCollision.left = false;
    playerBody.checkCollision.right = false;

    this.jumpingSound = this.sound.add('jumping');
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 4; i++) {
      const obstacle = this.add.rectangle(0, 0, 128, 32, 0x00ff00);

      if (i === 0) {
        obstacle.fillColor = 0xff0000;
        obstacle.x = this.player.body.position.x;
        obstacle.y = 32;
      } else {
        obstacle.x = this.randomPositionX();
        obstacle.y = 32 + i * -300;
      }

      this.platforms.add(obstacle);
    }

    this.physics.add.collider(this.player, this.platforms);

    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      color: font.color,
      fontFamily: font.fontFamily,
    });

    this.scoreText.setScrollFactor(0);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5, 180);
  }
  update() {
    const playerBody = this.player.body;
    if (this.controls.left.isDown) {
      playerBody.setVelocityX(-200);
    }
    if (this.controls.right.isDown) {
      playerBody.setVelocityX(200);
    }

    if (this.input.pointer1.isDown) {
      const pointer = this.input.pointer1;

      if (pointer.x > this.scale.width / 2) {
        playerBody.setVelocityX(200);
      }
      if (pointer.x < this.scale.width / 2) {
        playerBody.setVelocityX(-200);
      }
    }

    const scrollY = this.cameras.main.scrollY;

    if (playerBody.velocity.y < 0) {
      this.score += 1;
    } else if (this.score > 0) {
      this.score -= 1;
    }
    this.scoreText.setText('Score: ' + this.score);
    this.platforms.children.iterate((child: any) => {
      if (child.y >= scrollY + 1100) {
        child.x = this.randomPositionX();
        child.y = scrollY - 300;
        child.body.updateFromGameObject();
      }
    });

    if (playerBody.onFloor()) {
      this.jumpingSound.play();
    }

    if (playerBody.velocity.y === 1000) {
      this.cameras.main.stopFollow();

      this.time.delayedCall(
        300,
        () => {
          this.score = 0;
          this.scene.stop('gameScene');
          this.scene.start('gameOver');
        },
        null,
        this
      );
    }
  }
}
