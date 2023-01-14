import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

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
        <title>Placar</title>
      </Head>
      <center>
        <h1>Placar</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {data.map((e, i) => (
            <div
              key={e.name}
              style={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <div
                style={{
                  borderRadius: 8,
                  width: 24,
                  height: 24,
                  border: '1px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i}
              </div>

              <div>{e.name}</div>

              <div>{e.score}</div>
            </div>
          ))}
        </div>
      </center>
    </div>
  );
};
