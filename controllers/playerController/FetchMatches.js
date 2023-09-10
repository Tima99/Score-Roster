const Player = require("../../models/Player")
const Match = require("../../models/Match")

async function getPlayerMatchesList(req, res){
    const [ page, size ] = [+req.query.page, +req.query.size]
    const { playerId } = req.params

    const player = await Player.findById(playerId, {matches: 1});
    if(!player) return res.sendStatus(404)

    const totalMatches = player.matches?.length || 0 

    const skip = (page - 1) * size
    const diff = totalMatches - (page * size)
    console.log({ diff, page, size, totalMatches, skip})
    const start = diff >= 0 ? page * size : totalMatches - skip > 0 ? totalMatches : "Page not found"
    if(typeof start === "string" ) return res.status(422).json({ complete: true })


    const matchesOid = player.matches.slice(-start, skip === 0 ? undefined : -skip)

    const matches = await Match.find({ _id : { $in : matchesOid }}).populate({
        path: 'teamA._id teamB._id',
        select: 'name logo players',

    })

    res.json({ matches , complete: false, page, size, totalCount: matches.length })
    
}

module.exports = getPlayerMatchesList