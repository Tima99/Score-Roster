const routes  = require('express').Router()
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload  = multer({ storage })
const {
    VerifySecurityCode
} = require("../../../controllers/playerController")
const {
    CreateTeam
} = require("../../../controllers/teamController")
const {
    CreateMatch
} = require("../../../controllers/matchController")

const { GetUser } = require("../../../controllers/entryController")

// ^Users routes
routes.get('/user', GetUser)

// ^Players routes
// verify team security code 
routes.post('/verify/security', VerifySecurityCode)

// ^ Team Routes
// create new Team, assuming file type name is 'logo'
routes.post('/team', upload.single('logo'),  CreateTeam)

// ^ Match Routes
routes.post('/match', CreateMatch)

module.exports = routes