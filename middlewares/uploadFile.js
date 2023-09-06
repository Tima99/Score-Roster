
const AWS            = require('aws-sdk');
const BUCKET         = require('../config/s3bucket');
const { v4: uuidv4 } = require('uuid');
const { S3_ACCESS_KEY, S3_SECERT_KEY }= require("../config")

// Create an S3 client
const s3 = new AWS.S3({
  region: BUCKET.REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECERT_KEY,
  },
});

async function createBucket() {
  try {
    // Step 1: Create the S3 bucket
    await s3.createBucket({ Bucket: BUCKET.NAME }).promise();

    // Step 2: Set the bucket policy to make it publicly accessible
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET.NAME}/*`,
        },
      ],
    };

    await s3
      .putBucketPolicy({
        Bucket: BUCKET.NAME,
        Policy: JSON.stringify(bucketPolicy),
      })
      .promise();

  } catch (error) {
    console.error('Error:', error);
  }
}

// Create the bucket and upload the file
// createBucket();


// Define a middleware to upload the file to s3 bucket
async function UploadFile(req, res, next) {
  try {
    // Extract the file data from the request body
    const fileData          = req.file.buffer; // Assuming the field name is 'avatar'
    const originalFileName  = req.file.originalname; // Assuming the field name is 'fileName'

    // Generate a unique filename using UUID
    const fileExtension = originalFileName.split('.').pop();
    const fileName      = `${uuidv4()}.${fileExtension}`; // You can change the file extension as needed

    // Create params object for uploading to S3
    const params = {
      Bucket: BUCKET.NAME, // Replace with your S3 bucket name
      Key: fileName,
      Body: fileData,
      Metadata: {
        'x-amz-meta-content-disposition': 'inline', // Replace with your desired value
      },
      ACL: BUCKET.ACL_PUBLIC_READ, // Make the file publicly readable
    };

    // Upload the file to S3
    await s3.upload({...params}).promise();

    // Generate the S3 URL for the uploaded file
    const fileUrl = `https://${BUCKET.NAME}.s3.${BUCKET.REGION}.amazonaws.com/${fileName}`; // Replace with your bucket URL

    req.fileUrl = fileUrl;
    next()

  } catch (error) {
    console.error('Error uploading file to AWS S3:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = UploadFile
