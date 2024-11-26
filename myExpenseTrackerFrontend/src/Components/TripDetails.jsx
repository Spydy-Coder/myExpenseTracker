import React from 'react'
import { Box,Typography } from '@mui/material';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripCard from './TripCard';

const TripDetails = () => {
    
    const [trips, setTrips] = useState([]);
    const userId = localStorage.getItem("userId");
  
    useEffect(() => {
      const fetchTrips = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/trip/user/${userId}`
          );
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
    }, []);
  
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your Trips
        </Typography>
        {trips.length === 0 ? (
          <Typography>No trips found. Create one to get started!</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {trips.map((trip) => (
              <Box
                key={trip.uniqueId}
                sx={{
                  width: { xs: "100%", sm: "45%", md: "30%" }, // Responsive widths
                  boxSizing: "border-box",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              >
                  <Link to={`/dashboard/trip/${trip.uniqueId}`} style={{ textDecoration: "none" }}>
                <TripCard
                  photo="https://www.shutterstock.com/shutterstock/photos/1247506609/display_1500/stock-vector-cabriolet-car-with-people-diverse-group-of-men-and-women-enjoy-ride-and-music-happy-young-friends-1247506609.jpg"
                  tripName={trip.tripName}
                  description={trip.desc}
                  date={new Date(trip.date).toLocaleDateString()}
                  codeToCopy={trip.uniqueId}
                />
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }
  
  export default TripDetails;