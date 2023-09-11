const Team    = require("../../models/Team")
const Player  = require("../../models/Player")
const Stat    = require("../../models/Stat")

module.exports = async function (req, res){
    const team = req._team


    if(team.matches.length > 0) return res.status(400).json({message: "Not able to delete."})

    const deletedTeam = await Team.findByIdAndDelete(team._id)

    const playersOid = deletedTeam.players.map(({_id}) => _id)
    const statsOid   = deletedTeam.players.map(({stats}) => stats) // player's stats array
    statsOid.push(deletedTeam.stats) // push team stats

    // once team deleted , remove from players teams array and not include in pastTeams as teams deleted
    await Player.updateMany({_id: {$in: playersOid}}, {$pull: {teams: team._id}})
    await Stat.deleteMany({_id: {$in: statsOid}})
    
    res.json({ message: "Team deleted success" })
}