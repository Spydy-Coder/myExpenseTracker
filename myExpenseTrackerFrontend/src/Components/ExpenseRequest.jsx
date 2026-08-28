import { useCallback, useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Button,
  Tooltip,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { grey, red, green, blue } from "@mui/material/colors";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import QrCodeHolder from "./QrCodeHolder";
import { formatCurrency } from "../utils/currency";

function ExpenseRequest() {
  const userId = localStorage.getItem("userId");
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [tooltipText, setTooltipText] = useState("Copy");
  const boxRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight; // Scroll to bottom
    }
  }, [expenseRequests]); // Runs when expenses change

  const handleCopy = (upiid) => {
    navigator.clipboard.writeText(upiid);
    setTooltipText("Copied!");
    setTimeout(() => setTooltipText("Copy"), 2000); // Reset tooltip after 2 seconds
  };

  const fetchExpenseRequests = useCallback(async () => {
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
  }, [apiUrl, userId]);

  const paymentUpiLink = (upiId, amount) => {
    const params = new URLSearchParams({
      pa: upiId.trim(),
      am: Number(amount).toFixed(2),
    });

    return `upi://pay?${params.toString()}`;
  };

  const pendingRequests = expenseRequests.filter(
    (request) => !request.expenses.every((expense) => expense.paid)
  );
  const settledRequests = expenseRequests.filter((request) =>
    request.expenses.every((expense) => expense.paid)
  );
  const visibleRequests = activeTab === 0 ? pendingRequests : settledRequests;

  useEffect(() => {
    fetchExpenseRequests();
  }, [fetchExpenseRequests]);

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
        width: "100%",
        minWidth: 0,
        p: { xs: 1, sm: 3 },
        background: "radial-gradient(circle at top, #e9f4ff 0%, #f7faff 42%, #ffffff 100%)",
      }}
    >
      <Box sx={{ width: "100%", textAlign: "center", mb: { xs: 0, sm: 1 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: "primary.main",
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 2,
          }}
        >
          Payment requests
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Review balances, settle up, and keep every trip on track.
        </Typography>
      </Box>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 42,
            "& .MuiTab-root": {
              minHeight: 42,
              textTransform: "none",
              fontWeight: 800,
              px: 2.5,
            },
          }}
        >
          <Tab label={`Pending (${pendingRequests.length})`} />
          <Tab label={`History (${settledRequests.length})`} />
        </Tabs>
      </Box>

      {visibleRequests.length === 0 && (
        <Box sx={{ mt: 4, py: 5, px: 3, width: "100%", maxWidth: 440, textAlign: "center", bgcolor: "rgba(255,255,255,0.8)", border: "1px dashed #a9c8e5", borderRadius: 4 }}>
          <AccountBalanceWalletOutlinedIcon color="primary" sx={{ fontSize: 42, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {activeTab === 0 ? "No pending requests" : "No settled requests yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0
              ? "You're all caught up for now."
              : "Settled requests will appear here."}
          </Typography>
        </Box>
      )}
      {visibleRequests.map((request) => {
        const isSettled = request.expenses.every((expense) => expense.paid);
        const isPending = !isSettled;
        const balance = Number(request.money_left);
        const paymentAmount = balance < 0
          ? Math.abs(balance)
          : Number(request.total_money);
        const canPay =
          isPending &&
          balance <= 0 &&
          Boolean(request.payee?.upiId) &&
          paymentAmount > 0;

        return (
          <Card
            key={request.trip_id}
            sx={{
              width: { xs: "100%", sm: 350 },
              minWidth: 0,
              maxWidth: "100%",
              minHeight: 530,
              height: "auto",
              boxShadow: "0 10px 28px rgba(36, 78, 120, 0.12)",
              borderRadius: "20px",
              border: "1px solid #b8cce0",
              overflow: "hidden",
              background: "linear-gradient(135deg, #ffffff, #f0f4ff)",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 18px 38px rgba(36, 78, 120, 0.2)",
              },
            }}
          >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              minWidth: 0,
              p: { xs: 2, sm: 3 },
            }}
            >
            {/* Trip ID and Payee */}
            <Box sx={{ p: 2, mb: 2, borderRadius: 3, background: "linear-gradient(135deg, #e9f5ff, #f1edff)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1.5 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: "#52708f", letterSpacing: 0.8, fontWeight: 800 }}>
                    TRIP BALANCE
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: blue[900], overflowWrap: "anywhere", lineHeight: 1.25 }}>
                    {request.trip_id}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={isSettled ? "Settled" : "Pending"}
                  sx={{
                    bgcolor: isSettled ? green[100] : red[100],
                    color: isSettled ? green[800] : red[800],
                    fontWeight: 800,
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: grey[700],
                  overflowWrap: "anywhere",
                }}
              >
                Payee <strong>{request.payee.username}</strong>
              </Typography>
              {request.payee.upiId && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: grey[700],
                      overflowWrap: "anywhere",
                    }}
                  >
                    <strong>UPI ID:</strong> {request.payee.upiId}
                  </Typography>
                  <Tooltip title={tooltipText}>
                    <IconButton onClick={() => handleCopy(request.payee.upiId)}>
                      <ContentCopyIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Expense Details */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, p: 1.25, borderRadius: 2, bgcolor: "#fff4f4", color: red[800] }}>
                <strong>To be Sent:</strong> ₹{formatCurrency(request.total_money)}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1, p: 1.25, borderRadius: 2, bgcolor: "#f0faf4", color: green[800] }}>
                <strong>To be Received:</strong> ₹{formatCurrency(request.moneyToBeReceive)}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  fontWeight: 900,
                  color: request.money_left > 0 ? green[800] : "#bd5b12",
                  mb: 0,
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: request.money_left > 0 ? "#effaf4" : "#fff5ed",
                }}
              >
                {request.money_left > 0
                  ? "You will receive"
                  : "You will have to send"}{" "}
                ₹{formatCurrency(Math.abs(request.money_left))}
              </Typography>
            </Box>

            {/* Expenses List */}
            <Box
              ref={boxRef}
              sx={{
                maxHeight: "132px",
                overflowY: "auto",
                mb: 2,
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c1c1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                  borderRadius: "4px",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
                <ReceiptLongOutlinedIcon fontSize="small" color="primary" />
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#416887", letterSpacing: 0.6 }}>EXPENSE BREAKDOWN</Typography>
              </Box>
              {request.expenses.map((expense, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: grey[600],
                    mb: 0.75,
                    px: 1,
                    py: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: expense.paid ? "#f2fbf5" : "#fff8f8",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    justifyContent: "space-between",
                    overflowWrap: "anywhere",
                  }}
                >
                  - {expense.category}: ₹{formatCurrency(expense.amount)} ({expense.desc})
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

            {/* Mark as Paid and Pay Buttons */}
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {isPending && (
                  <Button
                    variant="contained"
                    color="success"
                      sx={{ borderRadius: 2, px: 2, fontWeight: 700, boxShadow: "none" }}
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
                )}
                {canPay && (
                  <QrCodeHolder
                    upiLink={paymentUpiLink(
                      request.payee.upiId,
                      paymentAmount,
                    )}
                    upiId={request.payee.upiId}
                    upiPhoneNumber={request.payee.upiPhoneNumber}
                    amount={formatCurrency(paymentAmount)}
                  />
                )}
              </Box>

              {isPending && (
                <>
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
                    * Click Mark as Paid after you&apos;ve paid or received the amount.
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default ExpenseRequest;
