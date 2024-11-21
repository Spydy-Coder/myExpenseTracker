import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import { nanoid } from "nanoid";
import UniqueIdPopup from "../Components/UniqueIdPopup";
import { useState } from "react";

export default function CreateForm({ open, onClose }) {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [openUnique, setOpenUnique] = useState(false);
  const [uniqueId, setUniqueId] = useState("");

  const handleGenerateId = () => {
    const id = nanoid(8); // Generate an 8-character unique ID
    setUniqueId(id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleGenerateId();
    console.log(uniqueId);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Add the unique ID and selected date to the form data
    formJson.date = selectedDate;
    formJson.uniqueId = uniqueId;
    

    try {
      const response = await fetch("http://localhost:5000/trip/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formJson),
      });

      if (response.ok) {
        console.log("Trip created successfully with ID:", uniqueId);
        setOpenUnique(true);
        onClose(); // Close the dialog
       
      } else {
        console.error("Failed to create trip.");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit, // Submit handler
      }}
    >
      <DialogTitle>Create a New Trip</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Effortlessly track and split trip expenses with friends, ensuring fair
          shares and stress-free memories.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="tripName"
          name="tripName"
          label="Trip Name"
          type="text"
          fullWidth
          variant="standard"
        />
        <TextField
          required
          margin="dense"
          id="desc"
          name="desc"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          sx={{ mb: 4 }} // Add spacing
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select a date"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="standard"
                sx={{ mb: 2 }}
              />
            )}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)", // Keep hover effect subtle
              color: "error.main", // Ensure consistent color
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
         
        >
          Create Trip
        </Button>
      </DialogActions>
      <UniqueIdPopup open={openUnique} onClose={() => setOpenUnique(false)} uniqueId={uniqueId} />
    </Dialog>
  );
}
