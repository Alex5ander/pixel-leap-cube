import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    (async () => {
      const Phaser = await import(`phaser`);
      let scoreText: Phaser.GameObjects.Text;
      let score = 0;
      const pressMessage =
        window.innerWidth <= 640 ? 'Touch to start' : 'Click to Start';

      const font: Phaser.Types.GameObjects.Text.TextStyle = {
        color: '#fff',
        fontSize: '24px',
        fontFamily: '"Press Start 2P"',
      };

      class MainScene extends Phaser.Scene {
        constructor() {
          super('mainScene');
        }
        create() {
          this.add
            .text(
              this.scale.width / 2,
              this.scale.height / 2,
              pressMessage,
              font
            )
            .setOrigin(0.5);

          this.add
            .text(
              this.scale.width / 2,
              this.scale.height - 48,
              'Sound from Zapsplat',
              font
            )
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

      class GameOver extends Phaser.Scene {
        constructor() {
          super('gameOver');
        }
        create() {
          this.add
            .text(
              this.scale.width / 2,
              this.scale.height / 2,
              'Game Over',
              font
            )
            .setOrigin(0.5);

          this.input.once(
            'pointerup',
            function () {
              this.scene.stop();
              this.scene.start('mainScene');
            },
            this
          );
        }
      }

      let platforms: Phaser.Physics.Arcade.StaticGroup;
      let rect: Phaser.GameObjects.GameObject;
      let controls: Phaser.Types.Input.Keyboard.CursorKeys;
      let sound: Phaser.Sound.BaseSound;

      class GameScene extends Phaser.Scene {
        constructor() {
          super('gameScene');
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
          controls = this.input.keyboard.createCursorKeys();
          rect = this.add.rectangle(50, 0, 32, 32, 0xff0000);
          rect = this.physics.add.existing(rect);
          const rb = rect.body as Phaser.Physics.Arcade.Body;
          rb.setBounceY(10);
          rb.setMaxVelocityY(1000);
          sound = this.sound.add('jumping');
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
            color: font.color,
            fontFamily: font.fontFamily,
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

          if (this.input.pointer1.isDown) {
            const pointer = this.input.pointer1;

            if (pointer.x > this.scale.width / 2) {
              rb.setVelocityX(200);
            }
            if (pointer.x < this.scale.width / 2) {
              rb.setVelocityX(-200);
            }
          }

          const scrollY = this.cameras.main.scrollY;

          if (rb.velocity.y < 0) {
            score += 1;
          } else if (score > 0) {
            score -= 1;
          }
          scoreText.setText('Score: ' + score);
          platforms.children.iterate((child: any) => {
            if (child.y >= scrollY + 1100) {
              child.x = this.randomPositionX();
              child.y = scrollY - 300;
              child.body.updateFromGameObject();
            }
          });

          if (rb.onFloor()) {
            sound.play();
          }

          if (rb.velocity.y === 1000) {
            this.cameras.main.stopFollow();

            this.time.delayedCall(
              300,
              () => {
                score = 0;
                this.scene.stop('gameScene');
                this.scene.start('gameOver');
              },
              null,
              this
            );
          }
        }
      }

      new Phaser.Game({
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
