import { describe, it, assert } from "vitest"
import { ScreepsAPI } from "../"
import auth, { objectKeys, opts } from "./credentials"

describe("api.raw.user", function () {
  describe(".badge (badge)", function () {
    it("should send a request to /api/user/badge which sets user badge", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      // Save previous badge
      const { badge: initialBadge } = await api.me()
      // Set new badge
      const newBadge = {
        type: 16,
        color1: "#000000",
        color2: "#000000",
        color3: "#000000",
        param: 100,
        flip: false,
      }
      const res = await api.raw.user.badge(newBadge)
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      // Check that badge was effectively changed
      const { badge } = await api.me()
      for (const key of objectKeys(newBadge)) {
        assert.equal(badge[key], newBadge[key], `badge ${key} is incorrect`)
      }
      // Reset badge
      await api.raw.user.badge(initialBadge)
    })
  })

  describe(".respawn ()", function () {
    it("should do untested things (for now)")
  })

  describe(".branches ()", function () {
    it("should send a request to /api/user/branches and return branches list", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      const res = await api.raw.user.branches()
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      assert(res.list.length > 0, "no branch found")
    })
  })

  describe(".cloneBranch (branch, newName, defaultModules)", function () {
    it("should send a request to /api/user/clone-branch in order to clone @branch into @newName", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      // Create a new branch
      const res = await api.raw.user.cloneBranch("default", "screeps-api-testing", {})
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      // Check if branch was indeed created
      const { list } = await api.raw.user.branches()
      const found = list.some((l) => l.branch == "screeps-api-testing")
      assert(found, "branch was not cloned")
    })
  })

  describe(".setActiveBranch (branch, activeName)", function () {
    it("should send a request to /api/user/set-active-branch in order to define @branch as active", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      // Find current active branch for simulator
      const { list } = await api.raw.user.branches()
      const initialBranch = list.find((l) => l.activeSim)
      assert(initialBranch != null, "cannot find current active branch for simulator")
      // Change active branch for simulator
      const res = await api.raw.user.setActiveBranch("screeps-api-testing", "activeSim")
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      // Check if branch was indeed changed
      const { list: updatedList } = await api.raw.user.branches()
      const found = updatedList.find((l) => l.activeSim)
      assert(found != null, "cannot find current active branch for simulator")
      assert.equal(found.branch, "screeps-api-testing", "branch was not set")
      // Reset branch back to initial state
      await api.raw.user.setActiveBranch(initialBranch.branch, "activeSim")
    })
  })

  describe(".deleteBranch (branch)", function () {
    it("should send a request to /api/user/delete-branch in order to delete @branch", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      // Delete 'screeps-api-testing' branch
      const res = await api.raw.user.deleteBranch("screeps-api-testing")
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      // Check if branch was indeed deleted
      const { list } = await api.raw.user.branches()
      const found = list.find((l) => l.branch == "screeps-api-testing")
      assert(found == null, "branch was not deleted")
    })
  })

  describe(".notifyPrefs (prefs)", function () {
    it("should send a request to /api/user/notify-prefs which sets user preferences", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      const defaults = {
        disabled: false,
        disabledOnMessages: false,
        sendOnline: true,
        interval: 5,
        errorsInterval: 30,
      }
      // Save previous prefs
      const user = await api.me()
      assert("notifyPrefs" in user, "user has no notifyPrefs field")
      const initialPrefs = Object.assign({}, defaults, user.notifyPrefs)
      // Set new preferences
      const newPrefs = {
        disabled: true,
        disabledOnMessages: true,
        sendOnline: false,
        interval: 60,
        errorsInterval: 60,
      }
      const set = await api.raw.user.notifyPrefs(newPrefs)
      assert.equal(set.ok, 1, "incorrect server response: ok should be 1")
      // Check that preferences were indeed changed
      const res = await api.me()
      assert("notifyPrefs" in res, "user has no notifyPrefs field")
      for (const key of objectKeys(newPrefs)) {
        assert.equal(res.notifyPrefs[key], newPrefs[key], `preference ${key} is incorrect`)
      }
      // Reset preferences
      const reset = await api.raw.user.notifyPrefs(initialPrefs)
      assert.equal(reset.ok, 1, "incorrect server response: ok should be 1")
    })
  })

  describe(".tutorialDone ()", function () {
    it("should do untested things (for now)")
  })

  describe(".email (email)", function () {
    it("should do untested things (for now)")
  })

  describe(".worldStartRoom (shard)", function () {
    it("should do untested things (for now)")
  })

  describe(".worldStatus ()", function () {
    it("should do untested things (for now)")
  })

  describe(".code.get (branch)", function () {
    it("should do untested things (for now)")
    it("should send a GET request to /api/user/code and return user code from specified branch.", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      const res = await api.raw.user.code.get("default")
      assert.equal(res.ok, 1, "incorrect server response: ok should be 1")
      assert("modules" in res, "response has no modules field")
      assert("branch" in res, "response has no branch field")
      assert.equal(res.branch, "default", "branch is incorrect")
    })
  })

  describe(".code.set (branch, modules, _hash)", function () {
    it("should do untested things (for now)")
  })

  describe(".respawnProhibitedRooms ()", function () {
    it("should do untested things (for now)")
  })

  describe(".memory.get (path, shard = DEFAULT_SHARD)", function () {
    it("should do untested things (for now)")
  })

  describe(".memory.set (path, value, shard = DEFAULT_SHARD)", function () {
    it("should do untested things (for now)")
  })

  describe(".segment.get (segment, shard = DEFAULT_SHARD)", function () {
    it("should do untested things (for now)")
  })

  describe(".segment.set (segment, data, shard = DEFAULT_SHARD)", function () {
    it("should do untested things (for now)")
  })

  describe(".find (username)", function () {
    it("should do untested things (for now)")
  })

  describe(".findById (id)", function () {
    it("should do untested things (for now)")
  })

  describe(".stats (interval)", function () {
    it("should do untested things (for now)")
  })

  describe(".rooms (id)", function () {
    it("should do untested things (for now)")
  })

  describe(".overview (interval, statName)", function () {
    it("should do untested things (for now)")
  })

  describe(".moneyHistory (page = 0)", function () {
    it("should do untested things (for now)")
  })

  describe(".console (expression, shard = DEFAULT_SHARD)", function () {
    it("should do untested things (for now)")
  })
})
