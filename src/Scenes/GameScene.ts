import Phaser from 'phaser';

const font: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontFamily: '"Press Start 2P"',
};

export class GameScene extends Phaser.Scene {
  score = 0;
  scoreText: Phaser.GameObjects.Text;
  platforms: Phaser.Physics.Arcade.Group;
  player: Phaser.GameObjects.Rectangle;
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
    this.load.spritesheet('touch', '/assets/touchspritesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
      startFrame: 0,
      endFrame: 3,
    });
  }
  randomPositionX() {
    return Phaser.Math.Between(64, 540 - 64);
  }
  gameOver() {
    this.scene.stop('gameScene');
    this.scene.start('gameOver', { score: this.score });
    this.score = 0;
  }
  create() {
    const touchSprite = this.add.sprite(100, 100, 'touch');
    touchSprite.anims.create({
      key: 'wave',
      frames: this.anims.generateFrameNumbers('touch', {
        start: 0,
        end: 3,
        first: 0,
      }),
      frameRate: 10,
    });
    touchSprite.setVisible(false);
    touchSprite.setScrollFactor(0);

    this.controls = this.input.keyboard.createCursorKeys();

    const rect = this.add.rectangle(this.scale.width / 2, 0, 32, 32, 0xffffff);
    this.player = this.physics.add.existing(rect);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setBounceY(10);
    playerBody.setMaxVelocityY(1000);
    playerBody.checkCollision.up = false;
    playerBody.checkCollision.left = false;
    playerBody.checkCollision.right = false;

    this.jumpingSound = this.sound.add('jumping');
    this.platforms = this.physics.add.group();

    this.input.on('pointerdown', (e: Phaser.Input.Pointer) => {
      touchSprite.setVisible(true);
      touchSprite.x = e.x;
      touchSprite.y = e.y;
      touchSprite.play('wave');
    });

    for (let i = 0; i < 4; i++) {
      const obstacle = this.add.rectangle(0, 0, 128, 32, 0xffffff);

      if (i === 0) {
        obstacle.x = this.player.body.position.x;
        obstacle.y = 32;
      } else {
        obstacle.x = this.randomPositionX();
        obstacle.y = 32 + i * -300;
      }

      this.platforms.add(obstacle);
      const obstacleBody = obstacle.body as Phaser.Physics.Arcade.Body;
      obstacleBody.setAllowGravity(false);
      obstacleBody.setImmovable(true);
    }

    this.physics.add.collider(this.player, this.platforms, (_, obstacle) => {
      if (obstacle.body.checkCollision.up && !obstacle.getData('collide')) {
        obstacle.setData('collide', true);
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
      }
    });

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
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
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

    const array = this.platforms.children.getArray();
    const fail = array.every((e) => e.body.position.y < playerBody.position.y);

    if (fail) {
      this.cameras.main.stopFollow();

      if (this.player.y - this.cameras.main.worldView.y > 960) {
        this.gameOver();
      }
    }

    this.platforms.children.iterate((child: Phaser.GameObjects.Rectangle) => {
      const body = child.body as Phaser.Physics.Arcade.Body;

      if (child.y >= scrollY + 1100) {
        child.x = this.randomPositionX();
        child.y = scrollY - 300;
        child.setData('collide', false);
      }

      const velocity = 96;

      if (body.velocity.x === 0 && this.score === 15) {
        if (child.x > 64) {
          body.setVelocityX(-velocity);
        } else {
          body.setVelocityX(velocity);
        }
      }

      if (child.x > 540 - 64) {
        body.setVelocityX(-velocity);
      } else if (child.x <= 64) {
        body.setVelocityX(velocity);
      }

      body.updateBounds();
    });

    if (playerBody.onFloor()) {
      this.jumpingSound.play();
    }
  }
}
