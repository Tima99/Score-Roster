const Team    = require("../../models/Team")
const Player  = require("../../models/Player")

module.exports = async function (req, res){
    const team = req._team


    if(team.matches.length > 0) return res.status(400).json({message: "Not able to delete."})

    const deletedTeam = await Team.findByIdAndDelete(team._id)

    const playersOid = deletedTeam.players.map(({_id}) => _id)

    // once team deleted , remove from players teams array and not include in pastTeams as teams deleted
    const playerUpdated = await Player.updateMany({_id: {$in: playersOid}}, {$pull: {teams: team._id}})
    
    res.json({ message: "Team deleted success" })
}