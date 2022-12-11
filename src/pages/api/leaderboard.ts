import { NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
let cluster: MongoClient = null;

const connectToDataBase = async () => {
  try {
    cluster = await MongoClient.connect(process.env.DATABASEURI!);
    cluster.on('close', () => {
      console.log('connection closed');
      cluster = null;
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getLeaderBoard = async () => {
  if (!cluster) {
    await connectToDataBase();
  }
  const db = cluster.db('jump-game');
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
