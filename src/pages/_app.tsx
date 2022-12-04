import React, { useEffect } from 'react';
import '../css/style.css';

export default function App() {
  useEffect(() => {
    (async () => {
      const Phaser = await import(`phaser`);
      let scoreText = null;
      let obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = null;

      const game = new Phaser.Game({
        type: Phaser.CANVAS,
        width: 540,
        height: 960,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 981 },
          },
        },
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: {
          preload: function () {
            this.load.image('background', '/assets/background.png');
            this.load.image('floor', '/assets/floor.png');
            this.load.image('player', '/assets/player.png');
            this.load.image('obstacle', '/assets/obstacle.png');
          },
          create: function () {
            const background = this.add.image(0, 0, 'background');
            background.setOrigin(0, 0);

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

            this.physics.add.collider([player, obstacle], [obstacle, floor]);

            obstacle.setAccelerationX(-500);

            scoreText = this.add.text(16, 16, 'score: 0', {
              fontSize: '32px',
              color: '#fff',
              fontFamily: "'Press Start 2P'",
            });

            this.input.on('pointerdown', function () {
              player.setVelocityY(-player.body.mass * 500);
            });
          },
          update: function (time: number, delta: number) {
            scoreText.setText('score: 10');

            if (obstacle.body.x < -64) {
              obstacle.setX(540 + 64);
              obstacle.setVelocityX(-500);
            }
          },
        },
      });
    })();
  }, []);

  return <></>;
}
