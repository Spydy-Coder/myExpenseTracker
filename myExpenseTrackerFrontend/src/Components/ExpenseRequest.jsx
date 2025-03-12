import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Button,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import { grey, red, green, blue, purple } from "@mui/material/colors";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCodeHolder from "./QrCodeHolder";

function ExpenseRequest() {
  const userId = localStorage.getItem("userId");
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [tooltipText, setTooltipText] = useState("Copy");
  const color = purple[300];

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;

  const handleCopy = (upiid) => {
    navigator.clipboard.writeText(upiid);
    setTooltipText("Copied!");
    setTimeout(() => setTooltipText("Copy"), 2000); // Reset tooltip after 2 seconds
  };

  const fetchExpenseRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/expense/requests/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setExpenseRequests(result.data);
    } catch (err) {
      setError("Failed to fetch expense requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paymentUpiLink = (upiId, amount, username) => {
    return `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Expense SettleMent for ${username}`;
  };

  const handlePaymentUpi = (upiId, amount, username) => {
    // Construct the UPI deep link
    const upiLink = paymentUpiLink(upiId, amount, username);

    // Open the UPI app (if it's installed on the user's device)

    console.log(upiLink);
    window.location.href = upiLink;
  };

  useEffect(() => {
    fetchExpenseRequests();
  }, [userId]);

  const handleMarkAsPaid = async (tripId, payee, expenses) => {
    const currentUserId = localStorage.getItem("userId");

    try {
      const response = await fetch(`${apiUrl}/expense/markAllPaid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId,
          trip_id: tripId,
          payee,
          expenses: expenses.map((expense) => ({
            ...expense,
            paid: true,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchExpenseRequests();
    } catch (err) {
      setError("Failed to mark expenses as paid.");
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
        <CircularProgress color="primary" size={60} />
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
          fontWeight: "bold",
        }}
      >
        {error}
      </Typography>
    );
  }

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
            width: 320,
            height: 500, // Fixed card height
            boxShadow: 8,
            borderRadius: "16px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #f0f4ff, #e1e7ff)",
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 20,
            },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            {/* Payment Status */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
                backgroundColor: request.expenses.every(
                  (expense) => expense.paid
                )
                  ? green[100]
                  : red[100],
                color: request.expenses.every((expense) => expense.paid)
                  ? green[800]
                  : red[800],
                padding: "4px 8px",
                borderRadius: "16px",
                fontWeight: "bold",
              }}
            >
              {request.expenses.every((expense) => expense.paid)
                ? "Fully Paid"
                : "Not Fully Paid"}
            </Box>

            {/* Trip ID and Payee */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                color: blue[800],
                mb: 1,
              }}
            >
              Trip ID: {request.trip_id}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                color: grey[700],
              }}
            >
              <strong>Payee:</strong> {request.payee.username}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                color: grey[700],
                mb: 2,
              }}
            >
              <strong>UPI ID:</strong>{" "}
              {request.payee.upiId === ""
                ? "Not Available"
                : request.payee.upiId}{" "}
              <Tooltip title={tooltipText}>
                <IconButton onClick={() => handleCopy(request.payee.upiId)}>
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <Divider />
            {/* <UPIQRCodeGenerator/> */}
            <Divider sx={{ mb: 2 }} />

            {/* Expense Details */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>To be Sent:</strong> ₹{request.total_money}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>To be Received:</strong> ₹{request.moneyToBeReceive}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: grey[800],
                mb: 2,
              }}
            >
              {request.money_left > 0
                ? "You will receive"
                : "You will have to send"}{" "}
              ₹{Math.abs(request.money_left)}
            </Typography>

            {/* Expenses List */}
            <Box
              sx={{
                maxHeight: "150px",
                overflowY: "auto",
                mb: 2,
                pr: 1,
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
              {request.expenses.map((expense, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: grey[600],
                    mb: 0.5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  - {expense.category}: ₹{expense.amount} ({expense.desc})
                  <span
                    style={{
                      color: expense.paid ? green[600] : red[600],
                      fontWeight: "bold",
                    }}
                  >
                    {expense.paid ? "Paid" : "Unpaid"}
                  </span>
                </Typography>
              ))}
            </Box>

            {/* Mark as Paid Button */}
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    handleMarkAsPaid(
                      request.trip_id,
                      request.payee,
                      request.expenses
                    )
                  }
                >
                  Mark as Paid
                </Button>
                {request.money_left >= 0 ? null : isMobile || isTablet ? (
                  <Button
                    variant="contained"
                    onClick={() =>
                      handlePaymentUpi(
                        request.payee.upiId,
                        Math.abs(request.money_left),
                        request.payee.username
                      )
                    }
                    sx={{ mr: 2, backgroundColor: purple[300] }}
                  >
                    Pay
                  </Button>
                ) : (
                  <QrCodeHolder
                    upiLink={paymentUpiLink(
                      request.payee.upiId,
                      Math.abs(request.money_left),
                      request.payee.username
                    )}
                  />
                )}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: grey[700],
                  mt: 1,
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                * Click this button after you've paid or received the amount.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default ExpenseRequest;
