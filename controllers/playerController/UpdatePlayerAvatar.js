const mongoose        = require("mongoose")
const Player          = require("../../models/Player")
const uploadFile      = require("../../utils/uploadFile");
const validateAvatar  = require("../../utils/validateAvatar");
const deleteFile      = require("../../utils/deleteFile");

async function UpdatePlayerAvatar(req, res){
    const { playerId } = req.params
    const file = req.file
    const hasAvatarValid = validateAvatar(file);

    if(!mongoose.isValidObjectId(playerId) || !hasAvatarValid) return res.sendStatus(400)
    
    const player = await Player.findOne({ _id : new mongoose.Types.ObjectId(playerId) })

    if(!player) return res.status(404).json({ message: "Player not found"})

    // delete previous one
    if(player.avatar){
        const fileName = player.avatar.split('/')?.pop()
        await deleteFile(fileName)
    }
    
    // update using uploadFile(file) store avatar to aws s3 and returns stored file url
    const fileUrl = await uploadFile(file);

    player.avatar = fileUrl

    await player.save()

    res.json({ message: "Player avatar updated", avatar: fileUrl })
}

module.exports = UpdatePlayerAvatar