import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";

export default function SplitExpenseForm({ open, onClose }) {
  const [categories] = useState(["Food", "Travel", "Miscellaneous"]); // Categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [usernames, setUsernames] = useState({ members: [] }); // Usernames fetched from backend
  const [selectedOptions, setSelectedOptions] = useState([]); // Selected usernames (by id)
  const [totalMoney, setTotalMoney] = useState(""); // Total money input
  const [description,setDescription] = useState("");
  const [amounts, setAmounts] = useState({}); // Amounts for each username
  const [error, setError] = useState(""); // Validation error
  const [loading, setLoading] = useState(false); // Loading state for usernames
  const [fetchError, setFetchError] = useState(""); // Fetch error
  const {tripId} = useParams(); // Replace with dynamic trip ID if needed
  const userId = localStorage.getItem("userId")
  const apiUrl = import.meta.env.VITE_API_URL;

  const clearAll = () =>{
    setSelectedCategory("");
    setDescription("");
    setTotalMoney("");
    setSelectedOptions([]);
    setAmounts({});
    setError("");
  }

  // Fetch usernames from the backend when the popup opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch(`${apiUrl}/trip/allusernames/${tripId}`) // Replace with your API endpoint
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch usernames");
          }
          return response.json();
        })
        .then((data) => {
          setUsernames(data); // Expecting { members: [{ id, username }, ...] }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching usernames:", error);
          setFetchError("Failed to fetch usernames. Please try again.");
          setLoading(false);
        });
    }
  }, [open]);

  // Handle category selection
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle total money input
  const handleTotalMoneyChange = (event) => {
    setTotalMoney(event.target.value);
    setError(""); // Clear error when total money is changed
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setError(""); // Clear error when total money is changed
  };

  // Handle selection of usernames (based on id)
  const handleOptionToggle = (userId) => {
    setSelectedOptions((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Remove if already selected
        : [...prev, userId] // Add if not selected
    );
    setAmounts((prev) => ({ ...prev, [userId]: "" })); // Initialize amount for the user
  };

  // Handle amount input for each selected username
  const handleAmountChange = (userId, event) => {
    const newAmount = event.target.value;
    const newAmounts = { ...amounts, [userId]: newAmount };
    const total = Object.keys(newAmounts)
      .filter((key) => selectedOptions.includes(key)) // Only include selected users by id
      .reduce((sum, key) => sum + Number(newAmounts[key] || 0), 0); // Calculate sum

    if (total > Number(totalMoney)) {
      setError("The sum of the amounts cannot exceed the total money.");
    } else {
      setError(""); // Clear error
    }
    setAmounts(newAmounts);
  };

  // Handle split equally functionality
  const handleSplitEqually = () => {
    if (selectedOptions.length > 0) {
      const equalAmount = (Number(totalMoney) / selectedOptions.length).toFixed(2);
      const splitAmounts = selectedOptions.reduce(
        (acc, userId) => ({ ...acc, [userId]: equalAmount }),
        {}
      );
      setAmounts(splitAmounts);
      setError(""); // Clear error
    }
  };

  // Handle "Split Rest" functionality
  const handleSplitRest = () => {
    const totalUsed = selectedOptions.reduce(
      (sum, userId) => sum + Number(amounts[userId] || 0),
      0
    );
    const remaining = Number(totalMoney) - totalUsed;

    if (remaining < 0) {
      setError("The sum of the amounts exceeds the total money.");
      return;
    }

    const optionsToSplit = selectedOptions.filter(
      (userId) => !amounts[userId] || amounts[userId] === "0"
    );

    if (optionsToSplit.length > 0) {
      const equalSplit = (remaining / optionsToSplit.length).toFixed(2);
      const updatedAmounts = { ...amounts };

      optionsToSplit.forEach((userId) => {
        updatedAmounts[userId] = equalSplit;
      });

      setAmounts(updatedAmounts);
      setError(""); // Clear error
    } else {
      setError("No options available to split the remaining money.");
    }
  };

  // Handle form submission
  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const total = selectedOptions.reduce(
  //     (sum, userId) => sum + Number(amounts[userId] || 0),
  //     0
  //   );

  //   if (total > Number(totalMoney)) {
  //     setError("The sum of the amounts exceeds the total money.");
  //   } else {
  //     console.log("Submitted Data:", {
  //       category: selectedCategory,
  //       totalMoney,
  //       selectedOptions,
  //       amounts,
  //     });
  //     onClose(); // Close the dialog
  //   }
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    const total = selectedOptions.reduce(
      (sum, userId) => sum + Number(amounts[userId] || 0),
      0
    );

    if (total > Number(totalMoney)) {
      setError("The sum of the amounts exceeds the total money.");
      return;
    }

    const expenseData = {
      tripId,
      category: selectedCategory,
      description,
      totalMoney: Number(totalMoney),
      issuedBy: userId, // Replace with actual user ID
      members: selectedOptions.map((id) => ({
        userId: id,
        amount: Number(amounts[id]),
      })),
    };
  
    fetch(`${apiUrl}/expense/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save expense");
        }
        return response.json();
      })
      .then(() => {
        console.log("Expense saved successfully");
        clearAll();
        onClose();
      })
      .catch((error) => {
        console.error("Error saving expense:", error);
        setError("Failed to save expense. Please try again.");
      });
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{
      overflowX:"hidden",
      overflowY:"hidden",
      "&::-webkit-scrollbar": {
        width: "4px", // Width of the vertical scrollbar
        height: "4px", // Height of the horizontal scrollbar
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c1c1c1", // Scrollbar thumb color
        borderRadius: "4px", // Rounded scrollbar thumb
        "&:hover": {
          backgroundColor: "#a0a0a0", // Darker color on hover
        },
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#f1f1f1", // Scrollbar track color
        borderRadius: "4px",
      },
    }}>
      <DialogTitle>Split Money</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Category Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={handleDescriptionChange}
            sx={{ mb: 2 }}
          />

          {/* Total Money Input */}
          <TextField
            label="Total Money"
            type="number"
            fullWidth
            value={totalMoney}
            onChange={handleTotalMoneyChange}
            sx={{ mb: 2 }}
          />

          {/* Usernames Selection */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : fetchError ? (
            <Typography color="error" sx={{ mt: 2 }}>
              {fetchError}
            </Typography>
          ) : usernames.members.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {usernames.members.map((member) => (
                <Box
                  key={member.id}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}
                >
                  <Chip
                    label={member.id === userId ? "Self" : member.username}
                    clickable
                    color={
                      member.id === userId && selectedOptions.includes(member.id)
                        ? "success"
                        : selectedOptions.includes(member.id)
                        ? "primary"
                        : "default"
                    }
                    onClick={() => handleOptionToggle(member.id)}
                    sx={{
                      border: selectedOptions.includes(member.id)
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                    }}
                  />
                  {selectedOptions.includes(member.id) && (
                    <TextField
                      label="Enter Amount"
                      type="number"
                      size="small"
                      value={amounts[member.id] || ""}
                      onChange={(event) => handleAmountChange(member.id, event)}
                      sx={{ width: "150px"}}
                    />
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No members found for this trip.</Typography>
          )}

          {/* Split Buttons */}
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

          {/* Error Message */}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
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
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
