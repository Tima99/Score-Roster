/**
 * Check email exists or verified 
 * if Not - sent otp to email and return false (Email not verified or exists , please enter otp sent on [email])
 * else returns true (Email already registered)
 * 
 * its also check user created password or not
 * as this scenerio occurs when user left without creating password but verify their email via otp
 * this helps on client side to give them message between whenever user comes or goes next
 * "Create Password" or "Enter Password"
 */

const User        = require("../../models/user")
const otpTemplate = require("../../templates/otpTemplate")
const emailOTP    = require("../../utils/sendEmail")
const GenerateOTP = require("../../utils/generateOTP")
const { NUM }     = require('../../config/constants');

async function isEmailVerified(req, res){
  
  try{
      const { email } = req.params
      const user = await User.findOne({ email }) || await User.create({ email })

      if(user && user.isEmailVerified) return res.status(201).json({status: true, message: "Email verified", hasPassword: !!user.password })
      
      const otpExpirationTime = NUM.OTP_EXPIRE_TIME; // 10 minutes
      const { OTP, expirationTime } = GenerateOTP(otpExpirationTime)
      
      // send otp on given email
      await emailOTP(({ to: email, subject: "Verify your email", html: otpTemplate(OTP, otpExpirationTime) }))

      // save otp in database
      user.verificationCode         = OTP
      user.verificationCodeExpires  = expirationTime
      await user.save()

      res.status(201).json({status: false, message: `Otp sent on email ${email}`})
    }catch(err){
        console.log(`In file : ${__filename}`)
        console.log(err.message)
        
        res.status(500).json({ message: "Internal Server Error"})
    }
} 

/**
 * Retrieve the OTP and validate its authenticity against the database .
 * Once the OTP matches the user's verification code, it is updated to null in the database.
 */

async function OtpVerified(req, res, next){
    try{
        const { email, otp } = req.body

        const user = await User.findOne({ email })
        if(!user || !user.verificationCode) return res.status(401).json({message: "Verification Failed"})

        // console.log( user.verificationCodeExpires.toLocaleString())
        
        if(Date.now() >= user.verificationCodeExpires.getTime()) return res.status(401).json({ message: "OTP has expired"})
        if(user.verificationCode !== otp) return res.status(401).json({message: "OTP is not valid"})


        user.verificationCode = null
        await user.save()

        req.user = user
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

async function EmailVerified(req, res){
  const user = req.user
  user.isEmailVerified = true
  user.save()
  .then(_ => res.status(200).json({ message: "Email verified"}))
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error"})
  })
}

async function ResetPasswordVerified(req, res){
  const user = req.user
  user.isResetPasswordVerified = true
  user.save()
  .then(_ => res.status(200).json({ message: "Email verified for reset password"}))
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error"})
  })
}

/**
 * Reset password for email ,
 * 1 ) check if user verify their email once for reset password (with help of property user.isResetPasswordVerified)
 *    if not than user cannot reset password,
 * 2) user can reset their password till otp expires time
 * 3) Email must be verified before reset password
 */

async function ResetPassword(req, res){
  try{
    const { password: newPassword, confirmPassword , email } = req.body

    const user = await User.findOne({ email })
    if(!user || !user.isResetPasswordVerified || !user.isEmailVerified ) return res.status(404).json({ message: "Invalid User"})

    if(user.verificationCodeExpires.getTime() <= Date.now()) {
      user.isResetPasswordVerified = false
      await user.save()
      return res.status(404).json({ message: "Reset Password Timeout"})
    }
    
    if(newPassword !== confirmPassword) return res.status(401).json({ message: "Password and ConfirmPassword not matched"}) 
    
    user.password = await bcrypt.hash(newPassword, 10);
    user.isResetPasswordVerified = false
    await user.save()


    return res.status(201).json({ message: "Password reset sucessfully"})
    
  }catch(err){
    console.log(`In file : ${__filename}`)
    console.log(err.message)
        
    res.status(500).json({ message: "Internal Server Error"})
  }
}

/**
 *  password matched or created generate access_token using jsonwebtoken package 
 */
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
  
    try {
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
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal Server error' });
    }
}
  
/**
 * Resend / send Otp
 */

async function ResendOtp(req, res){
  const { email } = req.params

  try{
    const user = await User.findOne({ email })

    if(!user) return res.status(404).json({ message: "User not exists"})

    const otpExpirationTime = NUM.OTP_EXPIRE_TIME
    const { OTP, expirationTime } = GenerateOTP(otpExpirationTime)

    // send otp on given email
    await emailOTP(({ to: email, subject: "Verify your email", html: otpTemplate(OTP, otpExpirationTime) }))
    
    // save otp in database
    user.verificationCode         = OTP
    user.verificationCodeExpires  = expirationTime
    await user.save()

    return res.status(200).json({ message: 'OTP sent sucessfully'})
    
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "Internal Server Error"})
  }
}

module.exports = {
    isEmailVerified,
    OtpVerified,
    EmailVerified,
    ResetPasswordVerified,
    AuthenticateUser,
    ResendOtp,
    ResetPassword
}