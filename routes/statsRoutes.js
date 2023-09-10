const routes = require('express').Router()
const { FetchStats } = require("../controllers/statsController")

// fetch stats of specific player or team or any stats by id
routes.get("/stats/:statsId", FetchStats)

module.exports = routes