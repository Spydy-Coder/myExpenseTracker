import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    <Card sx={{ maxWidth: 400, margin: "auto", padding: 3, marginTop: 10 }}>
      <Box component="form" onSubmit={submit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" align="center">Forgot Password</Typography>

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" variant="contained">Verify</Button>

        {error && <Typography color="error" align="center">{error}</Typography>}
      </Box>
    </Card>
  );
};

export default ForgotPassword;
