const routes = require('express').Router();
const entryController = require("../controllers/entryController")

// Check email exists or verified , send otp if not verified and return false otherwise return true
routes.get('/:email/status', entryController.isEmailVerified)

// Retrieve the OTP and validate its authenticity against the database
routes.post('/otp/status', entryController.otpVerified)

// password matched or created generate access_token with help of jwt
routes.post('/auth/user', entryController.authenticateUser)


module.exports = routes
