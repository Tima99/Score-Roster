const STORE = {
    REFRESH_TOKEN: {
        NAME: "refresh_token",
        EXPIRES_IN: '365d' 
    },
    ACCESS_TOKEN : {
        EXPIRES_IN: 60 * 60 // 15 minutes 
    },
}

const NUM ={
    OTP_EXPIRE_TIME : 10, // time in mins (10mins)
}

const AVATAR_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']

module.exports = {STORE, NUM, AVATAR_FORMATS}