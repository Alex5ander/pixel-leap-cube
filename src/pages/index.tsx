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

      let platforms: Phaser.Physics.Arcade.StaticGroup;
      let rect: Phaser.GameObjects.GameObject;
      let controls: Phaser.Types.Input.Keyboard.CursorKeys;

      class GameScene extends Phaser.Scene {
        constructor() {
          super('gameScene');
        }
        create() {
          controls = this.input.keyboard.createCursorKeys();
          rect = this.add.rectangle(50, 0, 32, 32, 0xff0000);
          rect = this.physics.add.existing(rect);
          const rb = rect.body as Phaser.Physics.Arcade.Body;
          rb.setBounceY(10);
          rb.setMaxVelocityY(2000);

          platforms = this.physics.add.staticGroup();

          for (let i = 0; i < 4; i++) {
            const obstacle = this.add.rectangle(0, 0, 200, 32, 0x00ff00);

            if (i === 0) {
              obstacle.x = 50;
              obstacle.y = 32;
            } else {
              obstacle.x = Phaser.Math.Between(0, 960);
              obstacle.y = i * 150;
            }

            platforms.add(obstacle);
          }

          this.cameras.main.startFollow(rect);
          this.cameras.main.setDeadzone(540);

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
            rb.setVelocityX(-100);
          }
          if (controls.right.isDown) {
            rb.setVelocityX(100);
          }

          if (rb.velocity.y < 0) {
            score += 1;
            scoreText.setText('Score: ' + score);
          }

          platforms.children.iterate((child: any) => {
            const scrollY = this.cameras.main.scrollY;
            if (child.y >= scrollY + 1300) {
              child.x = Phaser.Math.Between(-295, 490);
              child.y = scrollY - Phaser.Math.Between(80, 100);
              child.body.updateFromGameObject();
            }
          });
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
        scene: [MainScene, GameScene],
      });
    })();
  }, []);

  return <></>;
};
