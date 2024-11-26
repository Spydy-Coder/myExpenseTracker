import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";

function ExpensesCards() {
  const [expensesData, setExpensesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const { tripId } = useParams();
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/expense/get/${tripId}/${currentUserId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setExpensesData(result.data);
      } catch (err) {
        setError("Failed to fetch expenses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [tripId, currentUserId]);

  // Clear alerts after 4 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 4000); // Set the timeout to 4 seconds
      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when message changes
    }
  }, [successMessage, error]);

  // Sort expenses by the size of table data
  const sortExpensesBySize = (expensesData) => {
    return Object.keys(expensesData)
      .map((userId) => ({
        ...expensesData[userId],
        userId,
        totalExpenses: expensesData[userId].expenses.length,
      }))
      .sort((a, b) =>
        a.userId === currentUserId
          ? -1
          : b.userId === currentUserId
          ? 1
          : b.totalExpenses - a.totalExpenses
      );
  };

  // Send Request to store data in the database
  const sendRequest = async (userId, totalMoney, expenses) => {
    try {
      const response = await fetch("http://localhost:5000/expense/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: tripId,
          user_id: userId,
          total_money: totalMoney,
          expenses: expenses.map(({ category, desc, amount }) => ({
            category,
            desc,
            amount,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setSuccessMessage("Request sent successfully!"); // Set success message
    } catch (err) {
      setError("Failed to send request.");
      console.error(err);
    }
  };

  const copyToClipboard = (userEmail, expenses, totalAmount) => {
    const tableData = `User: ${userEmail}
Category | Amount | Description
${expenses
  .map(
    (expense) => `${expense.category} | ₹${expense.amount} | ${expense.desc}`
  )
  .join("\n")}
Total: ₹${totalAmount}`;

    navigator.clipboard.writeText(tableData);
    setSuccessMessage("Table copied to clipboard!"); // Set success message
  };

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

  if (error) {
    return (
      <Typography
        color="error"
        sx={{
          textAlign: "center",
          mt: 3,
        }}
      >
        {error}
      </Typography>
    );
  }

  const sortedExpenses = sortExpensesBySize(expensesData);

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
      {/* Display success alert if message is set */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ position: "absolute", top: 20, width: "100%", zIndex: 1 }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Display error alert if error exists */}
      {error && (
        <Alert
          severity="error"
          sx={{ position: "absolute", top: 20, width: "100%", zIndex: 1 }}
        >
          {error}
        </Alert>
      )}

      {sortedExpenses.map(({ userDetails: user, expenses, userId }) => {
        const totalAmount = expenses.reduce(
          (acc, expense) => acc + expense.amount,
          0
        );

        return (
          <Card
            key={userId}
            sx={{
              minWidth: 400,
              maxWidth: "100%",
              boxShadow: 6,
              borderRadius: "16px",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 10,
              },
              background:
                userId === currentUserId
                  ? "linear-gradient(145deg, #d4fc79, #96e6a1)"
                  : "#ffffff",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: userId === currentUserId ? "#2d6a4f" : "#264653",
                  textAlign: "center",
                }}
              >
                {userId === currentUserId ? "Your Expenses" : user.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mb: 2 }}
              >
                {user.email}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                      <TableCell align="left">
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell align="left">
                        <strong>Amount</strong>
                      </TableCell>
                      <TableCell align="left">
                        <strong>Description</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense._id}>
                        <TableCell align="left">{expense.category}</TableCell>
                        <TableCell align="left">₹{expense.amount}</TableCell>
                        <TableCell align="left">{expense.desc}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell align="left" colSpan={2}>
                        <Typography variant="subtitle1">
                          <strong>Total</strong>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color: "#2a9d8f",
                          }}
                        >
                          ₹{totalAmount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {userId !== currentUserId ? (
                  <Button
                    sx={{
                      backgroundColor: "#219ebc",
                      color: "#FFF",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#126782",
                      },
                    }}
                    variant="contained"
                    onClick={() => sendRequest(userId, totalAmount, expenses)}
                  >
                    Send Request
                  </Button>
                ) : null}

                <Button
                  sx={{
                    backgroundColor: "#219ebc",
                    color: "#FFF",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#126782",
                    },
                  }}
                  variant="contained"
                  onClick={() => copyToClipboard(user.email, expenses, totalAmount)}
                >
                  Copy Table
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default ExpensesCards;
