
module.exports = {
    isEmailVerified: require("./EmailStatus"),
    AuthenticateUser: require("./AuthenticateUser"),
    ResendOtp: require("./ResendOtp"),
    ResetPassword: require("./ResetPassword"),
    ...require("./OtpVerification"),
    RefreshToken: require('./RefreshToken'),
    LogoutController: require('./LogoutController'),
    GetUser: require('./GetUser')
};
