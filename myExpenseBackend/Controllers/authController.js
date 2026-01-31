const User = require("../Models/User");
const bcrypt = require("bcrypt");

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Account already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = await newUser.generateToken();
    const userId = savedUser._id;

    res.status(201).json({
      message: "Account created successfully!",
      token: token,
      userId: userId,
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
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "No account found. Please sign up first." });
    }

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

// Fetch UPI ID for a user
exports.fetchUpiId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ upiId: user.upiId });
  } catch (error) {
    res.status(500).json({ message: "Error fetching UPI ID", error });
  }
};

// Update UPI ID for a user
exports.updateUpiId = async (req, res) => {
  try {
    const { upiId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { upiId },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "UPI ID updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error saving UPI ID", error });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid username or email",
      });
    }

    res.json({ message: "User verified" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { username, email, newPassword } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid request",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
