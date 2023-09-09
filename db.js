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

/* Create mongoose prototypes */
// extract ObjectId from url url:string returns ObjectId:string
mongoose.__proto__.ExtractId = (url) => {
    const urlArr = url.split('/');

    const objectId = urlArr.find( item => mongoose.isValidObjectId(item))

    return objectId
}

// compare two objectId and returns true if both are equals
mongoose.__proto__.isEquals = (id1, id2) => {
    return id1?.toString() === id2?.toString()
}