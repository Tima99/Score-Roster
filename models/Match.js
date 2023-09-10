const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const playerSchema = new mongoose.Schema({
    _id: { type: ObjectId, ref: "Player" },
    name: String,
    avatar: String,
    role: { type: String, enum: ['raider', 'defender', 'all-rounder'], lowercase: true},
    // player personal stats
    stats: { type: ObjectId, ref: "Stat" },
    // stats of player for team in which he playing
    teamStats: { type: ObjectId, ref: "Stat" }
});

const teamSchema = new mongoose.Schema({
    // oid of teamA and teamB
    _id: {type: ObjectId, ref: "Team", immutable: true, required: true },
    // selected players of teamA and teamB 
    squad: [playerSchema],
    // captain oid of teamA and teamB
    captain:  {type: ObjectId, ref: 'Player', immutable: true}
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
        teamA: teamSchema,
        teamB: teamSchema,
        // date and time of match 
        scheduleTime: {type: Date, defualt: Date.now(), immutable: true},
        // ground location on which match played
        groundLocate: String,
        // player do scoring
        scorer: {type: ObjectId, ref: 'Player', required: true},
        // toss won by which team and what his captain select
        toss: { 
            won: {type: ObjectId, ref: 'Team'}, 
            select: {type: String, enum : ['raid', 'defend'], lowercase: true}  
        },
        // total match duration (time in seconds) default is 2700 seconds == 45mins
        tDuration: {type: Number, default: 2700},
        remainDuration: Number,
        // time in seconds (default is 30 seconds)
        perRaidDuration: {type: Number, default: 30},
        // number of breaks and time interval foreach breaks between match
        breaks: {
            count: {type: Number, defualt: 0},
            // time in secs e.g, [1800, 900]
            /**
             * if total match duration is 3600secs = 1hrs
             * breaks count is 2 
             * so their time interval for breaks as follows:
             *  1 break after 1800(30mins) from game start 
             * 2 break after 900(15mins) from first interval
             * Note: if their is 0 breaks count , breaks interval array is empty than
             */
            interval: [Number]
        },
        // indexes of array represents count of raid
        // for example: 0 index means 1 raid of raider
        scoring: [scoringSchema],
        // oid of winner team of this match
        winner: {type: ObjectId, ref: 'Team'}
    },
    { timestamps: true }
);

matchSchema.pre("save", async function(){
    try{
        console.log("Saving docs...")
        this.remainDuration = this.tDuration
        // define Date.now() in scheduleTime if its false
        !!this.scheduleTime || (this.scheduleTime = Date.now())
        return this
    }catch(err){
        return Promise.reject(err)
    }
})

const Match = mongoose.model("Match", matchSchema, "matches");

module.exports = Match;
