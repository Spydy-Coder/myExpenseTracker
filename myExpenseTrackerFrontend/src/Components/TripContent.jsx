import React, { useState, useEffect } from "react";
import { Box, Typography, Fab, CircularProgress } from "@mui/material";
import ExpensesCards from "./ExpensesCards";
import SplitExpenseForm from "./SplitExpenseForm";
import { useParams } from "react-router-dom";
import ExpensePopup from "./ExpensePopup";
import CustomSpeedDial from "./CustomSpeedDial";
import { grey } from "@mui/material/colors";

function TripContent() {
  const [isSplitExpenseFormOpen, setSplitExpenseFormOpen] = useState(false);
  const [isExpensePopup, setIsExpensePopup] = useState(false);
  const [expensesUpdated, setExpensesUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { tripId } = useParams();
  const userId = localStorage.getItem("userId");

  // Handles opening the Split Expense Form
  const handleCreateExpense = () => {
    setSplitExpenseFormOpen(true);
  };
  const handleShowTotalExpense = () => {
    setIsExpensePopup(true);
  };

  // Handles closing the Split Expense Form and triggering re-fetch for updated expenses
  const closeSplitExpenseForm = () => {
    setSplitExpenseFormOpen(false);
    setExpensesUpdated((prev) => !prev);
  };
  const closeExpensePopup = () => {
    setIsExpensePopup(false);
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
        justifyContent: "center",
        height: "auto",
        width: "auto",

        py: 3,
        gap: 3,
        backgroundColor: "#f5f5f5", // Light background for better readability
        borderRadius: 2,
        boxShadow: 3,
        position: "relative",
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h4" // Defines the size and style of the heading
        component="h1" // Semantic HTML element
        sx={{
          color: "primary.main", // Use theme's primary color
          textAlign: "center", // Center-align the text
          fontWeight: "bold", // Make the text bold
          marginTop: 2, // Add margin to the top
        }}
      >
        Who Owes You?
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: grey[700],

          mx: 2,
          textAlign: "center",
          fontStyle: "italic",
        }}
        gutterBottom // Adds spacing below the heading
      >
        * Track and manage expenses effortlessly – see who owes you and ensure
        every split is settled smoothly.
      </Typography>

      {/* Expenses Cards */}
      <ExpensesCards key={expensesUpdated} />

      {/* Floating Action Button */}
      <Box
        sx={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bottom: { xs: 16, sm: 30 }, // Responsive positioning
          right: { xs: 16, sm: 30 },
        }}
      >
        <CustomSpeedDial
          handleCreateExpense={handleCreateExpense}
          handleShowTotalExpense={handleShowTotalExpense}
        />
      </Box>
      <ExpensePopup
        tripId={tripId}
        userId={userId}
        open={isExpensePopup}
        onClose={closeExpensePopup}
      />

      <SplitExpenseForm
        open={isSplitExpenseFormOpen}
        onClose={closeSplitExpenseForm}
      />
    </Box>
  );
}

export default TripContent;
