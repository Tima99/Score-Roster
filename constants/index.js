const STORE = {
    REFRESH_TOKEN: {
        NAME: "refresh_token",
        EXPIRES_IN: '365d' 
    },
    ACCESS_TOKEN : {
        EXPIRES_IN: 300 // 300seconds == 5 minutes 
    },
}

const NUM ={
    OTP_EXPIRE_TIME : 10, // time in mins (10mins)
}

module.exports = {STORE, NUM}