const Player = require("../../models/Player");
const Team = require("../../models/Team");
const Stat = require("../../models/Stat");
const {
    Types: { ObjectId },
    isValidObjectId,
    isEquals
} = require("mongoose");

module.exports = async function (req, res) {
    // players is array of player's Ids, add to the team
    const { players } = req.body;
    const team        = req._team;

    /**
     * ^ Valid Player means 
     *  A player who join team successfully 
     * ^ Invalid Player means
     *  A player not not able to join team
     * ^ playersOid
     *  This contains Oid of all valid players in array e.g, [oid1, oid2, ...]
     * 
     */
    const {validPlayers, invalidPlayers, playersOid }   = await team.transformPlayersId(players)
    /// console.log(validPlayers, invalidPlayers, playersOid)

    const playersJoined = await Player.updateMany(
        { _id: { $in: playersOid } },
        { $push: { teams: [team._id] } }
    );

    res.json({  playersJoined , invalidPlayers });
};
