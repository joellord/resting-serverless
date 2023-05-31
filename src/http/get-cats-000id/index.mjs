import { db } from "@architect/shared/db.mjs";
const mongodb = await db();

export async function handler (req) {
  const params = req.pathParameters;
  const cat = await mongodb.collection("cats").findOne({ _id: parseInt(params.id) });

  if (!params || !params.id || !cat) {
    return {
      statusCode: 404,
      body: "No cat found"
    }
  }

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json; charset=utf8'
    },
    body: JSON.stringify(cat)
  }
}