const Team = require("../../models/Team")
const Match = require("../../models/Match")

async function FetchMatchesList(req, res){
    const [ page, size ] = [+req.query.page, +req.query.size]
    const { teamId } = req.params

    const team = await Team.findById(teamId, {matches: 1});
    if(!team) return res.sendStatus(404)

    const totalMatches = team.matches?.length || 0 

    const skip = (page - 1) * size
    const diff = totalMatches - (page * size)

    const start = diff >= 0 ? page * size : totalMatches - skip > 0 ? totalMatches : "Page not found"
    if(typeof start === "string" ) return res.status(422).json({ complete: true })


    const matchesOid = team.matches.slice(-start, skip === 0 ? undefined : -skip)

    const matches = await Match.find({ _id : { $in : matchesOid }}).populate({
        path: 'teamA._id teamB._id',
        select: 'name logo players',
    })

    res.json({ matches , complete: false, page, size, totalCount: matches.length })
}

module.exports = FetchMatchesList