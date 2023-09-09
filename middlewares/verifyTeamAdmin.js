const mongoose = require('mongoose')
const Team = require("../models/Team")
const Player = require("../models/Player")

async function verifyTeamAdmin(req, res, next) {
    try {
        const teamId = mongoose.ExtractId(req.url)
        if(!teamId) return res.sendStatus(422)
        
        const team = await Team.findById(teamId)
        if(!team) return res.sendStatus(404)
        
        if(!mongoose.isEquals(team.admin, req._player?._id)) return res.status(401).json({ message: "Permission not allowed."})

        req._team   = team
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = verifyTeamAdmin;
