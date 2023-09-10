const routes  = require('express').Router()
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload  = multer({ storage })
const {
    UpdateTeamLogo,
    UpdateTeamDetails,
    DeleteTeam
} = require("../../../controllers/teamController")

// only admin of team can modify team

// Update a specific Team logo
routes.put('/teams/:teamId/logo', upload.single('logo'), UpdateTeamLogo)

// Update a specific Team details
routes.put('/teams/:teamId/details', UpdateTeamDetails)

// Delete Team if they played no matches
routes.delete("/teams/:teamId", DeleteTeam)

module.exports = routes