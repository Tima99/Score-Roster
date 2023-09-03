/**
 *  password matched or created generate access_token using jsonwebtoken package 
 */
const User                          = require("../../models/user")
const bcrypt                        = require('bcrypt');
const jwt                           = require('jsonwebtoken');
const { JWT_AUTH_SECRET, NODE_ENV } = require('../../config');
const { STORE }                     = require('../../config/constants');


async function AuthenticateUser(req, res) {
    const { email, password } = req.body;

    const setTokenToCookie = (access_token) => {
        res.cookie(STORE.AUTH_COOKIE_NAME, access_token, { 
            httpOnly: true, 
            secure:  NODE_ENV === "production"
        });
    }
  
    // Check if the user exists
    const user = await User.findOne({ email }); 

    if (!user || !user.isEmailVerified) {
      return res.status(404).json({ message: 'Invalid User' });
    }
     
    // Generate a JWT token
    const access_token = jwt.sign({ userId: user._id }, JWT_AUTH_SECRET);

    // If the user does not have a password, save the given password
    if (!user.password) {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); 
      
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();  
      
      // Set the token in a cookie (you may want to use a secure option in production)
      setTokenToCookie(access_token)  

      return res.status(201).json({ message: 'Password saved and token generated' });
    } 
    // If the user has a password, compare it with the given password
    const passwordMatch = await user.verifyPassword(password)
    
    if(!passwordMatch) return res.status(401).json({ message: 'Password does not match' }); 
    
    // Set the token in a cookie (you may want to use a secure option in production)
    setTokenToCookie(access_token)  

    return res.status(200).json({ message: 'Password matched and token generated' });  
}
  
module.exports = AuthenticateUser