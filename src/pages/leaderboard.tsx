import { useEffect, useState } from 'react';

export default () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const request = await fetch('/api/leaderboard');
        const json = await request.json();
        setData(json);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  return (
    <div>
      <center>
        <h1>Leaderboard</h1>
        <ul>
          {data.map((e) => (
            <li key={e.name}>
              Nome: {e.name} - Pontuação: {e.score}
            </li>
          ))}
        </ul>
      </center>
    </div>
  );
};
