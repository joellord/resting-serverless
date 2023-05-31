# Resting on the shoulders of serverless

## Pre
Configure AWS CLI with a valid session token
https://d-9a67057a9a.awsapps.com/start/#/
rm ~/.aws/credentials
nano ~/.aws/credentials
Replace with new credentials

## Code Walkthrough

Create a Lambda function in AWS
Can't add package. Create local file, run npm install emoji-kissing-cat, zip files, upload zip.
```
zip -r  lambda.zip ./*
```
Expose URL

Create an architect app
```
npm init @architect resting
```

Code explore
`package.json`
`app.arc`
`src/http/get-index`

Start the app
```
cd resting
npx arc sandbox
```

Open browser [http://localhost:3333](http://localhost:3333)

What's an FWA?

Edit `src/http/get-index`
```
export async function handler (req) {
  const body = {
    message: "Server healthy",
    timestamp: Date.now()
  }

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body
  }
}
```

Change body to return JSON

Kinda lame, let's create a real API
Create file `src/http/get-cats/index.mjs`
Note about `.mjs`
Copy from `get-index/index.mjs`
Add cats collection, and return the cats
Go to http://localhost:3333/cats
Error message!

In app.arc
```
get /cats
```

Deploy to AWS
```
npx arc deploy
```

Visit $URL
Visit $URL/cats

Change `get-index/index.mjs`
`import emoji from "emoji-kissing-cat";`
return the emoji
run `npm install emoji-kissing-cat`

Redeploy
```
npx arc deploy
```

Add new route for cats/:id
In app.arc
```
get /cats/:id
```
Create file `get-cats-000id\index.mjs`
```
const cats = [
  {_id: 1, name: "Fluffy"},
  {_id: 2, name: "Mittens"},
  {_id: 3, name: "Garfield"}
]
export async function handler (req) {
  const params = req.pathParameters;
  const cat = cats.find(cat => cat.name === parseInt(params.id));

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: JSON.stringify(cat)
  }
}
```

No good, we need a common database
In `app.arc`, add `@shared`
Create file `shared/db.mjs`
```
const cats = [
  {_id: 1, name: "Fluffy"},
  {_id: 2, name: "Mittens"},
  {_id: 3, name: "Garfield"}
];

export {
  cats
}
```

Create Atlas Serverless
Change shared file to use DB
```
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
```

Change cats/ to use database
```
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
```

Change cats/:id to use database
```
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
```

Env Variables
Create local env vars
```
npx arc env -e testing --add CONN_STRING "<CONNSTRING>"
```

Create on server too
```
npx arc env -e staging --add CONN_STRING "<CONNSTRING>"
```


Add post route
In `app.arc`
```
post /cats
```
Create `post-cats/index.mjs`
```
import { db } from "@architect/shared/db.mjs";

const mongodb = await db();

export async function handler (req) {
  const newCat = JSON.parse(req.body);
  const result = await mongodb.collection("cats").insertOne(newCat);
  return result;
}
```

Test with curl
```
curl -X POST --data '{"name": "Cassiopee"}' --header "Content-Type: application/json" localhost:3333/cats
```

Add tests
Create a file `tests/api-test.js`
```
const test = require("tape")
const tiny = require("tiny-json-http")
const sandbox = require("@architect/sandbox")

const testUrl = "http://localhost:3334"

/**
 * first we need to start the local http server
 */
test("sandbox.start", async t=> {
  t.plan(1)
  await sandbox.start({ quiet: true, port: 3334 })
  t.ok(true, `sandbox started on ${testUrl}`)
})

/**
 * then we can make a request to it and check the result
 */
test("get /", async t=> {
  t.plan(1)
  let result = await tiny.get({ url: testUrl })
  t.ok(result, "got 200 response")
})

test("get /cats", async t=> {
  t.plan(2)
  let result = await tiny.get({
    url: `${testUrl}/cats`
  })
  t.ok(result.body, "got 200 response")
  console.log(JSON.stringify(result.body, null, 2))
  t.ok(result.body.length === 2, "got 2 cats");
})

test("get /cats/:catID", async t=> {
  t.plan(2)
  let url = `${testUrl}/cats/1`
  let result = await tiny.get({ url })
  t.ok(result.body, "got 200 response")
  t.ok(result.body.name === "Fluffy", "got Fluffy");
})

/**
 * finally close the server so we cleanly exit the test
 */
test("sandbox.end", async t=> {
  t.plan(1)
  await sandbox.end()
  t.ok(true, "sandbox ended")
})
```

In package.json, add
```
    "test": "tape tests/*-test.js | tap-arc"
```
Install deps
```
npm install --dev tap-arc tape tiny-json-http
```

## Clean up
Delete Lambda functions
Delete Applications (CloudFormation)
Atlas delete endpoint
Atlas delete function
Atlat delete data