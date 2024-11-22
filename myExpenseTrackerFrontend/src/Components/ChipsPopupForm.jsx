import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  TextField,
  Box,
  Typography,
} from "@mui/material";

export default function ChipsPopupForm({ open, onClose }) {
  const [totalMoney, setTotalMoney] = useState(""); // Total money input
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected options
  const [amounts, setAmounts] = useState({}); // Amounts for each option
  const [error, setError] = useState(""); // Error message for validation

  const options = ["Option 1", "Option 2", "Option 3"]; // Available options

  // Handle option selection
  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option) // Remove if already selected
        : [...prev, option] // Add if not selected
    );
    setAmounts((prev) => ({ ...prev, [option]: "" })); // Initialize amount for the option
  };

  // Handle total money input
  const handleTotalMoneyChange = (event) => {
    setTotalMoney(event.target.value);
    setError(""); // Clear error when total money is changed
  };

  // Handle amount input for each option
  const handleAmountChange = (option, event) => {
    const newAmount = event.target.value;
    const newAmounts = { ...amounts, [option]: newAmount };
    const total = Object.keys(newAmounts)
      .filter((key) => selectedOptions.includes(key)) // Only include selected options
      .reduce((sum, key) => sum + Number(newAmounts[key] || 0), 0); // Calculate sum

    if (total > Number(totalMoney)) {
      setError("The sum of the amounts cannot exceed the total money.");
    } else {
      setError(""); // Clear error
    }
    setAmounts(newAmounts);
  };

  // Handle split equally
  const handleSplitEqually = () => {
    if (selectedOptions.length > 0) {
      const equalAmount = (Number(totalMoney) / selectedOptions.length).toFixed(
        2
      );
      const splitAmounts = selectedOptions.reduce(
        (acc, option) => ({ ...acc, [option]: equalAmount }),
        {}
      );
      setAmounts(splitAmounts);
      setError(""); // Clear error
    }
  };

  // Handle "Rest" functionality
  const handleSplitRest = () => {
    const totalUsed = selectedOptions.reduce(
      (sum, option) => sum + Number(amounts[option] || 0),
      0
    );
    const remaining = Number(totalMoney) - totalUsed;

    if (remaining < 0) {
      setError("The sum of the amounts exceeds the total money.");
      return;
    }

    const optionsToSplit = selectedOptions.filter(
      (option) => !amounts[option] || amounts[option] === "0"
    );

    if (optionsToSplit.length > 0) {
      const equalSplit = (remaining / optionsToSplit.length).toFixed(2);
      const updatedAmounts = { ...amounts };

      optionsToSplit.forEach((option) => {
        updatedAmounts[option] = equalSplit;
      });

      setAmounts(updatedAmounts);
      setError(""); // Clear error
    } else {
      setError("No options available to split the remaining money.");
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const total = selectedOptions.reduce(
      (sum, option) => sum + Number(amounts[option] || 0),
      0
    );

    if (total > Number(totalMoney)) {
      setError("The sum of the amounts exceeds the total money.");
    } else {
      console.log("Selected Options with Amounts:", { selectedOptions, amounts });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Money Split</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Total Money"
              type="number"
              fullWidth
              value={totalMoney}
              onChange={handleTotalMoneyChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {options.map((option) => (
              <Box
                key={option}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <Chip
                  label={option}
                  clickable
                  color={selectedOptions.includes(option) ? "primary" : "default"}
                  onClick={() => handleOptionToggle(option)}
                  sx={{
                    border: selectedOptions.includes(option)
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  }}
                />
                {selectedOptions.includes(option) && (
                  <TextField
                    label="Enter Amount"
                    type="number"
                    size="small"
                    variant="outlined"
                    value={amounts[option] || ""}
                    onChange={(event) => handleAmountChange(option, event)}
                    sx={{ width: "150px" }}
                  />
                )}
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: "16px" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSplitEqually}
              disabled={!selectedOptions.length || !totalMoney}
            >
              Split Equally
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSplitRest}
              disabled={!selectedOptions.length || !totalMoney}
            >
              Split Rest
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!totalMoney || selectedOptions.length === 0 || !!error}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
