import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { grey } from "@mui/material/colors";

function ExpenseRequest() {
  const userId = localStorage.getItem("userId");
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch expense requests on component mount
  useEffect(() => {
    const fetchExpenseRequests = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/expense/requests/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setExpenseRequests(result.data); // Assuming the backend sends data in `result.data`
        console.log(result.data);
      } catch (err) {
        setError("Failed to fetch expense requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseRequests();
  }, [userId]);

  // Render a loading spinner while data is being fetched
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
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  // Render an error message if data fetching fails
  if (error) {
    return (
      <Typography
        color="error"
        sx={{
          textAlign: "center",
          mt: 3,
          fontWeight: "bold",
        }}
      >
        {error}
      </Typography>
    );
  }

  // Render cards for each trip
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        alignItems: "flex-start",
        p: 3,
      }}
    >
      {expenseRequests.map((request) => (
        <Card
          key={request.trip_id}
          sx={{
            minWidth: 300,
            maxWidth: 400,
            boxShadow: 6,
            borderRadius: "16px",
            overflow: "hidden",
            // backgroundColor: grey[50],
            //  background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
            // background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
            background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",

            transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 20,
            },
            p: 2,
          }}
        >
          <CardContent>
            {/* Trip ID Heading */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 50,
                  height: 50,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {request.trip_id.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#264653",
                textAlign: "center",
                mb: 1,
              }}
            >
              Trip ID: {request.trip_id}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#264653",
                textAlign: "center",
                mb: 2,
              }}
            >
              Payee: {request.payee.username}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Total Money */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Total Money:</strong> ₹{request.total_money}
            </Typography>

            {/* Expenses Details */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Expenses:</strong>
            </Typography>
            {request.expenses.map((expense, index) => (
              <Box
                key={index}
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555555",
                    fontWeight: "bold",
                    lineHeight: 1.5,
                    flexShrink: 0, // Prevent category text from shrinking
                  }}
                >
                  - {expense.category}: ₹{expense.amount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#777777",
                    fontStyle: "italic",
                    flexGrow: 1, // Allow description text to take up remaining space
                  }}
                >
                  ({expense.desc})
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default ExpenseRequest;
