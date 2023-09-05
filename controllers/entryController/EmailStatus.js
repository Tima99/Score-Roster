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

const User        = require("../../models/User")
const otpTemplate = require("../../templates/otpTemplate")
const emailOTP    = require("../../utils/sendEmail")
const GenerateOTP = require("../../utils/generateOTP")
const { NUM }     = require('../../constants');

async function isEmailVerified(req, res){
  
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
    
} 


module.exports = isEmailVerified