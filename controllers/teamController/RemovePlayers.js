const Player = require("../../models/Player");

module.exports = async function (req, res) {
    // players is an array of ids for those players which going to remove from team
    const { players } = req.body;
    const team = req._team;

    if (players.length <= 0)
        return res.status(422).json({ message: "Please provide players." });

    /**
     * result have error or (updated team and array of players's objectid)
     * 1) in case error occurs it is instanceof Error
     * 2) updated team are one after removing given players or admin or captain
     */
    const result = await team.removePlayers(players);
    if (result instanceof Error) {
        /// console.log(result)
        return res.status(400).json({ message: result.message });
    }

    const removed = await Player.updateMany(
        { _id: { $in: result.playersOid } },
        {
            $pull: { teams: team._id },
            $push: { pastTeams: team._id },
        }
    );

    res.json({ team: result.team , removed });
};
