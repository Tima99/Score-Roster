const routes  = require('express').Router()
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload  = multer({ storage })
const {
    UpdateTeamLogo,
    UpdateTeamDetails,
    DeleteTeam,
    ChangeAuth
} = require("../../../controllers/teamController")

// only admin of team can modify team

// change auth (admin or captain) of team
routes.put('/teams/:teamId/auth', ChangeAuth)

// Update a specific Team logo
routes.put('/teams/:teamId/logo', upload.single('logo'), UpdateTeamLogo)

// Update a specific Team details
routes.put('/teams/:teamId/details', UpdateTeamDetails)

// Delete Team if they played no matches
routes.delete("/teams/:teamId", DeleteTeam)

module.exports = routes