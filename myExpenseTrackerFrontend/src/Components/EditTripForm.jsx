import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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

export default function EditTripForm({ open, onClose, tripId, onTripUpdated }) {
  const [tripName, setTripName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTrip = async () => {
      if (!open || !tripId || !apiUrl) return;

      try {
        const response = await fetch(`${apiUrl}/trip/details/${tripId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch trip: ${response.status}`);
        }

        const trip = await response.json();
        console.log("Fetched trip for edit:", trip);
        setTripName(trip.tripName || "");
        setDesc(trip.desc || "");
        setSelectedDate(trip.date ? dayjs(trip.date) : null);
        setSelectedPhoto(trip.photo || DEFAULT_TRIP_PHOTO);
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };

    fetchTrip();
  }, [open, tripId, apiUrl]);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    if (!tripId) return;

    setLoading(true);

    const payload = {
      tripName,
      desc,
      date: selectedDate ? selectedDate.toISOString() : null,
      photo: selectedPhoto || DEFAULT_TRIP_PHOTO,
    };

    console.log("Submitting trip update:", payload);

    try {
      const response = await fetch(`${apiUrl}/trip/update/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Update response status:", response.status);
      const responseText = await response.text();
      console.log("Update response body:", responseText);

      if (!response.ok) {
        throw new Error(`Failed to update trip: ${response.status} - ${responseText}`);
      }

      const updatedTrip = responseText ? JSON.parse(responseText) : null;
      onTripUpdated?.(updatedTrip?.trip);
      onClose();
    } catch (error) {
      console.error("Error updating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Trip</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="edit-trip-form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2, mt: 1 }}
        >
          <TextField
            label="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Trip Date"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <TextField
            label="Trip Photo"
            type="file"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/*" }}
            onChange={handlePhotoChange}
          />

          {selectedPhoto && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={selectedPhoto}
                alt="Trip preview"
                style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button type="submit" form="edit-trip-form" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
