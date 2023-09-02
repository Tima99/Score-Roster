const otpGenerator  = require('otp-generator')

const GenerateOTP = (otpExpirationTime = 10) => {
    const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false , lowerCaseAlphabets: false });
    
    const otpSentTime = new Date(); // Calculate the current time when the OTP is sent

    // Calculate the time 10 minutes (in milliseconds) later from when otp sent 
    const expirationTime = new Date(otpSentTime.getTime() + otpExpirationTime * 60 * 1000); 
    return { OTP, expirationTime }
}

module.exports = GenerateOTP;