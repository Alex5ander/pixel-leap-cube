import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const connectToDataBase = async () => {
  try {
    const cluster = await MongoClient.connect(process.env.DATABASEURI!);
    return cluster;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getScore = async () => {
  const cluster = await connectToDataBase();
  const db = await cluster.db('jump-game');
  const collection = db.collection('leaderboard');
  return collection.find().sort('score').limit(10);
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const leaderboard = getScore();
  console.log(leaderboard);
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}
