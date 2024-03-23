import { MongoClient } from 'mongodb';
let client: MongoClient;
let clientPromisse: Promise<MongoClient>;
client = new MongoClient(process.env.DATABASEURI);
clientPromisse = client.connect();
export default clientPromisse;




