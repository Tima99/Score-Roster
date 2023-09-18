const { REFRESH_TOKEN_SECRET } = require("../../config");
const {
    Types: { ObjectId },
} = require("mongoose");

const User = require("../../models/User");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res) {
    const bearerToken = req.headers["authorization" || "Authorization"];
    // remove Bearer[space] or bearer[space]
    const refresh_token = bearerToken?.replace(/^Bearer\s+/i, "");
    if (!refresh_token) return res.sendStatus(403);

    const agent = req.headers["user-agent" || "User-Agent"];
    const origin = req.ip;

    const user = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

    if (!user?.userId) return res.sendStatus(403);

    // check request refresh_token is store in db with _id, origin and agent or not
    // Use $pull to remove a specific object from the refreshTokens array
    const _res = await User.updateOne({ _id: new ObjectId(user.userId) }, {
            $pull: {
                refreshTokens: {
                    token: refresh_token,
                    "device.agent": agent,
                    "device.origin": origin,
                } },
    });

    if(_res.modifiedCount <= 0) return res.sendStatus(400)

    res.json({ message: "Logout Sucess"})
};
