import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthProvider";
import ProtectedRoute from "./Auth/ProtectedRoute ";
import UserDashboard from "./Pages/UserDashboard";
import "./App.css";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import HomePage from "./Pages/HomePage";
import DashboardContent from "./Components/DashboardContent";
import TripContent from "./Components/TripContent";
import ExpenseRequest from "./Components/ExpenseRequest";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const theme = createTheme({
  palette: {
    mode: "light", // Use "dark" here if you want a dark theme
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* <Route
            path="/dashboard/:userId"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          /> */}

            {/* Dashboard Layout */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              {/* Nested Routes */}
              <Route path=":userId" element={<DashboardContent />} />
              <Route path="trip/:tripId" element={<TripContent />} />
              <Route path="expenserequest" element={<ExpenseRequest />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
