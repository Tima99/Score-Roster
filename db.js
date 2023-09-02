const mongoose = require("mongoose");
const { DB_URL } = require("./config"); // Update the path as needed

// Connect to MongoDB using Mongoose
mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`Connected to MongoDB ${DB_URL}`);
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
