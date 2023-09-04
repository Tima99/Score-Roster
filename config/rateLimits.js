// user can request or server can response 5 times in 1 minutes
const entryRateLimit = { windowMs: 60 * 1000, max: 5 };

// send otp request one time in every 30 seconds 
// in this 30 seconds sent otp time is also included
const SEND_OTP_TIME_LIMIT = 30  
const resendOtpLimit = {
    windowMs: SEND_OTP_TIME_LIMIT * 1000,
    max: 1,
    message: `Try again after ${SEND_OTP_TIME_LIMIT}s`,
};

module.exports = { entryRateLimit, SEND_OTP_TIME_LIMIT, resendOtpLimit };
