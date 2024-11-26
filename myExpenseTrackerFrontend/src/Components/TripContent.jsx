import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Fab,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpensesCards from "./ExpensesCards";
import SplitExpenseForm from "./SplitExpenseForm";

function TripContent() {
  const [isSplitExpenseFormOpen, setSplitExpenseFormOpen] = useState(false);
  const [expensesUpdated, setExpensesUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get current theme and check if it's dark mode
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Handles opening the Split Expense Form
  const handleCreateExpense = () => {
    setSplitExpenseFormOpen(true);
  };

  // Handles closing the Split Expense Form
  const closeSplitExpenseForm = () => {
    setSplitExpenseFormOpen(false);
    setExpensesUpdated(!expensesUpdated); // Trigger re-fetch for updated expenses
  };

  // Simulating loading (if necessary for data fetching)
  useEffect(() => {
    setLoading(false); // You can replace this with logic to fetch data
  }, [expensesUpdated]);

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
        p: { xs: 2, sm: 3 }, // Responsive padding
        gap: 3,
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5", // Dark mode background color
        color: isDarkMode ? "#ffffff" : "#000000", // Light text on dark background
        borderRadius: 2,
        boxShadow: 3,
        position: "relative",
        height: "100vh", // Full height for the content
        overflowY: "auto", // Allow scrolling if content exceeds the viewport height
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Responsive font size
        }}
      >
        Trip Expenses
      </Typography>

      {/* Expenses Cards */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          overflowY: "auto", // Allow scrolling for cards if needed
          maxHeight: { xs: "auto", sm: "calc(100vh - 120px)" }, // Responsive max height for larger screens
        }}
      >
        <ExpensesCards key={expensesUpdated} />
      </Box>

      {/* Floating Action Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 30 }, // Responsive positioning for small screens and up
          right: { xs: 16, sm: 30 },
        }}
      >
        <Fab
          color="primary"
          aria-label="Add Expense"
          onClick={handleCreateExpense}
          sx={{
            boxShadow: 3,
            zIndex: 1000, // Ensure the FAB stays on top of other elements
            width: { xs: 56, sm: 64 }, // Adjust FAB size for small screens
            height: { xs: 56, sm: 64 },
          }}
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
