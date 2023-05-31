import { MongoClient, ObjectId } from "mongodb";

const db = async () => {
  const MONGODB_CONNECTION_STRING = "mongodb+srv://blog:blog@cluster0.2grje.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(MONGODB_CONNECTION_STRING);

  const db = await client.db("pets");
  return db;
}


export {
  db,
  ObjectId
}