import { describe, it, assert } from "vitest"
import { ScreepsAPI } from "../"
import { opts } from "./credentials"

describe("api.raw.leaderboard", function () {
  describe(".list ()", function () {
    it("should call /api/leaderboard/list endpoint and return leaderboard inforamtion", async function () {
      const api = new ScreepsAPI(opts)
      const res = await api.raw.leaderboard.list()
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      assert("list" in res, "server response should have a list field")
      assert("count" in res, "server response should have a count field")
      assert("users" in res, "server response should have a users field")
      if (api.opts.url.includes("screeps.com")) {
        assert(Object.keys(res.list).length > 0, "leaderboard list is empty")
        assert(Object.keys(res.users).length > 0, "leaderboard users is empty")
        assert(res.count > 0, "leaderboard count equals 0 (or maybe is negative)")
      }
    })
    it("should return leaderboard data based on world or power stats", async function () {
      const api = new ScreepsAPI(opts)
      const res1 = await api.raw.leaderboard.list(10, "world")
      const res2 = await api.raw.leaderboard.list(10, "power")
      if (api.opts.url.includes("screeps.com")) {
        assert.notEqual(res1.list[0], res2.list[0], "same player shouldn't be #1")
      }
    })
    it("should return paginated data", async function () {
      const api = new ScreepsAPI(opts)
      const res1 = await api.raw.leaderboard.list(5, "world")
      const res2 = await api.raw.leaderboard.list(10, "world")
      const res3 = await api.raw.leaderboard.list(10, "world", 9)
      if (api.opts.url.includes("screeps.com")) {
        assert.equal(
          Object.keys(res1.list).length,
          5,
          "requested top 5 and got a shorter or longer list",
        )
        assert.equal(
          Object.keys(res2.list).length,
          10,
          "requested top 10 and got a shorter or longer list",
        )
        assert.notEqual(res1.list[0].user, res3.list[0].user, "offset is not working")
        assert.equal(res1.list[0].user, res2.list[0].user, "player #1 is incoherent")
        assert.equal(res2.list[9].user, res3.list[0].user, "player #9 is incoherent")
      }
    })
  })

  describe(".find (username, mode = 'world', season = '')", function () {
    it("should do untested things (for now)")
  })

  describe(".seasons ()", function () {
    it("should do untested things (for now)")
  })
})
