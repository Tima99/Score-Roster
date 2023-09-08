const mongoose = require('mongoose')
const Team = require("../../models/Team")

async function UpdateTeamDetails(req, res){
    const { teamId } = req.params;
    const { name, location } = req.body;

    if (!mongoose.isValidObjectId(teamId)) return res.sendStatus(422);

    const team = await Team.updateOne(
        { _id: new mongoose.Types.ObjectId(teamId) },
        { $set: {name, location} }
    );

    if(!team.matchedCount)  return res.status(404).json({ message: "Team not found"})
    if(!team.modifiedCount) return res.status(404).json({ message: "Team details not modified. Try Again."})

    res.json({ message: "Team details updated", team });
}

module.exports = UpdateTeamDetails