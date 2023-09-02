const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // User's chosen username
  username: { type: String, required: true, unique: true },
  
  // User's email address (used for verification and communication)
  email: { type: String, required: true, unique: true },
  
  // Hashed password for user authentication
  password: { type: String, required: true },
  
  // Flag indicating whether the user's email has been verified
  isEmailVerified: { type: Boolean, default: false },
  
  // Code sent to the user's email for email verification
  verificationCode: String,
  
  // Token generated for password reset
  resetPasswordToken: String,
  
  // // Expiration date for the password reset token
  // resetPasswordTokenExpires: Date,
}, { timeStamp: true});

// Define a virtual property to serve as a unified identifier for username and email
// user.identifier serves user._id if user.email or user.username is undefined or vice-versa
userSchema.virtual('identifier').get(function() {
  return this.username || this.email || this._id;
});


// Method to verify the provided password
userSchema.methods.verifyPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Error while verifying password:', error?.message || error);
    return false;
  }
};

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
