import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import ExpensesCards from "./ExpensesCards";
import SplitExpenseForm from "./SplitExpenseForm";
import { useParams } from "react-router-dom";
import ExpensePopup from "./ExpensePopup";
import CustomSpeedDial from "./CustomSpeedDial";
import { grey } from "@mui/material/colors";
import InfoDialog from "./InfoDialog";
import EditTripForm from "./EditTripForm";

function TripContent() {
  const [isSplitExpenseFormOpen, setSplitExpenseFormOpen] = useState(false);
  const [isExpensePopup, setIsExpensePopup] = useState(false);
  const [expensesUpdated, setExpensesUpdated] = useState(false);
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tripId } = useParams();
  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;

  // Get current theme and check if it's dark mode
  const theme = useTheme();
  void theme;

  // Handles opening the Split Expense Form
  const handleCreateExpense = () => {
    setSplitExpenseFormOpen(true);
  };
  const handleShowTotalExpense = () => {
    setIsExpensePopup(true);
  };

  const handleInfoDialog = () => {
    setInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
  };

  // Handles closing the Split Expense Form and triggering re-fetch for updated expenses
  const closeSplitExpenseForm = () => {
    setSplitExpenseFormOpen(false);
    setExpensesUpdated((prev) => !prev);
  };
  const closeExpensePopup = () => {
    setIsExpensePopup(false);
  };

  const handleTripUpdated = (updatedTrip) => {
    setTripDetails(updatedTrip || tripDetails);
    setExpensesUpdated((prev) => !prev);
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!tripId || !apiUrl) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/trip/details/${tripId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip details");
        }

        const data = await response.json();
        setTripDetails(data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, apiUrl, expensesUpdated]);

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
        width: "100%",
        px: { xs: 2, md: 4 },
        py: 3,
        gap: 3,
        backgroundColor: "#f5f5f5", // Light background for better readability
        borderRadius: 0,
        boxShadow: "none",
        position: "relative",
      }}
    >
      {/* Title Section */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: "primary.main",
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 2,
          }}
        >
          {tripDetails?.tripName || "Who Owes You?"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "block",
            color: grey[700],
            mx: 2,
            textAlign: "center",
          }}
        >
          {tripDetails?.desc || "Track and manage expenses effortlessly – see who owes you and ensure every split is settled smoothly."}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setIsEditTripOpen(true)}
          sx={{ mt: 1 }}
        >
          Edit trip details
        </Button>
      </Box>

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
          handleInfoDialog={handleInfoDialog}
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
      <InfoDialog open={isInfoDialogOpen} handleClose={handleCloseInfoDialog} />
      {tripId && (
        <EditTripForm
          open={isEditTripOpen}
          onClose={() => setIsEditTripOpen(false)}
          tripId={tripId}
          onTripUpdated={handleTripUpdated}
        />
      )}
    </Box>
  );
}

export default TripContent;
