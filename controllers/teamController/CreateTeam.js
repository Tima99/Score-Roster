const validateAvatar = require("../../utils/validateAvatar")
const uploadFile = require("../../utils/uploadFile")
const Player = require("../../models/Player") 
const Stat = require("../../models/Stat") 
const Team = require("../../models/Team") 
const { NODE_ENV } = require("../../config")

async function CreateTeam(req, res){
    const {email: userEmail} = req._user

    // admin of team is one who create team
    // for captain, admin has an option to becomes captain itself during creation of team 
    // allowAdminAsCaptain convert to boolean to indicate whether or not admin wants to captain or not
    
    const { name, location, allowAdminAsCaptain } = req.body
    const logo = req.file

    const isValidLogo = validateAvatar(logo)
    if(!isValidLogo) return res.status(422).json({ message: "Invalid data"})
    
    // needed teams array so later on added _id of created team using method newTeam methods 
    const player = await Player.findOne({ email: userEmail }, {name: 1, avatar: 1, teams: 1})

    if(!player) return res.sendStatus(404)

    const team = new Team({
        name,
        location,
        admin: player._id,
        captain: !!allowAdminAsCaptain ? player._id : null,
        players: [{ _id: player._id }], // add team admin as a first player of new team
    })

    // validate team model via schema define validators
    const hasTeamValidationError = team.validateSync();
    if(hasTeamValidationError) return res.status(422).json({ message: "Invalid data"})

    const fileUrl = logo && await uploadFile(logo)

    // create empty stats for first player adding in team
    const playerStats = await Stat.create({})

    // create empty stats for team
    const teamStats = await Stat.create({})
    
    team.logo             = fileUrl
    team.stats            = teamStats._id
    team.players[0].stats = playerStats._id
    
    await team.save()

    // add new team to player's teams array
    await player.newTeam(team._id)

    res.json({ 
        message: "New Team Created", 
        pictureStatus: NODE_ENV === "development" && fileUrl || "Networking Issues (Not uploaded)", 
        team: {...team.toObject(), players: [{...player.toObject()}]},
    })
}

module.exports = CreateTeam