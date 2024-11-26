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
import CreateTripForm from "../Components/CreateTripForm";
import TripCard from "../Components/TripCard"; // Ensure this is correctly imported
import SplitExpenseForm from "../Components/SplitExpenseForm";
import {useAuth} from "../Auth/AuthProvider"
import LogoutIcon from '@mui/icons-material/Logout';
import JoinTrip from "../Components/JoinTrip"
import { Link, Outlet } from "react-router-dom";
import RequestPageIcon from '@mui/icons-material/RequestPage';
import RefreshIcon from '@mui/icons-material/Refresh';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});


function UserDashboard(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { window } = props;
  const userId = localStorage.getItem("userId");

  const [isCreateTripFormOpen, setIsCreateTripFormOpen] = useState(false);
  const [isJoinTripFormOpen, setIsJoinTripFormOpen] = useState(false);
  const handleRefresh = async () => {
    navigate(0);
  };

  const handleOpenCreateTripForm = () => {
    setIsCreateTripFormOpen(true);
  };
  const handleCloseChipForm = () => {
    setIsJoinTripFormOpen(false);
  };
  const handleOpenJoinTripForm = () => {
    setIsJoinTripFormOpen(true);
  };
  const handleCloseCreateTripForm = () => {
    setIsCreateTripFormOpen(false);
  };
  const handleLogout = () => {
    logout();
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
      title: (
        <Typography onClick={() => navigate(`/dashboard/${userId}`)}>
          Dashboard
        </Typography>
      ),
      icon: (
        <DashboardIcon
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/dashboard/${userId}`)}
        />
      ),
    },
    {
      segment: "expenserequest",
      title: (
        <Typography onClick={() => navigate(`expenserequest`)}>
          Requests
        </Typography>
      ),
      icon: (
        <RequestPageIcon
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`expenserequest`)}
        />
      ),
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
      title: <Typography onClick={handleOpenCreateTripForm}>Create</Typography>,
      icon: (
        <AddBoxIcon
          onClick={handleOpenCreateTripForm}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      segment: "join",
      title: <Typography onClick={handleOpenJoinTripForm}>Join</Typography>,
      icon: (
        <PolylineIcon
          onClick={handleOpenJoinTripForm}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      segment: "refresh",
      title: <Typography onClick={handleRefresh}>Refresh</Typography>,
      icon: (
        <RefreshIcon
        onClick={handleRefresh}
        style={{ cursor: "pointer" }}
      />
      ),
    },
    {
      kind: "divider",
    },
    {
      segment: "logout",
      title: <Typography onClick={handleLogout}>Logout</Typography>,
      icon: <LogoutIcon onClick={handleLogout} style={{ cursor: "pointer" }} />,
    },
    
  ];

  const BRANDING = {
    title: "myExpense",
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={BRANDING}
    >
      <DashboardLayout>
        {/* Dynamic Content Rendered Here */}
        <Outlet />
        <CreateTripForm open={isCreateTripFormOpen} onClose={handleCloseCreateTripForm} />
        <JoinTrip open={isJoinTripFormOpen} onClose={handleCloseChipForm} />
      </DashboardLayout>
    </AppProvider>
  );
}

UserDashboard.propTypes = {
  window: PropTypes.func,
};

export default UserDashboard;
