import { MongoClient, ObjectId } from "mongodb";

const CONN_STRING = "mongodb+srv://serverless:serverless@serverlessinstance0.svn2cnl.mongodb.net/?retryWrites=true&w=majority";
const db = async () => {
  const client = new MongoClient(CONN_STRING);

  const db = await client.db("pets");
  return db;
}

export {
  db,
  ObjectId
}