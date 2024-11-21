import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import CreateForm from "../Components/CreateForm";

import AddBoxIcon from '@mui/icons-material/AddBox';
import PolylineIcon from '@mui/icons-material/Polyline';
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import TripCard from "../Components/TripCard"; // Assuming you have TripCard in Components folder


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
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard content for {pathname}
      </Typography>
      
      {/* Include the TripCard here */}
      
      <TripCard
      photo="https://media.istockphoto.com/id/996724730/vector/pattern.jpg?s=2048x2048&w=is&k=20&c=o_2ZRF4ALdLPsiMXit5yAh3QUHemDYZVS5EHLh3O2XE="
      tripName="Beach Paradise"
      description="Relax and unwind at the serene beach."
      date="1st Jan 2025"
      codeToCopy={`jhlkkjl`}
    />

    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function UserDashboard(props) {
  const navigate = useNavigate();
  const { window } = props;

  const [isCreateFormOpen, setIsCreateFormOpen] = React.useState(false);

  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;

  const NAVIGATION = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: <Typography onClick={()=> navigate("/dashboard")}>Dashboard</Typography>,
      icon: <DashboardIcon style={{ cursor: "pointer" }} onClick={()=> navigate("/dashboard")}/>,
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
      icon: (
        <AddBoxIcon
          onClick={handleOpenCreateForm}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      segment: "join",
      title: <Typography onClick={handleOpenCreateForm}>Join</Typography>,
      icon: (
        <PolylineIcon
          onClick={handleOpenCreateForm}
          style={{ cursor: "pointer" }}
        />
      ),
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
