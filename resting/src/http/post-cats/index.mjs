import { db } from "@architect/shared/db.mjs";

export async function handler (req) {
  const mongodb = await db();
  const newCat = JSON.parse(req.body);
  const result = await mongodb.collection("cats").insertOne(newCat);
  return result;
}