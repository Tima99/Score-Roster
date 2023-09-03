const routes = require("express").Router();
const {
    isEmailVerified,
    OtpVerified,
    EmailVerified,
    ResetPasswordVerified,
    AuthenticateUser,
    ResendOtp,
    ResetPassword
} = require("../controllers/entryController");

// Check email exists or verified , send otp if not verified and return false otherwise return true
routes.get("/:email/status", isEmailVerified);

// Retrieve the OTP and validate its authenticity against the database
routes.post("/otp/status", OtpVerified, EmailVerified);

// password matched or created generate access_token with help of jwt
routes.post("/auth/user", AuthenticateUser);

// otp verification for reset password
routes.post("/reset/otp/status", OtpVerified, ResetPasswordVerified);

// reset password if email verified within otp expiry time
routes.post("/reset/password", ResetPassword);

// request for resend / send otp 
routes.get("/resend/otp/:email", ResendOtp);

module.exports = routes;
