const mongoose = require('mongoose')
const Team = require("../models/Team")
const Player = require("../models/Player")

module.exports = async function (req, res, next){
    try{
        const teamId = mongoose.ExtractId(req.url)
        if(!teamId) return res.sendStatus(422)
        
        const team = await Team.findById(teamId)
        if(!team) return res.sendStatus(404)

        const player = req._player

        if(!(mongoose.isEquals(team.admin, player?._id) || mongoose.isEquals(team.captain, player?._id)))
            return res.status(404).json({ message: "Permission not allowed"})
        
        req._team   = team
        next();

    }catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal Server Error'})
    }
}