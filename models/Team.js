const mongoose = require('mongoose')
const { Types: { ObjectId }, isValidObjectId , isEquals} = mongoose
const Stat = require('./Stat')

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

// structure array of players's id in team.players schema if valid and not already exists
/**
 * ['player1_id', 'player2_id'] ==> [{_id: Oid, stats: db.stats}, {_id: Oid, stats: db.stats}] 
 * Note: (if player1 and player2 are valid)
 */

teamSchema.methods.transformPlayersId = async function(playersIdArr){
    if(!Array.isArray(playersIdArr)) return Promise.reject("Args must be array of players's id")

    // valid player is one which join team successfully or
    //  having valid oid and have object equals to team.players schema
    const validPlayers = []
    // invalid players are those who is already in team or given id is not correct
    const invalidPlayers = []

    for(let i = 0; i < playersIdArr.length; i++){
        const id = playersIdArr[i]

        if(!isValidObjectId(id)){
            invalidPlayers.push({status: "Invalid player id", id}); 
            continue;
        }
        const oid = new ObjectId(id)

        const isAlreadyInTeam = this.players.find(({_id}) => isEquals(oid, _id))
        // oid already exists in team.players array
        if(isAlreadyInTeam) { 
            invalidPlayers.push({ status: "Player already joined team", id });
            continue;
        }

        const stats = await Stat.create({})
        // valid player object
        validPlayers.push({
            _id: oid,
            stats
        })
    }

    // valid players join team
    this.players.push(...validPlayers)
    await this.save()
    
    const playersOid = validPlayers.map(({_id}) => _id)
    
    return {validPlayers, invalidPlayers, playersOid }
}

const Team = mongoose.model('Team', teamSchema)

module.exports = Team
