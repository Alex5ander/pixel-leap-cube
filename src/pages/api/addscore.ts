import { NextApiResponse, NextApiRequest } from 'next';
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

const addscore = async (name: string, score: number) => {
  if (!cluster) {
    await connectToDataBase();
  }
  const db = cluster.db('jump-game');
  const collection = db.collection('leaderboard');

  const success = await collection.insertOne({ name, score });
  return success;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { name, score } = request.query;

  if (name && score) {
    if (name.length > 20 || !/^[a-z]*$/i.test(name.toString())) {
      return response.status(404).send('');
    } else if (!/^[0-9]*$/.test(score.toString())) {
      return response.status(404).send('');
    }
    addscore(name.toString().trim(), parseInt(score.toString()));
  }

  response.status(200).send('ok');
}
