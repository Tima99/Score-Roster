const Player = require("../../models/Player");
const uploadFile = require("../../utils/uploadFile");
const validateAvatar = require("../../utils/validateAvatar");

async function CreatePlayer(req, res) {
    // gets fields value from req.body after parsed by multer
    const { email, name, dob, location, role } = req.body;

    // file which multer parse and store it in memory we use buffer to saved it in aws s3
    const file = req.file;

    if(await Player.exists({ email })) return res.status(400).json({ message: "Player already exists"})

    const player = new Player({
        email,
        name,
        dob,
        location,
        role,
    });

    const hasValidationError = player.validateSync();
    const hasAvatarValid = validateAvatar(file);

    if (hasValidationError || !hasAvatarValid) {
        const avatarErrorMsg = `Error: Image validation error. ${file.mimetype} is not valid type.`;
        console.log(hasValidationError?.message || avatarErrorMsg);
        return res
            .status(400)
            .json({
                message: "Player validation failed",
                validationError: {
                    ...hasValidationError?.errors,
                    avatar: hasAvatarValid ? undefined : avatarErrorMsg,
                },
            });
    }

    // uploadFile(file) store avatar to aws s3 and returns stored file url
    const fileUrl = await uploadFile(file);

    // saved avatar url in db which store in aws s3
    player.avatar = fileUrl;

    await player.save();

    return res.json({ message: "New Player created", player });
}

module.exports = CreatePlayer;
