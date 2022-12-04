import React, { useEffect } from 'react';
import '../css/style.css';

export default function App() {
  useEffect(() => {
    (async () => {
      const Phaser = await import(`phaser`);

      const game = new Phaser.Game({
        type: Phaser.CANVAS,
        width: 960,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 981 },
          },
        },
        scene: {
          preload: function () {},
          create: function () {
            const scoreText = this.add.text(16, 16, 'score: 0', {
              fontSize: '32px',
              color: '#fff',
              fontFamily: "'Press Start 2P'",
            });
          },
        },
      });
    })();
  }, []);

  return <></>;
}
