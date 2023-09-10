const Match = require('../../models/Match')

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

    const { teamA, teamB, scorer, scheduleTime } = req.body

    if(!(teamA?._id && teamB?._id)) return res.status(422).json({ message: "Provide both teams for a match"})
    if(teamA._id === teamB._id ) return res.status(422).json({ message: "Teams cannot be same"})
    if(!(teamA.squad || teamB.squad ) || teamA.squad?.length <= 0 || teamB.squad?.length <= 0) 
        return res.status(422).json({ message: "Squad must have minimum 1 player"})

    const userGivenDate = new Date(scheduleTime) 
    // if scheduleTime is false its mean we have to define Date.now() before save
    if(scheduleTime && (userGivenDate == "Invalid Date" || userGivenDate.getTime() < Date.now())) 
        return res.status(422).json({ message: "Invalid Date"})

    const _scorer = scorer ? scorer : req._player._id

    const match = await Match.create({ ...req.body, scorer: _scorer })

    res.json({message: "Match created successfully", match })
};
