const { AVATAR_FORMATS } = require("../constants")

function validateAvatar(file){
    return AVATAR_FORMATS.includes(file.mimetype)
}

module.exports = validateAvatar