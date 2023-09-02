const dotenv = require("dotenv");

// Load environment variables based on based NODE_ENV variable
dotenv.config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production"
            : ".env.local",
});

module.exports = process.env
