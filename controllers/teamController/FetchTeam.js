const Team = require("../../models/Team");

const FetchTeam = {
    Players : async function(req, res) {
        const { teamId } = req.params;
    
        const team = await Team.findById(teamId, {matches: 0}).populatePlayers();
    
        res.json({ team });
    },
    Stats: async function(req, res){
        const { teamId } = req.params;
    
        const team = await Team.findById(teamId, { stats: 1 }).populate('stats');
    
        res.json({ team });
    }
}


module.exports = FetchTeam;
