import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

export default () => {
  const mounted = useRef(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const request = await fetch('/api/leaderboard');
        const json = await request.json();
        if (mounted.current) {
          setData(json);
        }
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, []);
  return (
    <div>
      <Head>
        <title>Leaderboard</title>
      </Head>
      {data.length ? (
        <center style={{ padding: 8 }}>
          <h1>Leaderboard</h1>
          <div className={styles.container}>
            {data.map((e, i) => (
              <div className={styles.item} key={i.toString()}>
                <div
                  className={styles.box}
                  style={{ fontSize: i === 0 ? 24 : 16 }}
                >
                  <p style={{ margin: 0 }}>{i + 1}</p>
                </div>

                <div className={styles.name}>{e.name}</div>

                <div>{e.score}</div>
              </div>
            ))}
          </div>
        </center>
      ) : (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      )}
    </div>
  );
};
