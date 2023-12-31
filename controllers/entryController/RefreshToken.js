const { STORE: { REFRESH_TOKEN, ACCESS_TOKEN } }    = require("../../constants");
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = require("../../config");
const { Types: { ObjectId } }                       = require("mongoose");

const User = require("../../models/User");
const jwt  = require("jsonwebtoken");

async function RefreshToken(req, res) {
    const bearerToken = req.headers['authorization' || 'Authorization']
    // remove Bearer[space] or bearer[space] 
    const refresh_token = bearerToken?.replace(/^Bearer\s+/i, '');
    if (!refresh_token) return res.sendStatus(403);
    
    const agent         = req.headers["user-agent" || "User-Agent"]
    const origin        = req.ip


    const user = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

    if (!user?.userId) return res.sendStatus(403);

    // check request refresh_token is store in db with _id, origin and agent or not
    const hasRefreshToken = await User.exists({
        _id: new ObjectId(user.userId),
        refreshTokens: {
            $elemMatch: { token: refresh_token, device: { agent, origin } },
        },
    });

    // if hasRefreshToken is null clear cookie
    if (!hasRefreshToken) {
        return res.sendStatus(401);
    }

    // if db has refresh token generate new access_token and response it
    const access_token = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN.EXPIRES_IN });

    res.json({ access_token });
}

module.exports = RefreshToken;
