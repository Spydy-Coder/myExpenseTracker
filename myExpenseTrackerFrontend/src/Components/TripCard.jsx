import React, { useState } from "react";
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const TripCard = ({ photo, tripName, description, date, codeToCopy, onCardClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (event) => {
    event.stopPropagation(); // Prevent event bubbling to the Card
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);

    // Reset "Copied!" text after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MuiCard sx={{ minWidth: 300, boxShadow: 3, borderRadius: 2 }}>
      {/* Image Section */}
      <CardMedia
        component="img"
        height="140"
        image={photo}
        alt={tripName}
        onClick={()=>onCardClick(codeToCopy)} // Add onClick here
        sx={{ cursor: "pointer" }} // Add pointer cursor for better UX
      />

      {/* Content Section */}
      <CardContent onClick={() => onCardClick(codeToCopy)} sx={{ cursor: "pointer" }}>
        <Typography gutterBottom variant="h5" component="div">
          {tripName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="subtitle2" color="text.primary" sx={{ marginTop: 2 }}>
          Date: {date}
        </Typography>
      </CardContent>

      {/* Code Section */}
      <Box
        sx={{
          backgroundColor: "#f4f4f4",
          borderRadius: 1,
          p: 2,
          position: "relative",
          mt: 1,
          mx: 3,
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          component="pre"
          sx={{
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            m: 0,
          }}
        >
          {codeToCopy}
        </Typography>
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleCopy}
        >
          {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
        </IconButton>
      </Box>
    </MuiCard>
  );
};

export default TripCard;