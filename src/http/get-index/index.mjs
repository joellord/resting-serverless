// learn more about HTTP functions here: https://arc.codes/http
export async function handler (req) {
  const body = {
    message: "Server healthy",
    server: "OK",
    timestamp: Date.now()
  }

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json; charset=utf8'
    },
    body: JSON.stringify(body)
  }
}