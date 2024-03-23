import { NextApiResponse, NextApiRequest } from 'next';
import clientPromisse from '../../lib/mongodb';

const addscore = async (name: string, score: number) => {
  const client = await clientPromisse;
  const db = client.db('jump-game');
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
    if (name.length > 20 || !/^[a-z ]*$/i.test(name.toString())) {
      return response.status(403).send('name invalid');
    } else if (!/^[0-9]*$/.test(score.toString())) {
      return response.status(403).send('score is not a number');
    }
    addscore(name.toString().trim(), parseInt(score.toString()));
  }

  response.status(200).send('ok');
}
