/**
 * Required External Modules and Interfaces
 */

const express = require("express")
const { getPublicMessage, getProtectedMessage } = require("./messages.service")
const { checkJwt } = require("../authz/check-jwt")

/**
 * Router Definition
 */

const messagesRouter = express.Router()

/**
 * Controller Definitions
 */

// GET messages/

messagesRouter.post("/public", async (req, res) => {
  res.status(200).send(await getPublicMessage(req))
})

messagesRouter.post("/auth", checkJwt, async (req, res) => {
  res.status(200).send(await getProtectedMessage(req))
})

module.exports = {
  messagesRouter,
}
