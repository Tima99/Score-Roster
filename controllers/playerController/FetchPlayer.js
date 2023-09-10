const mongoose  = require("mongoose")
const Player    = require("../../models/Player")

async function FetchPlayer(req, res){
    const { playerId } = req.params

    if(!mongoose.isValidObjectId(playerId)) return res.sendStatus(400)
    
    const player = await Player.findOne({ _id : new mongoose.Types.ObjectId(playerId) }, { teams: 0, matches: 0, dob: 0, location: 0, email: 0 }).populate("stats")

    if(!player) return res.status(404).json({ message: "Player not found"})

    res.json({ player })
}

module.exports = FetchPlayer