const {
    Types: { ObjectId },
    isValidObjectId,
    isEquals
} = require("mongoose");
const Match = require("../../models/Match");
const Player = require("../../models/Player");
const Team = require("../../models/Team");

module.exports = async function (req, res) {
    // const {
    //     teamA,
    //     teamB,
    //     scorer,
    //     scheduleTime,
    //     toss,
    //     tDuration,
    //     perRaidDuration,
    //     breaks,
    //     groundLocate
    // } = req.body;

    let { teamA, teamB, scorer, scheduleTime } = req.body;
    const player = req._player
    
    // opponent should verified on first match
    const isAlreadyVerified = Array.isArray(player?.opponents) && player.opponents.find(id => isEquals(teamA._id, id) || isEquals(teamB._id, id) )
    if(!isAlreadyVerified) return res.status(400).json({ message: "Please verify opponent first"})


    if (!(teamA?._id && teamB?._id))
        return res
            .status(422)
            .json({ message: "Provide both teams for a match" });
    if (teamA._id === teamB._id)
        return res.status(422).json({ message: "Teams cannot be same" });
    if (
        !(teamA.squad || teamB.squad) ||
        teamA.squad?.length <= 0 ||
        teamB.squad?.length <= 0
    )
        return res
            .status(422)
            .json({ message: "Squad must have minimum 1 player" });

    const userGivenDate = new Date(scheduleTime);
    // if scheduleTime is false its mean we have to define Date.now() before save
    if (
        scheduleTime &&
        (userGivenDate == "Invalid Date" ||
            userGivenDate.getTime() < Date.now())
    )
        return res.status(422).json({ message: "Invalid Date" });

    const _scorer = scorer ? scorer : req._player._id;

    const squadPlayersOid = [...teamA.squad, ...teamB.squad].map(
        ({ _id }) => isValidObjectId(_id) && new ObjectId(_id)
    );

    const match = await Match.create({ ...req.body, scorer: _scorer });
    await Player.updateMany(
        { _id: { $in: squadPlayersOid } },
        { $push: { matches: match._id } }
    );
    await Team.updateMany(
        { _id: { $in: [match.teamA._id, match.teamB._id] } },
        { $push: { matches: match._id } }
    );

    res.json({ message: "Match created successfully", match });
};
