const routes = require('express').Router()


// fetch matches of specific player
routes.get("/matches/:playerId", (_, res) => res.json({msg: 'working'}))

module.exports = routes