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
      {data.length ? (
        <center style={{ padding: 8 }}>
          <h1>Placar</h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: 8,
              border: '1px solid #000',
              borderRadius: 8,
              gap: 16,
            }}
          >
            {data.map((e, i) => (
              <div
                key={e.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  width: '100%',
                  borderBottom: '1px solid #000',
                  padding: '8px 0px',
                }}
              >
                <div
                  style={{
                    borderRadius: '50%',
                    aspectRatio: 1,
                    padding: 8,
                    border: '1px solid #000',
                    display: 'flex',
                    flex: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: i === 0 ? 24 : 16,
                  }}
                >
                  <p style={{ margin: 0 }}>{i + 1}</p>
                </div>

                <div
                  style={{
                    flex: '1 0 0',
                    textAlign: 'left',
                    textOverflow: 'ellipsis',
                    overflow: 'clip',
                  }}
                >
                  {e.name}
                </div>

                <div>{e.score}</div>
              </div>
            ))}
          </div>
        </center>
      ) : (
        <p style={{ textAlign: 'center' }}>Carregando...</p>
      )}
    </div>
  );
};
