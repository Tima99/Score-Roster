const mongoose = require('mongoose')
const Team = require("../models/Team")
const Player = require("../models/Player")

async function verifyTeamAdmin(req, res, next) {
    try {
        // Use a regular expression to capture the alpha-numeric string
        const reqArr = req.url.split('/');

        const teamId = reqArr.find( item => mongoose.isValidObjectId(item))

        if(!teamId) return res.sendStatus(422)
        
        const team = await Team.findById(teamId)
        if(!team) return res.sendStatus(404)
        
        const player = await Player.findOne({ email: req._user.email })
        
        if(team.admin.toString() !== player._id.toString()) return res.status(401).json({ message: "Not allowed for operation."})

        req._team   = team
        req._player = player
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = verifyTeamAdmin;
