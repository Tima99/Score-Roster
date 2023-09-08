const mongoose = require('mongoose')
const Team = require("../../models/Team")
const validateAvatar = require("../../utils/validateAvatar")
const deleteFile = require("../../utils/deleteFile")
const uploadFile = require("../../utils/uploadFile")

async function UpdateTeamLogo(req, res){
    const logo = req.file
    const isValidLogo = validateAvatar(logo)
    
    const {teamId} = req.params
    if(!mongoose.isValidObjectId(teamId) ||!isValidLogo) return res.sendStatus(422)

    const team = req._team

    if(!team) return res.sendStatus(404)

    if(team.logo){
        const fileKey = team.logo.split('/').pop()
        await deleteFile(fileKey)
    }

    const fileUrl = logo && await uploadFile(logo)

    team.logo = fileUrl

    await team.save()
    
    res.json({ message: "Team Logo Updated", logo: fileUrl })
}

module.exports = UpdateTeamLogo