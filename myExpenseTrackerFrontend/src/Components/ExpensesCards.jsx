import React, { useEffect, useState, useRef } from "react";
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
  Avatar,
  Container,
   Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import HandymanIcon from "@mui/icons-material/Handyman";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { formatCurrency, sumCurrency } from "../utils/currency";

function ExpensesCards() {
  const [expensesData, setExpensesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const { tripId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const boxRef = useRef(null);

  const deleteExpense = async (tripId, userId, expenseId) => {
    try {
      const response = await fetch(
        `${apiUrl}/expense/removeexpense/${expenseId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId, tripId: tripId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      console.log("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight; // Scroll to bottom
    }
  }, [expensesData]); // Runs when expenses change
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/expense/${tripId}/${currentUserId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
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
            : b.totalExpenses - a.totalExpenses,
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
          total_money: Number(formatCurrency(totalMoney)),
          expenses: expenses.map(({ category, desc, amount, _id, paid }) => ({
            category,
            desc,
            amount: Number(formatCurrency(amount)),
            _id,
            paid,
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
  const copyToClipboard = (
    userId,
    userEmail,
    userName,
    expenses,
    totalAmountUnpaid,
    totalAmount,
  ) => {
    const filteredExpenses =
      userId === currentUserId
        ? expenses.filter((expense) => expense.paid) // Include only paid expenses for current user
        : expenses.filter((expense) => !expense.paid); // Include only unpaid expenses for others

    const tableData = `User: ${userName}
      Email: ${userEmail} 
      Category | Amount | Description
      ${filteredExpenses
        .map(
          (expense) =>
            `${expense.category} | ₹${formatCurrency(expense.amount)} | ${expense.desc}`,
        )
        .join("\n")}
      Total: ₹${formatCurrency(
        userId === currentUserId ? totalAmount : totalAmountUnpaid,
      )}`;

    navigator.clipboard.writeText(tableData);
    setSuccessMessage("Table copied to clipboard!"); // Set success message
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        width: "auto",
      }}
    >
      {successMessage && (
        <Alert
          severity="success"
          sx={{
            position: "fixed",
            top: 70,
            width: "50%",
            zIndex: 100,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Display error alert if error exists */}
      {error && (
        <Alert
          severity="error"
          sx={{
            position: "fixed",
            top: 70,
            width: "50%",
            zIndex: 100,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}
      {sortedExpenses.length > 0 ? (
        sortedExpenses.map(({ userDetails: user, expenses, userId }) => {
          const totalAmount = sumCurrency(expenses.map((expense) => expense.amount));
          const totalAmountUnpaid = sumCurrency(
            expenses
              .filter((expense) => !expense.paid)
              .map((expense) => expense.amount),
          );
          const totalAmountPaid = sumCurrency([totalAmount, -totalAmountUnpaid]);

          return (
            <Card
              key={userId}
              sx={{
                width: { xs: "100%", sm: 352 },
                minWidth: 0,
                maxWidth: "100%",
                boxShadow: "0 10px 28px rgba(36, 78, 120, 0.12)",
                borderRadius: "20px",
                border: userId === currentUserId ? "1px solid #bde5ca" : "1px solid #d7e4ef",
                overflow: "hidden",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                "&::-webkit-scrollbar": {
                  width: "4px", // Width of the vertical scrollbar
                  height: "4px", // Height of the horizontal scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c1c1", // Scrollbar thumb color
                  borderRadius: "4px", // Rounded scrollbar thumb
                  "&:hover": {
                    backgroundColor: "#a0a0a0", // Darker color on hover
                  },
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1", // Scrollbar track color
                  borderRadius: "4px",
                },
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 18px 38px rgba(36, 78, 120, 0.2)",
                },
                background:
                  userId === currentUserId
                    ? "linear-gradient(145deg, #f2fff6, #e6f8ec)"
                    : "linear-gradient(145deg, #ffffff, #f6faff)",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                  <Avatar sx={{ width: 46, height: 46, bgcolor: userId === currentUserId ? "#2d8c55" : "#3c77aa", fontWeight: 800 }}>
                    {(userId === currentUserId ? "You" : user.name || "?").charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: userId === currentUserId ? "#246b42" : "#264653", overflowWrap: "anywhere" }}>
                      {userId === currentUserId ? "Your expenses" : user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Expense breakdown</Typography>
                  </Box>
                  <Chip size="small" label={userId === currentUserId ? "You" : "Member"} sx={{ fontWeight: 700, bgcolor: userId === currentUserId ? "#dff5e6" : "#e8f2fb", color: userId === currentUserId ? "#207440" : "#27628e" }} />
                </Box>
                <Divider sx={{ mb: 2, borderColor: "rgba(102, 140, 174, 0.25)" }} />

                <TableContainer
                  component={Paper}
                  elevation={0}
                  ref={boxRef}
                  sx={{
                    width: "100%",
                    height: { xs: "250px", sm: "250px", md: "300px" }, // Set a fixed height for the table container
                    background: "#ffffff",
                    border: "1px solid #dce8f1",
                    borderRadius: "12px",
                    overflowY: "auto", // Enable scrolling if content exceeds height
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      width: "4px", // Width of the vertical scrollbar
                      height: "4px", // Height of the horizontal scrollbar
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#c1c1c1", // Scrollbar thumb color
                      borderRadius: "4px", // Rounded scrollbar thumb
                      "&:hover": {
                        backgroundColor: "#a0a0a0", // Darker color on hover
                      },
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1", // Scrollbar track color
                      borderRadius: "4px",
                    },
                  }}
                >
                  <Table sx={{ width: "100%", tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#edf5fb" }}>
                        <TableCell align="left" sx={{ px: { xs: 1, sm: 2 }, wordBreak: "break-word", color: "#315d7e" }}>
                          <strong>Category</strong>
                        </TableCell>
                        <TableCell align="left" sx={{ px: { xs: 1, sm: 2 }, wordBreak: "break-word", color: "#315d7e" }}>
                          <strong>Amount</strong>
                        </TableCell>
                        <TableCell align="left" sx={{ px: { xs: 1, sm: 2 }, wordBreak: "break-word", color: "#315d7e" }}>
                          <strong>Description</strong>
                        </TableCell>
                        <TableCell align="center" sx={{ px: { xs: 0.5, sm: 2 }, width: { xs: 38, sm: 56 }, color: "#315d7e" }}>
                          <strong>
                            <HandymanIcon
                              sx={{ height: "20px", width: "20px" }}
                            />
                          </strong>{" "}
                          {/* New Column for Delete */}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense._id} sx={{ "&:hover": { bgcolor: "#f7fbff" }, "&:last-child td": { borderBottom: 0 } }}>
                          <TableCell align="left" sx={{ px: { xs: 1, sm: 2 }, wordBreak: "break-word" }}>{expense.category}</TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              color: expense.paid ? "#1c7d45" : "#bd3030",
                              px: { xs: 1, sm: 2 },
                              wordBreak: "break-word",
                            }}
                          >
                            ₹{formatCurrency(expense.amount)}{" "}
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#555555",
                                fontStyle: "italic",
                                lineHeight: 1.5,
                                flexShrink: 0, // Prevent category text from shrinking
                              }}
                            >
                              {expense.paid ? "(paid)" : "(unpaid)"}
                            </Typography>
                          </TableCell>

                          <TableCell align="left" sx={{ px: { xs: 1, sm: 2 }, wordBreak: "break-word" }}>{expense.desc}</TableCell>
                          <TableCell align="left" sx={{ px: { xs: 0.5, sm: 2 }, width: { xs: 38, sm: 56 } }}>
                            <DeleteIcon
                              onClick={() => {
                                // The expense creator's own share is marked paid immediately,
                                // but they should still be able to remove it.
                                if (!expense.paid || userId === currentUserId) {
                                  setSelectedExpense({ ...expense, userId });
                                  setOpenDeleteDialog(true);
                                }
                              }}
                              sx={{
                                cursor:
                                  expense.paid && userId !== currentUserId
                                    ? "default"
                                    : "pointer",
                                opacity:
                                  expense.paid && userId !== currentUserId ? 0.2 : 1,
                                pointerEvents:
                                  expense.paid && userId !== currentUserId
                                    ? "none"
                                    : "auto",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: userId === currentUserId ? "#e9f8ee" : "#eef6fc",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(70, 126, 166, 0.14)",
                  }}
                >
                  <Typography variant="subtitle1">
                    {userId === currentUserId ? (
                      <strong>Total Spends:</strong>
                    ) : (
                      <strong>Total Paid:</strong>
                    )}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: "bold",
                        color: "green",
                        marginLeft: "8px",
                      }}
                    >
                      ₹{formatCurrency(totalAmountPaid)}
                    </Typography>
                  </Typography>
                  {userId !== currentUserId ? (
                    <Typography variant="subtitle1">
                      <strong>Total Unpaid:</strong>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: "bold",
                          color: "#2a9d8f",
                          marginLeft: "8px",
                        }}
                      >
                        ₹{formatCurrency(totalAmountUnpaid)}
                      </Typography>
                    </Typography>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ fontStyle: "italic", color: "#2a9d8f", textAlign: "center", width: "100%" }}
                    >
                      <strong>* Includes only my contributions</strong>
                    </Typography>
                  )}
                </Box>

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
                      startIcon={<RequestQuoteIcon />}
                      sx={{
                        backgroundColor: "#2175a9",
                        color: "#FFF",
                        fontWeight: "bold",
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "#15547d",
                        },
                      }}
                      variant="contained"
                      onClick={() =>
                        sendRequest(userId, totalAmountUnpaid, expenses)
                      }
                    >
                      Send Request
                    </Button>
                  ) : null}
                  <Button
                    startIcon={<ContentCopyIcon />}
                    sx={{
                      backgroundColor: "#2175a9",
                      color: "#FFF",
                      fontWeight: "bold",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#15547d",
                      },
                    }}
                    variant="contained"
                    onClick={() =>
                      copyToClipboard(
                        userId,
                        user.email,
                        user.name,
                        expenses,
                        totalAmountUnpaid,
                        totalAmount,
                      )
                    }
                  >
                    Copy Expense
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    marginTop: 2,
                    color: "#555",
                    fontStyle: "italic",
                  }}
                >
                  * After creating expense, click on 'Send Request'
                </Typography>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "320px",
            textAlign: "center",
            padding: 3,
            background: "linear-gradient(135deg, #5e76f5, #7b61ff)",
            width: "100%",
            borderRadius: 3,
            mx: -3,
            px: 3,
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "100%" }}>
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.18)",
                color: "#fff",
                width: 68,
                height: 68,
              }}
            >
              <InsertChartOutlinedIcon sx={{ fontSize: 34 }} />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              Hi Traveller,
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.92)",
                maxWidth: 460,
              }}
            >
              Your trip is ready to be tracked. Add your first expense to start splitting costs and see who owes what.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.72)",
                maxWidth: 520,
              }}
            >
              Tap the floating action button in the bottom corner to create an expense, then use the request feature to collect payments.
            </Typography>
          </Box>
        </Box>
      )}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense?
            <br />
            <strong>{selectedExpense?.desc || "This item"}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (!selectedExpense) return;

              await deleteExpense(
                tripId,
                selectedExpense.userId,
                selectedExpense._id,
              );

              setOpenDeleteDialog(false);
              setSelectedExpense(null);

              window.location.reload();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExpensesCards;
