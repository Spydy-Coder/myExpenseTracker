import {
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import {
  ArrowForward,
  Groups,
  ReceiptLong,
  TrendingUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const highlights = [
    { title: "Split bills fairly", icon: <ReceiptLong /> },
    { title: "Track every trip", icon: <Groups /> },
    { title: "See balances clearly", icon: <TrendingUp /> },
  ];

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 6, md: 8 }, pt: { xs: 2, md: 2 } }}>
      <Navbar />
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Chip
              label="Built for travelers and shared adventures"
              sx={{
                alignSelf: "flex-start",
                bgcolor: "rgba(68, 181, 173, 0.16)",
                color: "#0a6a9b",
                fontWeight: 600,
                px: 1,
                py: 0.5,
                borderRadius: "999px",
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#102a43",
                fontSize: { xs: "2.2rem", md: "3.3rem" },
                lineHeight: 1.2,
              }}
            >
              Plan your trip. Share expenses. Keep it simple.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#486581",
                fontSize: { xs: "1rem", md: "1.08rem" },
                lineHeight: 1.8,
                maxWidth: 650,
              }}
            >
              myExpense helps friends and families manage shared travel costs in
              one place. Create a trip, add expenses, and settle up without the
              usual back-and-forth.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleGetStarted}
                sx={{
                  backgroundImage:
                    "linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)",
                  color: "#fff",
                  px: 3,
                  py: 1.2,
                  borderRadius: "999px",
                  boxShadow: "0 12px 30px rgba(10, 106, 155, 0.2)",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: "999px",
                  borderColor: "#0a6a9b",
                  color: "#0a6a9b",
                  "&:hover": {
                    borderColor: "#0a6a9b",
                    bgcolor: "rgba(10, 106, 155, 0.06)",
                  },
                }}
                onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}
              >
                See How It Works
              </Button>
            </Stack>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {highlights.map((item) => (
                <Grid item xs={12} sm={4} key={item.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: "#f8fbff",
                      border: "1px solid rgba(10, 106, 155, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ color: "#0a6a9b" }}>{item.icon}</Box>
                    <Typography variant="body2" sx={{ color: "#334e68", fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1, md: 2 },
              borderRadius: 4,
              background: "linear-gradient(145deg, #f8fbff, #eef7ff)",
              border: "1px solid rgba(10, 106, 155, 0.12)",
            }}
          >
            <Box
              component="img"
              src="https://img.freepik.com/premium-vector/cartoon-happy-couple-vintage-car-suitcases-tropical-road_18591-17655.jpg?w=740"
              alt="Trip Illustration"
              sx={{ width: "100%", height: "auto", borderRadius: 3, display: "block" }}
            />
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, flexWrap: "wrap", justifyContent: "center" }}
            >
              <Chip label="Fast setup" sx={{ bgcolor: "#fff", color: "#0a6a9b" }} />
              <Chip label="Fair splits" sx={{ bgcolor: "#fff", color: "#0a6a9b" }} />
              <Chip label="Travel ready" sx={{ bgcolor: "#fff", color: "#0a6a9b" }} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
