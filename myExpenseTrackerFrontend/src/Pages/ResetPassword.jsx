import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!state) return <Typography align="center">Invalid access</Typography>;

  const { username, email } = state;

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to reset password");
        return;
      }

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", padding: 3, marginTop: 10 }}>
      <Box component="form" onSubmit={submit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" align="center">Reset Password</Typography>

        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="contained">Reset Password</Button>

        {message && <Typography align="center">{message}</Typography>}
      </Box>
    </Card>
  );
};

export default ResetPassword;
