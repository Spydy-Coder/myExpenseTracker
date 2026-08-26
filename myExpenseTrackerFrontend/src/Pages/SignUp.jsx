import { useState } from "react";
import { Box, TextField, Button, Typography, Card, Link, Avatar, Alert } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../Auth/AuthProvider";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const SignUp = () => {
  const [message, setMessage] = useState(""); // State to hold success or error message
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  }); // State to hold form data
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, email, password } = formData;

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully!"); // Show success message
        login(data.token, data.userId);
        navigate(`/dashboard/${data.userId}`);
        setFormData({ username: "", email: "", password: "" }); // Clear form
      } else {
        // If the error message indicates that the email is already in use
        if (data.error && data.error.includes("Email already in use")) {
          setMessage(
            "Account already exists. Please log in or use a different email."
          );
        } else {
          setMessage(`Error: ${data.error}`);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again."); // Show generic error message
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        background: "linear-gradient(180deg, #f5f9ff 0%, #eef7ff 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 4, md: 5 }, textAlign: "center" }}>
          <Avatar
            sx={{
              bgcolor: "rgba(68, 181, 173, 0.16)",
              color: "#0a6a9b",
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
            Create your account
          </Typography>
          <Typography sx={{ color: "#52667a", mb: 3 }}>
            Join myExpense to make trip budgeting easy and transparent for every group.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              name="username"
              label="Username"
              type="text"
              fullWidth
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.3 }}>
              Sign Up
            </Button>
          </Box>
          {message && (
            <Alert severity={message.includes("Error") || message.includes("already") ? "error" : "success"} sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}
          <Typography variant="body2" sx={{ mt: 3, color: "#52667a" }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
              Log in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default SignUp;
