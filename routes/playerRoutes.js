const routes = require("express").Router()
const {
    CreatePlayer,
    FetchPlayer,
    getPlayerMatchesList,
    getPlayerTeamsList
} = require("../controllers/playerController")

// Create a player
routes.post('/player', CreatePlayer)

// Fetch a specific player by ID
routes.get('/players/:playerId', FetchPlayer)

// Get matches list for a specific player
routes.get('/players/:playerId/matches', getPlayerMatchesList)

// Get matches list for a specific player
routes.get('/players/:playerId/teams', getPlayerTeamsList)

module.exports = routes