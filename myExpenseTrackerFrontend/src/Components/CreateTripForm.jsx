import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import UniqueIdPopup from "./UniqueIdPopup";
import { useState } from "react";

const DEFAULT_TRIP_PHOTO =
  "https://www.shutterstock.com/shutterstock/photos/1247506609/display_1500/stock-vector-cabriolet-car-with-people-diverse-group-of-men-and-women-enjoy-ride-and-music-happy-young-friends-1247506609.jpg";

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CreateTripForm({ open, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [openUnique, setOpenUnique] = useState(false);
  const [uniqueId, setUniqueId] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedPhoto("");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setSelectedPhoto(compressed);
    } catch (error) {
      console.error("Error compressing image:", error);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("userId"); // Retrieve the user ID from storage or context
    if (!userId) {
      console.error("User not authenticated. Please log in.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Add the user ID, unique ID, and selected date to the form data
    formJson.createdBy = userId;
    formJson.date = selectedDate ? selectedDate.toISOString() : null; // Convert to ISO format for consistency
    formJson.photo = selectedPhoto || DEFAULT_TRIP_PHOTO;

    try {
      const response = await fetch(`${apiUrl}/trip/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formJson),
      });

      if (response.ok) {
        const responseBody = await response.json();
        console.log("Trip created successfully with ID:", responseBody.uniqueId);

        // Set the unique ID and open the unique popup
        setUniqueId(responseBody.uniqueId);
        setTimeout(() => {
          setOpenUnique(true); // Open the Unique ID popup after setting the ID
        }, 500);

        onClose(); // Close the dialog
      } else {
        console.error("Failed to create trip.");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <>
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
            Effortlessly track and split trip expenses with friends, ensuring
            fair shares and stress-free memories.
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
            sx={{ mb: 4 }}
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

          <TextField
            margin="dense"
            name="photo"
            label="Trip Photo"
            type="file"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/*" }}
            onChange={handlePhotoChange}
            sx={{ mb: 2 }}
          />

          {selectedPhoto && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <img
                src={selectedPhoto}
                alt="Trip preview"
                style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                color: "error.main",
              },
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create Trip
          </Button>
        </DialogActions>
      </Dialog>
      <UniqueIdPopup
        open={openUnique}
        onClose={() => setOpenUnique(false)}
        uniqueId={uniqueId}
      />
    </>
  );
}
