/**
 * handle to change admin or captain of the team 
 * only admin can perform this action
 */
const { isEquals } = require('mongoose')

module.exports = async function (req, res){
    const team = req._team
    /**
     * 1) playerId of the player whose taken the new position (admin or captain)
     * 2) role defines for which user take place admin or captain
     * Note: After change team securityCode of team also changes itself 
     */
    const { playerId, role } = req.body

    // only players of team can become captain or admin of team
    const hasPlayer = team.players.find( ({_id}) => isEquals(_id , playerId))    
    if(!hasPlayer) return res.status(404).json({ message: "Invalid player" })

    if(role.toLowerCase() === 'admin'){
        team.admin = playerId
    }else if(role.toLowerCase() === 'captain'){
        team.captain = playerId
    }

    await team.save()
    
    res.json({ message: "Update Successfully" })
}