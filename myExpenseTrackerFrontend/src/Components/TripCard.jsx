import { useState } from "react";
import PropTypes from "prop-types";
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const DEFAULT_TRIP_PHOTO =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";


const TripCard = ({ photo, tripName, description, date, codeToCopy, onCardClick }) => {
  const [copied, setCopied] = useState(false);
  const imageSrc = photo || DEFAULT_TRIP_PHOTO;

  const handleCopy = (event) => {
    event.stopPropagation(); // Prevent event bubbling to the Card
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);

    // Reset "Copied!" text after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MuiCard
      sx={{
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(25, 118, 210, 0.12)",
        boxShadow: "0 8px 24px rgba(32, 70, 110, 0.1)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 32px rgba(32, 70, 110, 0.18)",
          "& .trip-card-image": { transform: "scale(1.05)" },
          "& .trip-card-arrow": { transform: "translateX(4px)" },
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ height: 172, overflow: "hidden", position: "relative", cursor: "pointer" }} onClick={() => onCardClick(codeToCopy)}>
        <CardMedia
          className="trip-card-image"
          component="img"
          image={imageSrc}
          alt={tripName}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = DEFAULT_TRIP_PHOTO;
          }}
          sx={{ height: "100%", transition: "transform 300ms ease", objectFit: "cover" }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(8, 31, 57, 0.72))" }} />
        <Chip
          label="Trip"
          size="small"
          sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(255,255,255,0.9)", fontWeight: 700 }}
        />
      </Box>

      {/* Content Section */}
      <CardContent onClick={() => onCardClick(codeToCopy)} sx={{ cursor: "pointer", px: 2.5, pt: 2.25, pb: 1.5 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 800, color: "#12355b", overflowWrap: "anywhere" }}>
          {tripName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {description}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#52708f" }}>
            <CalendarMonthOutlinedIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{date}</Typography>
          </Box>
          <ArrowForwardRoundedIcon className="trip-card-arrow" color="primary" sx={{ transition: "transform 180ms ease" }} />
        </Box>
      </CardContent>

      {/* Code Section */}
      <Box
        sx={{
          backgroundColor: "#f3f8fd",
          border: "1px dashed #b9cce0",
          borderRadius: 2,
          p: 1.5,
          position: "relative",
          mt: 0.5,
          mx: 2.5,
          mb: 2.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.72rem",
            color: "#496782",
            pr: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            m: 0,
          }}
        >
          {codeToCopy}
        </Typography>
        <IconButton
          size="small"
          aria-label="copy trip code"
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleCopy}
        >
          {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
        </IconButton>
      </Box>
    </MuiCard>
  );
};

TripCard.propTypes = {
  photo: PropTypes.string,
  tripName: PropTypes.string.isRequired,
  description: PropTypes.string,
  date: PropTypes.string,
  codeToCopy: PropTypes.string.isRequired,
  onCardClick: PropTypes.func.isRequired,
};

export default TripCard;
