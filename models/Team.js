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
    pastPlayers: [teamPlayerSchema], // store players those removed from the team 
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

teamSchema.methods.addPlayers = async function(playersIdArr){
    try{
        if(!Array.isArray(playersIdArr)) return Promise.reject(new Error("Args must be array of players's id"))

        // valid player is one which join team successfully or
        //  having valid oid and have object equals to team.players schema
        // if player already played for this team we get it from pastPlayers array instaed creating new player
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

            // is player already played for this team 
            const pastPlayerIdx = this.pastPlayers.findIndex(({_id}) => isEquals(_id, oid))
            if(pastPlayerIdx !== -1){
                // move past player from pastPlayers to players array
                const pastPly = this.pastPlayers.splice(pastPlayerIdx, 1) // splice returns remove items in array
                validPlayers.push(pastPly[0]) // get past player from index 0
            }else{
                const stats = await Stat.create({})
                // valid player object
                validPlayers.push({
                    _id: oid,
                    stats
                })
            }
        }

        // valid players join team
        this.players.push(...validPlayers)
        await this.save()

        const playersOid = validPlayers.map(({_id}) => _id)

        const { name, logo, location, players, _id, admin, captain} = this

        return {validPlayers, invalidPlayers, playersOid, updatedTeam: { _id, name, logo, location, players, admin, captain}  }
    }catch(err){
        return Promise.reject(err)
    }
}

// remove players from team
teamSchema.methods.removePlayers = async function(playersIdArr){
    try{
        if(!Array.isArray(playersIdArr)) return Promise.reject(new Error("Accept array of id as an args"))

        const removePlayersCount = playersIdArr.length
        /**
         * if **no players left** after removing from team than we **cann't remove** anyone of them otherwise
         * 
         * if player **removed** is *admin* or *captain* than makes them **remove from this position** if they exists also
         * New position assigned::
         * -1) if admin exists in removePlayers we have assign **new admin to team**, here we assign player on 0 index as admin  
         *
         * -2) for captain position its will remain **null**
        */
        if(this.players.length - removePlayersCount <= 0) 
        return new Error("Not able to remove. Atleast one player remains in team.")
    
        this.players = this.players.filter( (player, i) => {
            // isRemove is true indicates - its the player who wants to be removed 
            const isRemove = playersIdArr.includes(player._id.toString())
            // add removing player to team.pastPlayers list
            isRemove && this.pastPlayers.push(player)
            // remove from team
            return !isRemove; 
        })

        // remove admin or captain if match 
        const isRemovePlyAdmin = playersIdArr.includes(this.admin.toString())

        // if match than assign new admin to team (the player on top is new admin now) else remains as it is.
        this.admin    = isRemovePlyAdmin ? this.players[0]._id : this.admin
        // if match than assign null to captain else remains as it is.
        this.captain  = this.captain && playersIdArr.includes(this.captain.toString()) ? null : this.captain

        /// console.log({players: this.players,past: this.pastPlayers,captain: this.captain, admin: this.admin})
        await this.save(); // save db

        const { name, logo, location, players, _id, admin, captain} = this

        return {
            team: { _id, name, logo, location, players, admin, captain},
            playersOid: playersIdArr.map(id => isValidObjectId(id) && new ObjectId(id))
        }; // returns updated players
    }catch(err){
        return Promise.reject(err)
    }
}

const Team = mongoose.model('Team', teamSchema)

module.exports = Team
