const User = require("../../models/User");

module.exports = async function (req, res) {
    const userId = req._user;
    const user = await User.findById(userId, {
        password: 0,
        isResetPasswordVerified: 0,
        refreshTokens: 0,
        verificationCode: 0,
        verificationCodeExpires: 0,
    });
    if (!user) return res.sendStatus(404);

    return res.json(user);
};
