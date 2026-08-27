import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import TripCard from "./TripCard";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const DEFAULT_TRIP_PHOTO =
  "https://www.shutterstock.com/shutterstock/photos/1247506609/display_1500/stock-vector-cabriolet-car-with-people-diverse-group-of-men-and-women-enjoy-ride-and-music-happy-young-friends-1247506609.jpg";

const TripDetails = ({ refreshKey }) => {
  const [trips, setTrips] = useState([]);
  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId || !apiUrl) return;

      try {
        const response = await fetch(`${apiUrl}/trip/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, [apiUrl, userId, refreshKey]);

  const onCardClick = (tripId) => {
    navigate(`/dashboard/trip/${tripId}`);
  };

  return (
    <Box sx={{ py: { xs: 3, sm: 5 }, px: { xs: 1.5, sm: 3 }, textAlign: "center", minHeight: "100%" }}>
      <Typography
        variant="h4" // Defines the size and style of the heading
        component="h1" // Semantic HTML element
        gutterBottom // Adds spacing below the heading
        sx={{
          color: "primary.main", // Use theme's primary color
          textAlign: "center", // Center-align the text
          fontWeight: "bold", // Make the text bold
          marginTop: 1,
        }}
      >
        Your Trips
      </Typography>
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
        Your shared trips, all in one place.
      </Typography>
      {trips.length === 0 ? (
        <Box sx={{ mt: 5, py: 5, px: 3, mx: "auto", maxWidth: 440, borderRadius: 4, bgcolor: "rgba(255,255,255,0.8)", border: "1px dashed", borderColor: "primary.light" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No trips yet</Typography>
          <Typography color="text.secondary">Create or join a trip to start tracking expenses together.</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            maxWidth: 1240,
            mx: "auto",
            mt: 3,
          }}
        >
          {trips.map((trip) => (
            <Box
              key={trip.uniqueId}
              sx={{
                width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" },
                boxSizing: "border-box",
                padding: 0,
                marginBottom: 0,
              }}
            >
              <TripCard
                photo={trip.photo || DEFAULT_TRIP_PHOTO}
                tripName={trip.tripName}
                description={trip.desc}
                date={new Date(trip.date).toLocaleDateString()}
                onCardClick={onCardClick}
                codeToCopy={trip.uniqueId}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TripDetails;

TripDetails.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};
