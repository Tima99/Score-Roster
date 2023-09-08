const routes = require("express").Router()
const {verifyAccessToken, verifyTeamAdmin} = require("../middlewares")
const {
    CreateTeam,
    FetchTeam,
    UpdateTeamLogo, 
    UpdateTeamDetails, 
} = require("../controllers/teamController")

const multer  = require('multer')
const storage = multer.memoryStorage()
const upload  = multer({ storage })

// * not protected routes
// Fetch a specific Team by ID
routes.get('/teams/:teamId', FetchTeam.Players)

// Fetch a specific Team's Stats by ID
routes.get('/teams/:teamId/stats', FetchTeam.Stats)

// * protected routes - user has been verified before using below routes
// add middleware to protect unauthentic users to uses below routes
routes.use(verifyAccessToken)

// create new Team, assuming file type name is 'logo'
routes.post('/team', upload.single('logo'),  CreateTeam)

// only admin of team can modify team
routes.use(verifyTeamAdmin)

// Update a specific Team logo
routes.put('/teams/:teamId/logo', upload.single('logo'), UpdateTeamLogo)

// Update a specific Team details
routes.put('/teams/:teamId/details', UpdateTeamDetails)

module.exports = routes