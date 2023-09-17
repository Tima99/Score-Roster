/**
 *  password matched or created generate access_token using jsonwebtoken package 
 */
const User      = require("../../models/User")
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { STORE : { REFRESH_TOKEN, ACCESS_TOKEN } } = require('../../constants');
const { NODE_ENV, 
        REFRESH_TOKEN_SECRET, 
        ACCESS_TOKEN_SECRET 
} = require('../../config');


async function AuthenticateUser(req, res) {
    const { email, password } = req.body;
    const device = {
      agent : req.headers['user-agent' || "User-Agent"],
      origin: req.ip
    }

    async function initRefreshToken(token){
        // store refresh_token in database for security concern
        await user.storeRefreshToken(token, device.agent, device.origin)
    }

    // Check if the user exists
    const user = await User.findOne({ email }); 

    if (!user || !user.isEmailVerified) {
      return res.status(404).json({ message: 'Invalid User' });
    }
     
    // Generate a JWT refresh_token
    const refresh_token = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN.EXPIRES_IN});
    
    // Generate a JWT access_token
    const access_token  = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN.EXPIRES_IN});


    // If the user does not have a password, save the given password
    if (!user.password) {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); 
      
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();  
      
      // we don't Set the token in a cookie as we develop app  (you may want to use a secure option in production) and save to db
      // app has not a feture of cookie instead of saving refresh_token, we return as response
      initRefreshToken(refresh_token)  

      // send access_token and refresh_token to client 
      return res.status(201).json({ refresh_token, access_token, message: 'Password saved and token generated' });
    } 
    // If the user has a password, compare it with the given password
    const passwordMatch = await user.verifyPassword(password)
    
    if(!passwordMatch) return res.status(401).json({ message: 'Password does not match' }); 
    
    // save refresh_token to db
    initRefreshToken(refresh_token)  

    // send refresh_token and access_token to client and refresh_token saved to db already
    return res.status(200).json({ refresh_token, access_token, message: 'Password matched and token generated' });  
}
  
module.exports = AuthenticateUser