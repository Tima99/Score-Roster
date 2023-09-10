const routes = require("express").Router()
const {
    FetchTeam,
    FetchMatches
} = require("../controllers/teamController")


// * not protected routes
// Fetch a specific Team by ID
routes.get('/teams/:teamId', FetchTeam.Players)

// Fetch a specific Team's Stats by ID
routes.get('/teams/:teamId/stats', FetchTeam.Stats)

// fetch team matches by pagination
routes.get('/teams/:teamId/matches', FetchMatches)

module.exports = routes