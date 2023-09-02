const otpTemplate = (otp, validTime) => {
    return `<p>Your OTP for email verification is: <strong>${otp}</strong></p> <br /> Valid for <strong>${validTime}</strong> mins.`
};

module.exports = otpTemplate
