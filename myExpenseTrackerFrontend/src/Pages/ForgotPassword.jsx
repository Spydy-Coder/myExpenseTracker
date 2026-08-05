import { useState } from "react";
import { Box, TextField, Button, Typography, Card, Avatar, Alert, Link } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiUrl}/api/auth/verify-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid username or email");
        return;
      }

      // Navigate to reset password page with username + email
      navigate("/reset-password", { state: { username, email } });
    } catch (err) {
      setError("Something went wrong");
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
          maxWidth: 460,
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
            <LockResetIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
            Forgot Password
          </Typography>
          <Typography sx={{ color: "#52667a", mb: 3 }}>
            Enter your username and email to verify your account and reset your password.
          </Typography>

          <Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.3 }}>
              Verify Account
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" sx={{ mt: 3, color: "#52667a" }}>
            Remembered your password?{' '}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
