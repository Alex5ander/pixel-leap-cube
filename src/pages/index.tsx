import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    (async () => {
      const Phaser = await import(`phaser`);
      let scoreText: Phaser.GameObjects.Text;
      let score = 0;

      class MainScene extends Phaser.Scene {
        constructor() {
          super('mainScene');
        }
        create() {
          this.add
            .text(540 / 2, 960 / 2, 'Click to Start', {
              color: '#fff',
              fontSize: '24px',
              fontFamily: '"Press Start 2P"',
            })
            .setOrigin(0.5);

          this.input.once(
            'pointerdown',
            function () {
              this.scene.start('gameScene');
            },
            this
          );
        }
      }

      class GameOver extends Phaser.Scene {
        constructor() {
          super('gameOver');
        }
        create() {
          this.add
            .text(540 / 2, 960 / 2, 'Game Over', {
              color: '#fff',
              fontSize: '24px',
              fontFamily: '"Press Start 2P"',
            })
            .setOrigin(0.5);

          this.input.once(
            'pointerdown',
            function () {
              this.scene.start('mainScene');
            },
            this
          );
        }
      }

      let platforms: Phaser.Physics.Arcade.StaticGroup;
      let rect: Phaser.GameObjects.GameObject;
      let controls: Phaser.Types.Input.Keyboard.CursorKeys;

      class GameScene extends Phaser.Scene {
        constructor() {
          super('gameScene');
        }
        randomPositionX() {
          return Phaser.Math.Between(-170, 170);
        }
        create() {
          controls = this.input.keyboard.createCursorKeys();
          rect = this.add.rectangle(50, 0, 32, 32, 0xff0000);
          rect = this.physics.add.existing(rect);
          const rb = rect.body as Phaser.Physics.Arcade.Body;
          rb.setBounceY(10);
          rb.setMaxVelocityY(1000);

          platforms = this.physics.add.staticGroup();

          for (let i = 0; i < 4; i++) {
            const obstacle = this.add.rectangle(0, 0, 128, 32, 0x00ff00);

            if (i === 0) {
              obstacle.fillColor = 0xff0000;
              obstacle.x = rect.body.position.x;
              obstacle.y = 32;
            } else {
              obstacle.x = this.randomPositionX();
              obstacle.y = 32 + i * -300;
            }

            platforms.add(obstacle);
          }

          this.cameras.main.startFollow(rect);
          this.cameras.main.setDeadzone(this.scale.width, 180);

          rb.checkCollision.up = false;
          rb.checkCollision.left = false;
          rb.checkCollision.right = false;

          this.physics.add.collider(rect, platforms);

          scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: "'Press Start 2P'",
          });

          scoreText.setScrollFactor(0);
        }
        update() {
          const rb = rect.body as Phaser.Physics.Arcade.Body;
          if (controls.left.isDown) {
            rb.setVelocityX(-200);
          }
          if (controls.right.isDown) {
            rb.setVelocityX(200);
          }

          if (rb.velocity.y < 0) {
            score += 1;
            scoreText.setText('Score: ' + score);
          }
          const scrollY = this.cameras.main.scrollY;

          platforms.children.iterate((child: any) => {
            if (child.y >= scrollY + 1100) {
              child.x = this.randomPositionX();
              child.y = scrollY - 300;
              child.body.updateFromGameObject();
            }
          });

          if (scrollY > 100) {
            this.cameras.main.stopFollow();
          }

          if (rect.body.position.y >= scrollY + 1000) {
            this.game.scene.stop('gameScene');
            this.game.scene.start('gameOver');
          }
        }
      }

      const game = new Phaser.Game({
        type: Phaser.CANVAS,
        width: 540,
        height: 960,
        physics: {
          default: 'arcade',
          arcade: { gravity: { y: 981 }, fixedStep: true, timeScale: 0.7 },
        },
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [MainScene, GameScene, GameOver],
      });
    })();
  }, []);

  return <></>;
};
