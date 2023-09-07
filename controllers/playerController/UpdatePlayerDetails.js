const mongoose = require("mongoose");
const Player = require("../../models/Player");

async function UpdatePlayerDetails(req, res) {
    const { playerId } = req.params;
    const { name, role, location, dob, gender } = req.body;

    if (!mongoose.isValidObjectId(playerId)) return res.sendStatus(400);

    const player = await Player.updateOne(
        { _id: new mongoose.Types.ObjectId(playerId) },
        { $set: {name, role, location, dob, gender} }
    );

    if(!player.matchedCount)  return res.status(404).json({ message: "Player not found"})
    if(!player.modifiedCount) return res.status(404).json({ message: "Player details not modified. Try Again."})

    res.json({ message: "Player details updated", player });
}

module.exports = UpdatePlayerDetails;
