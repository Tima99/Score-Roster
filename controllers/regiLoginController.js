const User = require("../models/user");
const otpTemplate = require("../templates/otpTemplate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { JWT_SECRET, NODE_ENV } = require("../config")

// a function thats handles registration and login logic both named RegiLogin
const RegiLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    // User exists, proceed to login if password is correct
    if (existingUser) {
      const isPasswordValid = await existingUser.verifyPassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Please provide valid email or password." });
      }

      // Create JWT token
      // we hased _id as search for user thus we cannot share their private email
      const token = jwt.sign(
        { userId: existingUser._id },
        JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      // Set the cookie
      res.cookie('id_card', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production', // Set to true in production
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      // Send token as response (you can also set it in a cookie)
      return res.status(200).json({ message: "User logged in successfully", token });
    }

    // User doesn't exist, send OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP to the user's email using the utility function
    const subject = "OTP for Email Verification";
    await sendEmail({ email, subject, html: otpTemplate(otp) });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode: otp.toString(),
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = RegiLogin;
