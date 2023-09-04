
/**
 * Retrieve the OTP and validate its authenticity against the database .
 * Once the OTP matches the user's verification code, it is updated to null in the database.
 * Using different function for email verification and reset password's email verification once otp verified/valid as
 * 1) Provides different messages response to client
 * 2) Update values in db acc. to their need  
 */

const User = require("../../models/User")

async function OtpVerified(req, res, next){
    
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
    
}


async function EmailVerified(req, res){
  const user = req.user
  user.isEmailVerified = true
  await user.save()
  res.status(200).json({ message: "Email verified"})
}

async function ResetPasswordVerified(req, res){
  const user = req.user
  user.isResetPasswordVerified = true
  await user.save()
  res.status(200).json({ message: "Email verified for reset password"})
}


module.exports = {
    OtpVerified, 
    EmailVerified,
    ResetPasswordVerified
}