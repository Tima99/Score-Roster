const mongoose = require('mongoose')

const teamPlayerSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
    stats: { type: mongoose.Schema.Types.ObjectId, ref: 'Stat'}
})

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true},
    logo: String,
    location: String,

    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
    players: [teamPlayerSchema],
    matches: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Match'} ],
    stats: { type: mongoose.Schema.Types.ObjectId, ref: 'Stat'}
}, {timestamps: true})

// populate and structure players array return team 
teamSchema.query.populatePlayers = async function(){
    try{
        let team = await this.populate({
            path: "players._id",
            select: "name avatar"
        })

        const structurePlayers = team.players.map( player => {
            return {...player._id.toObject(), stats: player.stats}
        })
        
        team = team.toObject()
        team.players = structurePlayers
        
        return team
    }catch(err){
        return Promise.reject(err)
    }
}


const Team = mongoose.model('Team', teamSchema)

module.exports = Team
