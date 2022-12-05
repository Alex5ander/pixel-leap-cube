import React, { useEffect } from 'react';
import '../css/style.css';

export default function App() {
  useEffect(() => {
    (async () => {
      const Phaser = await import(`phaser`);
      let scoreText = null;
      let score = 0;
      let obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = null;

      const mainScene: Phaser.Types.Scenes.CreateSceneFromObjectConfig = {
        preload: function () {
          this.load.image('background', '/assets/background.png');
          this.load.image('floor', '/assets/floor.png');
        },
        create: async function () {
          this.add.image(0, 0, 'background').setOrigin(0);
          this.add.image(0, 960 - 64, 'floor').setOrigin(0);

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
              this.scene.start('game');
            },
            this
          );
        },
      };

      const gameScene: Phaser.Types.Scenes.CreateSceneFromObjectConfig = {
        preload: function () {
          this.load.image('background', '/assets/background.png');
          this.load.image('floor', '/assets/floor.png');
          this.load.image('player', '/assets/player.png');
          this.load.image('obstacle', '/assets/obstacle.png');
        },
        create: function () {
          this.add.image(0, 0, 'background').setOrigin(0);

          const player = this.physics.add.sprite(100, 100, 'player');

          const floor = this.physics.add.staticSprite(
            540 / 2,
            960 - 32,
            'floor'
          );

          obstacle = this.physics.add.sprite(
            540 + 32,
            960 - 320 + 64 + 32,
            'obstacle'
          );

          obstacle.body.allowGravity = false;

          this.physics.add.collider(player, [obstacle, floor]);

          obstacle.setAccelerationX(-300);

          scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: "'Press Start 2P'",
          });

          this.input.on('pointerdown', function () {
            player.setVelocityY(-player.body.mass * 500);
          });
        },
        update: function () {
          scoreText.setText('score: ' + score);

          if (obstacle.body.x < -64) {
            obstacle.setX(1000);
            obstacle.setVelocityX(-300);
            score += 1;
          }
        },
      };

      const game = new Phaser.Game({
        type: Phaser.CANVAS,
        width: 540,
        height: 960,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 1000 },
          },
        },
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });

      game.scene.add('main', mainScene);
      game.scene.add('game', gameScene);
      game.scene.start('main');
    })();
  }, []);

  return <></>;
}
