const {
    OtpVerified,
    EmailVerified,
    ResetPasswordVerified,
} = require("./OtpVerification");

module.exports = {
    isEmailVerified: require("./EmailStatus"),
    AuthenticateUser: require("./AuthenticateUser"),
    ResendOtp: require("./ResendOtp"),
    ResetPassword: require("./ResetPassword"),
    OtpVerified,
    EmailVerified,
    ResetPasswordVerified,
    RefreshToken: require('./RefreshToken')
};
