  
/**
 * Resend / send Otp
 */

const User        = require("../../models/user")
const { NUM }     = require('../../config/constants');
const GenerateOTP = require("../../utils/generateOTP")
const otpTemplate = require("../../templates/otpTemplate")
const emailOTP    = require("../../utils/sendEmail")

async function ResendOtp(req, res){
    const { email } = req.params
  
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
}

module.exports = ResendOtp