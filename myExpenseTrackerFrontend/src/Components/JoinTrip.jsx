import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography
} from "@mui/material";

const JoinTrip = ({ open, onClose }) => {
  const [tripCode, setTripCode] = useState("");
  const [error, setError] = useState("");

  const handleJoinTrip = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch("http://localhost:5000/trip/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripCode, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully joined the trip!");
        onClose();
      } else {
        setError(data.message || "Failed to join the trip");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Join Trip</DialogTitle>
      <DialogContent>
        <TextField
          label="Trip Code"
          value={tripCode}
          onChange={(e) => setTripCode(e.target.value)}
          fullWidth
          margin="dense"
        />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              color: "error.main",
            },
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleJoinTrip} color="primary">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinTrip;
