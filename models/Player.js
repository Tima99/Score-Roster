const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema({

    // Player's email address (used for communication) , this address may be or not available in user db 
    // whereas every user's address might be player address
    email: { type: String, required: true, unique: true },
    
    name: { type: String, required: true },

    // path of player's profile picture
    avatar: { type: String },

    dob: { type: Date },
    location: String,
    role: {type: String, enum: ['raider', 'defender', 'all-rounder']},

    teams: [ { type: mongoose.Schema.Types.ObjectId , ref: 'Team'} ],

    matches: [ { type: mongoose.Schema.Types.ObjectId , ref: 'Matches'} ],
    
    stats: { type: mongoose.Schema.Types.ObjectId , ref: 'Stats'},
}, {timestamps: true})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player