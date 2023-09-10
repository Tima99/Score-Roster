
const protectedRoutes = {
    verifiedUsers   : require('./verifiedUsers'),
    adminOrCaptain  : require('./adminOrCaptain'),
    teamAdmin       : require('./teamAdmin'),
}

module.exports = protectedRoutes