import { describe, it, assert } from "vitest"
import { ScreepsAPI } from "../"
import auth, { opts } from "./credentials"

describe("api.raw.auth", function () {
  describe(".signin (email, password)", function () {
    it("should send a POST request to /api/auth/signin and authenticate", async function () {
      const api = new ScreepsAPI(opts)
      const res = await api.raw.auth.signin(auth.username, auth.password)
      assert("token" in res, "no token found in server answer")
      assert.equal(res.ok, 1, "res.ok is incorrect")
    })
    it("should reject promise if unauthorized", async function () {
      try {
        const api = new ScreepsAPI()
        await api.raw.auth.signin(auth.username, "invalid_password")
      } catch (err: any) {
        assert(err.message.match(/Not authorized/i), "wrong error message")
      }
    })
  })

  describe(".steamTicket (ticket, useNativeAuth = false)", function () {
    it("should do things... but I'm not sure what exactly...")
  })

  describe(".me ()", function () {
    it("should return user informations from `/api/auth/me` endpoint", async function () {
      const api = new ScreepsAPI(opts)
      await api.auth(auth.username, auth.password)
      const res = await api.raw.auth.me()
      assert("email" in res, "response has no email field")
      assert("badge" in res, "response has no badge field")
      assert("username" in res, "response has no username field")
    })
  })
})
