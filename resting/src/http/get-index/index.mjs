import emoji from "emoji-kissing-cat";

export async function handler (req) {
  const body = {
    message: "Server healthy",
    timestamp: Date.now(),
    emoji
  }

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: JSON.stringify(body)
  }
}