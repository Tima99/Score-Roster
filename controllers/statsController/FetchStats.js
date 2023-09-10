const Stat = require("../../models/Stat")

module.exports = async function (req, res){
    const { statsId } = req.params

    const stats = await Stat.findById(statsId)

    if(!stats) return res.status(404).json({ message: "Something went wrong..."})

    res.json({stats})
}