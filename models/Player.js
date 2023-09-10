const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema({

    // Player's email address (used for communication) , this address may be or not available in user db 
    // whereas every user's address might be player address
    email: { type: String, required: true, unique: true, lowercase: true  },
    
    name: { type: String, required: true },

    // path of player's profile picture
    avatar: { type: String },

    dob: { type: Date },
    location: String,
    role: {type: String, enum: ['raider', 'defender', 'all-rounder'], lowercase: true },
    gender: {type: String, enum: ['male', 'female', 'other'] , lowercase: true },

    teams: [ { type: mongoose.Schema.Types.ObjectId , ref: 'Team'} ],

    // if player remove or exit from team it will go to pastTeams array from teams arrays
    pastTeams: [ { type: mongoose.Schema.Types.ObjectId , ref: 'Team', select: 0} ],

    matches: [ { type: mongoose.Schema.Types.ObjectId , ref: 'Match'} ],
    
    stats: { type: mongoose.Schema.Types.ObjectId , ref: 'Stat'},
}, {timestamps: true})

// add team to player's teams array
playerSchema.methods.newTeam = async function (teamId){
    try{
        this.teams.push(teamId)
        await this.save()
        return true
    }catch(err){
        return Promise.reject(err)
    }
}

const Player = mongoose.model('Player', playerSchema)

module.exports = Player