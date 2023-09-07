const mongoose  = require("mongoose")
const Player    = require("../../models/Player")

async function FetchPlayer(req, res){
    const { playerId } = req.params

    if(!mongoose.isValidObjectId(playerId)) return res.sendStatus(400)
    
    const player = await Player.findOne({ _id : new mongoose.Types.ObjectId(playerId) })

    if(!player) return res.status(404).json({ message: "Player not found"})

    res.json({ player })
}

module.exports = FetchPlayer