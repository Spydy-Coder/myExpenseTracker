const User = require("../Models/User");
const bcrypt = require("bcrypt");

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Account already exists. Please login." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = await newUser.generateToken();

    res.status(201).json({
      message: "Account created successfully!",
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating account. Please try again." });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "No account found. Please sign up first." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const token = await user.generateToken();

    res.status(200).json({
      message: "Login successful!",
      userId: user._id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in. Please try again." });
  }
};
