import { db, ObjectId } from "@architect/shared/db.mjs";
const mongodb = await db();

export async function handler (req) {
  const params = req.pathParameters;
  const cat = await mongodb.collection("cats").findOne({_id: new ObjectId(params.id)});

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: JSON.stringify(cat)
  }
}