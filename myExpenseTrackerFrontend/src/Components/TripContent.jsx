import React, { useState, useEffect } from "react";
import { Box, Typography, Fab, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpensesCards from "./ExpensesCards";
import SplitExpenseForm from "./SplitExpenseForm";

function TripContent() {
  const [isSplitExpenseFormOpen, setSplitExpenseFormOpen] = useState(false);
  const [expensesUpdated, setExpensesUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handles opening the Split Expense Form
  const handleCreateExpense = () => {
    setSplitExpenseFormOpen(true);
  };

  // Handles closing the Split Expense Form and triggering re-fetch for updated expenses
  const closeSplitExpenseForm = () => {
    setSplitExpenseFormOpen(false);
    setExpensesUpdated((prev) => !prev);
  };

  // Simulates loading state (replace this with real data fetching logic)
  useEffect(() => {
    setLoading(false); // Simulate data loading (update based on `expensesUpdated`)
  }, [expensesUpdated]);

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight:"100%",
        height: "auto",

        p: 3,
        gap: 3,
        backgroundColor: "#f5f5f5", // Light background for better readability
        borderRadius: 2,
        boxShadow: 3,
        position: "relative",
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Trip Expenses
      </Typography>

      {/* Expenses Cards */}
      <ExpensesCards key={expensesUpdated} />

      {/* Floating Action Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 30 }, // Responsive positioning
          right: { xs: 16, sm: 30 },
        }}
      >
        <Fab
          color="primary"
          aria-label="Add Expense"
          onClick={handleCreateExpense}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Split Expense Form Modal */}
      <SplitExpenseForm
        open={isSplitExpenseFormOpen}
        onClose={closeSplitExpenseForm}
      />
    </Box>
  );
}

export default TripContent;
