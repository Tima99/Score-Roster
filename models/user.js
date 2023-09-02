const mongoose = require('mongoose');
const bcrypt   = require('bcrypt')

const userSchema = new mongoose.Schema({
  // User's chosen username
  // username: { type: String, unique: true },
  
  // User's email address (used for verification and communication)
  email: { type: String, required: true, unique: true },
  
  // Hashed password for user authentication
  password: { type: String },
  
  // Flag indicating whether the user's email has been verified
  isEmailVerified: { type: Boolean, default: false },
  
  // Code sent to the user's email for email verification
  verificationCode: String,

  // Expiration time for the verificationCode 
  verificationCodeExpires: Date,

  // Token generated for password reset
  resetPasswordToken: String,
  
  // // Expiration date for the password reset token
  // resetPasswordTokenExpires: Date,
}, { timestamps: true});

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
