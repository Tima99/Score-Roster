const routes = require("express").Router()
const {
    CreatePlayer,
    FetchPlayer,
    getPlayerMatchesList,
    getPlayerTeamsList
} = require("../controllers/playerController")

// Create a player
const multer = require('multer')

const storage = multer.memoryStorage()
const upload  = multer({ storage })

// create new player, assuming file type name is 'avatar'
routes.post('/player', upload.single('avatar'),  CreatePlayer)

// Fetch a specific player by ID
routes.get('/players/:playerId', FetchPlayer)

// Get matches list for a specific player
routes.get('/players/:playerId/matches', getPlayerMatchesList)

// Get matches list for a specific player
routes.get('/players/:playerId/teams', getPlayerTeamsList)

module.exports = routes