import { NextApiResponse } from 'next';
import clientPromisse from '../../lib/mongodb';

const getLeaderBoard = async () => {
  const client = await clientPromisse;
  const db = client.db('jump-game');
  const collection = db.collection('leaderboard');
  const leaderboard = collection.find(
    {},
    { sort: { score: -1 }, limit: 10, projection: { _id: 0 } }
  );
  return leaderboard.toArray();
};

export default async function handler(_, response: NextApiResponse) {
  const leaderboard = await getLeaderBoard();
  response.status(200).json(leaderboard);
}
