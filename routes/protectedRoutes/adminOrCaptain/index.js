const routes  = require('express').Router()
const {
    AddPlayers,
    RemovePlayers,
} = require("../../../controllers/teamController")


// admin or captain have access to add players (array of players) in team or remove from team
routes.post("/players/:teamId"  , AddPlayers)
routes.delete("/players/:teamId", RemovePlayers)

module.exports = routes
