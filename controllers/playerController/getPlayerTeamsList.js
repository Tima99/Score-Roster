const Player = require('../../models/Player')

async function getPlayerTeamsList(req, res){
    const { playerId } = req.params

    const player = await Player.findById(playerId).populate({
        path: 'teams',
        select: 'name logo location admin captain'
    })

    res.json({ teams: player.teams })
}

module.exports = getPlayerTeamsList