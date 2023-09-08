const mongoose = require('mongoose')

// t prefix pronounce as 'total'
const playerStatSchema = {
    tRaids: Number,
    tTackles: Number,
    outCount: { raid: Number, tackle: Number },
    assists: Number,
    matTime: Date
}

const teamStatSchema = {
    won: Number,
    wonToss: Number,
    allOutCount: Number,
}

const statSchema = new mongoose.Schema({
    matches: { type: Number, default: 0},
    raidPts: Number,
    tacklePts: Number,
    bonusPts: Number,
    superTackle: Number,
    super10: Number,
    super5: Number,
    ...teamStatSchema,
    ...playerStatSchema,
}, {timestamps: true})

const Stat = mongoose.model('Stat', statSchema, 'stats')

module.exports = Stat