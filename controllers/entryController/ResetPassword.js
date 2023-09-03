/**
 * Reset password for email ,
 * 1 ) check if user verify their email once for reset password (with help of property user.isResetPasswordVerified)
 *    if not than user cannot reset password,
 * 2) user can reset their password till otp expires time
 * 3) Email must be verified before reset password
 */

const User    = require("../../models/user")
const bcrypt  = require('bcrypt');

async function ResetPassword(req, res){
  
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
}

module.exports = ResetPassword