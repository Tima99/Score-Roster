
const protectedRoutes = {
    verifiedUsers   : require('./users'),
    adminOrCaptain  : require('./adminOrCaptain'),
    teamAdmin       : require('./teamAdmin'),
}

module.exports = protectedRoutes