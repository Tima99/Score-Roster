const routes = require('express').Router();
const regiLoginController = require("../controllers/entryController")

routes.post('/entry', regiLoginController)


module.exports = routes
