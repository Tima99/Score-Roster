module.exports = async function (req, res){
    const team = req._team

    const result = await team.save()

    res.json({ code: result.securityCode })
}