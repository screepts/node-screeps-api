import { describe, it, assert } from "vitest"
import { ScreepsAPI } from "../"
import auth from "./credentials"

describe("api.raw", function () {
  describe(".version()", function () {
    it("should call /api/version endpoint and return version information", async function () {
      let opts = Object.assign({}, auth)
      delete opts.username
      delete opts.password
      let api = new ScreepsAPI(opts)
      let res = await api.raw.version()
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      assert("protocol" in res, "response has no protocol field")
      assert(
        "serverData.historyChunkSize" in res,
        "response has no serverData.historyChunkSize field",
      )
      if (api.opts.hostname === "screeps.com") {
        assert("package" in res, "response has no package field")
        assert("serverData.shards" in res, "response has no serverData.shards field")
      }
    })
  })

  describe(".authmod()", function () {
    it("should return server name from /authmod for private servers with authmod", async function () {
      let opts = Object.assign({}, auth)
      delete opts.username
      delete opts.password
      let api = new ScreepsAPI(opts)
      let res = await api.raw.authmod()
      if (api.opts.hostname === "screeps.com") {
        assert.equal(res.name, "official", "invalid name for official server")
      } else {
        assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
        assert("name" in res, "server response should have a name field")
        assert("version" in res, "server response should have a version field")
      }
    })
  })

  // This API is not implemented for private servers
  describe.skip(".history(room, tick)", function () {
    it("should return room history as a json file", async function () {
      let opts = Object.assign({}, auth)
      delete opts.username
      delete opts.password
      let api = new ScreepsAPI(opts)
      // Get current tick (as history is not kept forever)
      let res = await api.raw.game.time("shard1")
      let time = res.time - 1000 // history is not available right away
      // Make sure that time is not a multiple of 20 or 100
      time = time % 20 === 0 ? time - 10 : time
      // Try to get history for W1N1
      let json = await api.raw.history("W1N1", time, "shard1")
      // Verify results
      assert("ticks" in json, "result has no ticks field")
      assert(
        Object.keys(json.ticks).length >= 20,
        "results are incomplete ; official server usually returns 100 ticks and private servers should return at least 20 ticks",
      )
      assert.equal(json.room, "W1N1", "result room is incorrect")
      assert("timestamp" in json, "result has no timestamp field")
      assert("base" in json, "result has no base field")
    })
  })
})
