import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { formatCurrency, sumCurrency } from "../utils/currency";

function ExpensePopup({ tripId, userId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchExpenses = async () => {
    if (!open) return; // Only fetch if the dialog is open
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiUrl}/expense/totalexpense/${tripId}/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setExpenses(data.data.expenses || []);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [open]);

  // Calculate totals
  const totalPerCategory = expenses?.reduce((acc, expense) => {
    acc[expense.category] = sumCurrency([
      acc[expense.category] || 0,
      expense.amount,
    ]);
    return acc;
  }, {});

  const totalSpent = sumCurrency(expenses.map((expense) => expense.amount));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          width: "calc(100% - 48px)",
          maxHeight: { xs: "92vh", sm: "84vh" },
          borderRadius: { xs: 2, sm: 4 },
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2.25, color: "#fff", background: "linear-gradient(115deg, #124a78, #167d9b)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box sx={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 2, bgcolor: "rgba(255,255,255,0.18)" }}>
            <ReceiptLongOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Expense Details</Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>Your trip spending overview</Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3.5 }, background: "#f8fbff" }}>
        {loading ? (
          <Box sx={{ textAlign: "center", my: 6 }}>
            <CircularProgress size={44} />
            <Typography sx={{ mt: 1.5 }} color="text.secondary">Loading expenses...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        ) : expenses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <ReceiptLongOutlinedIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>No expenses yet</Typography>
            <Typography color="text.secondary">Add an expense to see the trip summary here.</Typography>
          </Box>
        ) : (
          <>
            {/* Total Spent */}
            <Box sx={{ mt: 0.5, mb: 3, px: { xs: 2, sm: 3 }, py: 2.5, textAlign: "center", borderRadius: 3, background: "linear-gradient(135deg, #0b5f93, #35a99d)", boxShadow: "0 10px 22px rgba(15, 113, 143, 0.2)" }}>
              <Typography variant="caption" sx={{ display: "block", color: "rgba(255,255,255,0.8)", fontWeight: 800, letterSpacing: 1, lineHeight: 1.3 }}>TOTAL TRIP SPENT</Typography>
              <Typography variant="h4" sx={{ display: "block", fontWeight: 900, mt: 1, color: "white", fontSize: { xs: "1.55rem", sm: "2.125rem" }, lineHeight: 1.15 }}>
                ₹{formatCurrency(totalSpent)}
              </Typography>
            </Box>

            {/* Category Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800, color: "#234b6d", mb: 1.25 }}>
                <CategoryOutlinedIcon color="primary" /> Spent per category
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 14px rgba(29, 76, 117, 0.08)", overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e8f3fd" }}>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Amount</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(totalPerCategory || {}).map(
                      ([category, total]) => (
                        <TableRow key={category} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                          <TableCell>{category}</TableCell>
                          <TableCell align="right">₹{formatCurrency(total)}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Detailed Expense List */}
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800, color: "#234b6d", mb: 1.25 }}>
              <ReceiptLongOutlinedIcon color="primary" /> All expenses
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 14px rgba(29, 76, 117, 0.08)", overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 640 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#e8f3fd" }}>
                    <TableCell>
                      <strong>Category</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Added by</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense._id} sx={{ "&:hover": { backgroundColor: "#f5faff" }, "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell align="right">₹{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{expense.desc}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 26, height: 26, bgcolor: "primary.light", fontSize: "0.75rem" }}>
                            {(String(expense.issued_by?._id) === userId ? "Self" : expense.issued_by?.username || "?").charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {String(expense.issued_by?._id) === userId
                              ? "Self"
                              : expense.issued_by?.username || "Unknown"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={expense.paid ? "Paid" : "Unpaid"}
                          sx={{ fontWeight: 800, bgcolor: expense.paid ? "#e8f7ef" : "#fff0f0", color: expense.paid ? "#19703b" : "#bd3030" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3.5 }, py: 2, borderTop: "1px solid #e6eef5" }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, boxShadow: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExpensePopup;

ExpensePopup.propTypes = {
  tripId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
