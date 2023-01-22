import Head from 'next/head';
import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    (async () => {
      const Phaser = await import(`phaser`);
      const { MainScene } = await import('../Scenes/MainScene');
      const { GameScene } = await import('../Scenes/GameScene');
      const { GameOver } = await import('../Scenes/GameOverScene');

      new Phaser.Game({
        type: Phaser.AUTO,
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

  return (
    <Head>
      <title>Pixel Leap Cube</title>
    </Head>
  );
};
