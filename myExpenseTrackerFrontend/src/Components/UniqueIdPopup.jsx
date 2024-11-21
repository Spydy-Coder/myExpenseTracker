import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

export default function UniqueIdPopup({ open, onClose, uniqueId }) {
  const [tooltipText, setTooltipText] = useState("Copy");

  const handleCopy = () => {
    navigator.clipboard.writeText(uniqueId);
    setTooltipText("Copied!");
    setTimeout(() => setTooltipText("Copy"), 2000); // Reset tooltip after 2 seconds
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Your Unique Trip ID</DialogTitle>
      <DialogContent>
        <TextField
          value={uniqueId}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Tooltip title={tooltipText}>
                <IconButton onClick={handleCopy}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            ),
          }}
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
