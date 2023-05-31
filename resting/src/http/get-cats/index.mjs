import { db } from "@architect/shared/db.mjs";
const mongodb = await db();

export async function handler (req) {
  const body = await mongodb.collection("cats").find({}).toArray();

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: JSON.stringify(body)
  }
}