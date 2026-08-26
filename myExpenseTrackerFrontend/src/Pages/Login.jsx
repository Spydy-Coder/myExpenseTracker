import { useState } from "react";
import { Box, TextField, Button, Typography, Card, Avatar, Alert, Link, Stack } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

const SignIn = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const signIn = async (formData) => {
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        setMessageType("success");
        login(data.token, data.userId);

        // Redirect to the user's dashboard with their ID
        navigate(`/dashboard/${data.userId}`);
      } else {
        setMessage(`Error: ${data.error}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    signIn(formData);
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
        background: "radial-gradient(circle at top, rgba(68,181,173,0.16), transparent 35%), linear-gradient(180deg, #f4fbff 0%, #eef7ff 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 4,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 4, md: 5 }, textAlign: "center" }}>
          <Avatar
            sx={{
              bgcolor: "rgba(10, 106, 155, 0.12)",
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
            Welcome back
          </Typography>
          <Typography sx={{ color: "#52667a", mb: 3 }}>
            Sign in to manage trips, split expenses, and settle payments easily.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField name="email" label="Email" type="email" fullWidth required />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.3 }}>
              Sign In
            </Button>
          </Box>
          {message && (
            <Alert severity={messageType === "success" ? "success" : "error"} sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}
          <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
            <Link component={RouterLink} to="/forgot-password" underline="hover" sx={{ fontSize: "0.95rem" }}>
              Forgot Password?
            </Link>
            <Typography variant="body2" sx={{ color: "#52667a" }}>
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/signup" underline="hover" sx={{ fontWeight: 700 }}>
                Sign Up
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default SignIn;
