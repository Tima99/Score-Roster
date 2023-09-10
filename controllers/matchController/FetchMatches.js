/**
 * Fetch matches of particular player or team via Id
 * 
 */
const Match = require('../../models/Match')

module.exports = async function (req, res){
    const { id } = req.params
    const { page , size, location } = req.query

    const skipCount = (page - 1) * size

    const matches = await Match.find({}).skip(skipCount).limit(size)

    res.json({matches})
}