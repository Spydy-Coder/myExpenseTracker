import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PolylineIcon from "@mui/icons-material/Polyline";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useNavigate } from "react-router-dom";
import CreateForm from "../Components/CreateForm";
import TripCard from "../Components/TripCard"; // Ensure this is correctly imported

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const [trips, setTrips] = useState([]);
  const userId = localStorage.getItem("userId");  // Fetch user ID from storage or auth context

  useEffect(() => {
    // Fetch user-specific trips
    const fetchTrips = async () => {
      try {
        const response = await fetch(`http://localhost:5000/trip/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Your Trips
      </Typography>
      {trips.length === 0 ? (
        <Typography>No trips found. Create one to get started!</Typography>
      ) : (
        trips.map((trip) => (
          <TripCard
            key={trip.uniqueId}
            photo="https://www.shutterstock.com/shutterstock/photos/1247506609/display_1500/stock-vector-cabriolet-car-with-people-diverse-group-of-men-and-women-enjoy-ride-and-music-happy-young-friends-1247506609.jpg"  // Replace with dynamic image if available
            tripName={trip.tripName}
            description={trip.desc}
            date={new Date(trip.date).toLocaleDateString()}
            codeToCopy={trip.uniqueId}
          />
        ))
      )}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function UserDashboard(props) {
  const navigate = useNavigate();
  const { window } = props;

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const router = useDemoRouter("/dashboard/:userId");
  const demoWindow = window !== undefined ? window() : undefined;

  const NAVIGATION = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: <Typography onClick={() => navigate("/dashboard/:userId")}>Dashboard</Typography>,
      icon: <DashboardIcon style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")} />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Actions",
    },
    {
      segment: "create",
      title: <Typography onClick={handleOpenCreateForm}>Create</Typography>,
      icon: <AddBoxIcon onClick={handleOpenCreateForm} style={{ cursor: "pointer" }} />,
    },
    {
      segment: "join",
      title: <Typography onClick={handleOpenCreateForm}>Join</Typography>,
      icon: <PolylineIcon onClick={handleOpenCreateForm} style={{ cursor: "pointer" }} />,
    },
  ];

  const BRANDING = {
    title: "myExpense",
  };

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme} window={demoWindow} branding={BRANDING}>
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
        <CreateForm open={isCreateFormOpen} onClose={handleCloseCreateForm} />
      </DashboardLayout>
    </AppProvider>
  );
}

UserDashboard.propTypes = {
  window: PropTypes.func,
};

export default UserDashboard;
