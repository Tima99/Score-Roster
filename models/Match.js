const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types.Schema;

const playerSchema = new mongoose.Schema({
    _id: { type: ObjectId, ref: "Player" },
    name: String,
    avatar: String,
    stats: { type: ObjectId, ref: "Stat" },
});

const scoringSchema = new mongoose.Schema({
    raider: { type: ObjectId, ref: "Player" },
    // time (in sec) of raid e.g, 10 meant raid completed in 10seconds
    tDuration: Number,
    out: {
        // defenders who out raider
        raider: {
            by: { type: ObjectId, ref: "Player" },
            assits: { type: ObjectId, ref: "Player" },
        },
        // defenders which out by raiders
        defenders: [{ type: ObjectId, ref: "Player" }],
        // defenders which self out
        selfOutDefenders: [{ type: ObjectId, ref: "Player" }]
    },
    tPts: Number, // number of points given in this raid
    // oid teamA or teamB - tPts goes to team who win play (raider or defenders) 
    scoreReceiver: { type: ObjectId, ref: "Team" },
    // different types of points score or count in this play
    pts: {
        bonusPt: Boolean, // taken bonus point or not by raider  
        touchCount: Number, // how many defender raider touch
        selfOut: Number // no. of defenders which self out  
    },
    isDoDie: Boolean, // is this raid is Do or Die if no points get by raider he out if isDoDie true
    superTackle: Boolean, // superTackle on on this raid or not
    isSelfOut: Boolean // is raider self out or not
})

const matchSchema = new mongoose.Schema(
    {
        teamA: { type: ObjectId, ref: "Team" },
        teamB: { type: ObjectId, ref: "Team" },
        squadA: [{player: playerSchema, stats: {type: ObjectId, ref: 'Stat'}}],
        squadB: [{player: playerSchema, stats: {type: ObjectId, ref: 'Stat'}}],
        scorer: {type: ObjectId, ref: 'Player'},
        toss: { 
            won: {type: ObjectId, ref: 'Team'}, 
            select: {type: String, enum : ['raid', 'defend']}  
        },
        // total match duration (time in seconds)
        tDuration: Number,
        remainDuration: Number,
        // time in seconds
        perRaidDuration: Number,
        breaksCount: Number,
        // indexes of array represents count of raid
        // for example: 0 index means 1 raid of raider
        scoring: [scoringSchema]
    },
    { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema, "matches");

module.exports = Match;
