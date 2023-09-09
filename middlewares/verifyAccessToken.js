const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('../config')
const mongoose = require('mongoose');
const User = require('../models/User');
const Player = require('../models/Player');

async function verifyAccessToken(req, res, next){
    try{
        const bearerToken = req.headers['authorization' || 'Authorization']

        // remove Bearer[space] or bearer[space] 
        const token = bearerToken?.replace(/^Bearer\s+/i, '');
        // String starts with Bearer and one or more space replace this with empty string   

        // verify token
        const {userId} = jwt.verify(token, ACCESS_TOKEN_SECRET)

        // gets user with userId payload
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) }, { password: 0 , refreshTokens: 0 })
        if(!user) return res.sendStatus(401)
        
        // save it in req for use of next handler 
        req._user = user

        // extract player from db using user.email
        const player = await Player.findOne({ email: user.email }, {name: 1, avatar: 1, teams: 1})
        req._player = player

        next()
    }catch(err){
        console.log(`Error: ${err?.message}\nInFile: ${__filename}`)
        res.status(500).json({ message: "Internal server error"})
    }
}

module.exports = verifyAccessToken