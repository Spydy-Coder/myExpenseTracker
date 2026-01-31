import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { QRCode } from "react-qr-code";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GooglePayIcon from "/images/gpay.png"; // Replace with your image path
import PhonePeIcon from "/images/phonepe.png"; // Replace with your image path
import PaytmIcon from "/images/paytm.png"; // Replace with your image path
import BhimIcon from "/images/bhim.png"; // Replace with your image path
import AmazonPay from "/images/amazon-pay.png"; // Replace with your image path
import Mobikwik from "/images/mobikwik.png"; // Replace with your image path

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    textAlign: "center", // Center align content
  },
  "& .MuiPaper-root": {
    width: "350px", // Set the width of the dialog
    maxWidth: "90%", // Ensure it doesn't overflow on small screens
    height: "auto", // Let the height adjust based on content
    borderRadius: "12px", // Optional: Add rounded corners
  },
}));

export default function QrCodeHolder({ upiLink }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} sx={{ mr: 2 }}>
        Pay Now
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <QRCode value={upiLink} size={200} style={{ margin: "0 auto" }} />
          <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
            Scan the QR code using any UPI app:
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <img
              src={GooglePayIcon}
              alt="Google Pay"
              style={{ width: "30px", height: "30px" }}
            />
            <img
              src={PhonePeIcon}
              alt="PhonePe"
              style={{ width: "30px", height: "30px" }}
            />
            <img
              src={PaytmIcon}
              alt="Paytm"
              style={{ width: "30px", height: "30px" }}
            />
            <img
              src={BhimIcon}
              alt="BHIM"
              style={{ width: "30px", height: "30px" }}
            />
            {/* <img src={AmazonPay} alt="AmazonPay" style={{ width: '30px', height: '30px' }} /> */}
            <img
              src={Mobikwik}
              alt="Mobikwik"
              style={{ width: "30px", height: "30px" }}
            />
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
