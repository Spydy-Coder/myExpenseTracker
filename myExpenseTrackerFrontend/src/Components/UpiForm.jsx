import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";

const UpiForm = ({ open, onClose }) => {
  const [upiId, setUpiId] = useState("");
  const [upiPhoneNumber, setUpiPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL 

  useEffect(() => {
    // Fetch the existing UPI mobile number from the backend (if any)
    const fetchUpiId = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`${apiUrl}/api/auth/user/upi/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUpiId(data.upiId || "");
          setUpiPhoneNumber(data.upiPhoneNumber || "");
          setError("")
        } else {
          throw new Error("Failed to fetch payment details");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching payment details");
      }
    };

    if (open) {
      fetchUpiId();
    }
  }, [open]);

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${apiUrl}/api/auth/user/upi/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId, upiPhoneNumber }),
      });

      if (response.ok) {
        onClose(); // Close form after successful save
        setError("")
      } else {
        throw new Error("Failed to update payment details");
      }
    } catch (err) {
      console.error(err);
      setError("Error saving payment details");
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upi-form-modal">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: "calc(100vw - 32px)", sm: 400 },
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: { xs: 2, sm: 4 },
        borderRadius: 2
      }}>
        <Typography variant="h6" component="h2" mb={2}>
          Manage Payment Details
        </Typography>
        <TextField
          fullWidth
          required
          label="UPI ID (required for QR payments)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="example@upi"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="UPI Mobile Number (optional)"
          value={upiPhoneNumber}
          onChange={(e) => setUpiPhoneNumber(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          placeholder="9876543210"
          inputProps={{ inputMode: "numeric", maxLength: 10 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
          fullWidth
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

UpiForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpiForm;
