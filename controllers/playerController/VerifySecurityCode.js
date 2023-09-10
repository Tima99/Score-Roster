const Team = require("../../models/Team")
const { isEquals } = require('mongoose')

module.exports = async function (req, res){
    const { teamId, code } = req.body
    const player = req._player

    const isAlreadyVerified = Array.isArray(player?.opponents) && player.opponents.find(id => isEquals(teamId, id))
    if(isAlreadyVerified) return res.json({ message: "Already Verified"})

    const team = await Team.findById(teamId)
    if(!team) return res.sendStatus(404)

    if(team.securityCode !== code) return res.status(422).json({ message: "Security code not correct"})

    await player.opponents.push(teamId)        
    await player.save()


    res.json({ message: "Team Verified" })
}