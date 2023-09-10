const routes = require("express").Router()
const {
    FetchTeam,
} = require("../controllers/teamController")


// * not protected routes
// Fetch a specific Team by ID
routes.get('/teams/:teamId', FetchTeam.Players)

// Fetch a specific Team's Stats by ID
routes.get('/teams/:teamId/stats', FetchTeam.Stats)

module.exports = routes