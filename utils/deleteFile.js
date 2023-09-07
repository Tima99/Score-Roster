
const AWS                             = require('aws-sdk');
const BUCKET                          = require('../config/s3bucket');
const { S3_ACCESS_KEY, S3_SECERT_KEY }= require("../config")

// Create an S3 client
const s3 = new AWS.S3({
  region: BUCKET.REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECERT_KEY,
  },
});

// Define a middleware to upload the file to s3 bucket
async function DeleteFile(fileName) {
  try {
    // Create params object for uploading to S3
    const params = {
      Bucket: BUCKET.NAME, // Replace with your S3 bucket name
      Key: fileName,
    };

    // Upload the file to S3
    await s3.deleteObject(params).promise();

    return true
  } catch (error) {
    console.error('Error deleting file to AWS S3:', error);
    return Promise.reject(error)
  }
}

module.exports = DeleteFile
