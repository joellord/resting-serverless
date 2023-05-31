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