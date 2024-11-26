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
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

function ExpensesCards() {
  const [expensesData, setExpensesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { tripId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/expense/${tripId}/${currentUserId}`,
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

  // Sort expenses by the size of table data
  const sortExpensesBySize = (expensesData) => {
    return Object.keys(expensesData)
      .map((index) => ({
        ...expensesData[index],
        userId: expensesData[index].userDetails.id,
        totalExpenses: expensesData[index].expenses.length,
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
      const response = await fetch(`${apiUrl}/expense/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: tripId,
          user_id: userId,
          payee: currentUserId,
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

      alert("Request sent successfully!");
    } catch (err) {
      alert("Failed to send request.");
      console.error(err);
    }
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

  const copyToClipboard = (userEmail, userName, expenses, totalAmount) => {
    const tableData = `User: ${userName}
Email: ${userEmail} 
Category | Amount | Description
${expenses
  .map(
    (expense) => `${expense.category} | ₹${expense.amount} | ${expense.desc}`
  )
  .join("\n")}
Total: ₹${totalAmount}`;

    navigator.clipboard.writeText(tableData);
    alert("Table copied to clipboard!");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        alignItems: "center",
        height:'auto',
        width:"auto",
        p: 3,
      }}
    >
      { sortedExpenses.length>0 ? sortedExpenses.map(({ userDetails: user, expenses, userId }) => {
        const totalAmount = expenses.reduce(
          (acc, expense) => acc + expense.amount,
          0
        );

        return (
          <Card
            key={userId}
            sx={{
              minWidth: 300,
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
                {" "}
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
                  onClick={() =>
                    copyToClipboard(
                      user.email,
                      user.name,
                      expenses,
                      totalAmount
                    )
                  }
                >
                  Copy Expense
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      }) : <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        textAlign: 'center',
        padding: 2,
        background: 'linear-gradient(135deg, #6e7aee, #ad79f5)',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Box sx={{ marginRight: 2 }}>
        <InsertChartOutlinedIcon sx={{ fontSize: 50, color: '#fff' }} />
      </Box>
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 600,
            mb: 1,
          }}
        >
          Hi Traveller
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            opacity: 0.8,
          }}
        >
          No expenses have been created yet.
        </Typography>
      </Box>
    </Box>}
    </Box>
  );
}

export default ExpensesCards;
