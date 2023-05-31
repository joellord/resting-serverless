import { db } from "@architect/shared/db.mjs";
const mongodb = await db();

export async function handler (req) {
  const cats = await mongodb.collection("cats").find().limit(10).toArray();
  const body = cats;

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json; charset=utf8'
    },
    body: JSON.stringify(body)
  }
}