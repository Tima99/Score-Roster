const Player = require("../../models/Player");

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
     * ^ updatedTeam
     * team with updated players list 
     */
    const {validPlayers, invalidPlayers, playersOid, updatedTeam }   = await team.addPlayers(players)
    /// console.log(validPlayers, invalidPlayers, playersOid)

    const added = await Player.updateMany(
        { _id: { $in: playersOid } },
        { $push: { teams: [team._id] }, $pull: { pastTeams: team._id }, }
    );

    res.json({ invalidPlayers, team: updatedTeam, added });
};
