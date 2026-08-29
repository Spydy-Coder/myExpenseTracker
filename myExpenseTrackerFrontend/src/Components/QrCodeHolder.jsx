import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { QRCode } from "react-qr-code";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import GooglePayIcon from "/images/gpay.png"; // Replace with your image path
import PhonePeIcon from "/images/phonepe.png"; // Replace with your image path
import PaytmIcon from "/images/paytm.png"; // Replace with your image path
import BhimIcon from "/images/bhim.png"; // Replace with your image path
import Mobikwik from "/images/mobikwik.png"; // Replace with your image path

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    textAlign: "center", // Center align content
  },
  "& .MuiPaper-root": {
    width: "350px", // Set the width of the dialog
    maxWidth: "90%", // Ensure it doesn't overflow on small screens
    maxWidth: "90%", // Ensure it doesn't overflow on small screens
    height: "auto", // Let the height adjust based on content
    borderRadius: "12px", // Optional: Add rounded corners
  },
}));

export default function QrCodeHolder({
  upiLink,
  upiId,
  upiPhoneNumber,
  amount,
}) {
  const [open, setOpen] = React.useState(false);
  const [payOpen, setPayOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [amountCopied, setAmountCopied] = React.useState(false);
  const qrCodeRef = React.useRef(null);
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isSmallViewport = useMediaQuery("(max-width:600px)");
  const shouldOpenUpiApp = isMobileDevice || isSmallViewport;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayNow = () => {
    setPayOpen(true);
  };

  const handleCopyUpiId = async () => {
    if (!upiId) return;

    await navigator.clipboard.writeText(upiId);
    setCopied(true);
  };

  const handleCopyPhoneNumber = async () => {
    if (!upiPhoneNumber) return;

    await navigator.clipboard.writeText(upiPhoneNumber);
  };

  const handleCopyAmount = async () => {
    await navigator.clipboard.writeText(amount);
    setAmountCopied(true);
  };
  const handleDownload = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) return;

    const svgMarkup = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgMarkup], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 3; // Higher quality

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");

      // JPEG doesn't support transparency, so use a white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const downloadUrl = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "expense-payment-qr.jpg";

          document.body.appendChild(link);
          link.click();
          link.remove();

          URL.revokeObjectURL(downloadUrl);
          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        1.0,
      );
    };

    img.src = url;
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {upiLink && (
          <Button variant="outlined" onClick={handleClickOpen}>
            {shouldOpenUpiApp ? "Show QR" : "Download QR"}
          </Button>
        )}
        <Button variant="contained" onClick={handlePayNow}>
          Pay now
        </Button>
      </Box>
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
          <Box
            ref={qrCodeRef}
            sx={{
              display: "inline-flex",
              p: 1,
              bgcolor: "#fff",
              borderRadius: 1,
            }}
          >
            <QRCode value={upiLink} size={200} />
          </Box>
          <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
            Scan this QR code with any UPI app to pay the displayed amount.
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ mb: 2 }}
          >
            Download QR
          </Button>
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
      <Dialog
        onClose={() => setPayOpen(false)}
        open={payOpen}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent dividers>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Pay from your UPI app
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Amount to pay: <strong>₹{amount}</strong>
          </Typography>
          {upiPhoneNumber && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography sx={{ overflowWrap: "anywhere", flexGrow: 1 }}>
                UPI Mobile Number: <strong>{upiPhoneNumber}</strong>
              </Typography>
              <IconButton
                aria-label="copy UPI mobile number"
                onClick={handleCopyPhoneNumber}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          {upiId ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography sx={{ overflowWrap: "anywhere", flexGrow: 1 }}>
                UPI ID: <strong>{upiId}</strong>
              </Typography>
              <IconButton aria-label="copy UPI ID" onClick={handleCopyUpiId}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : null}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {upiId
              ? "Copy the UPI ID, open your preferred UPI app, paste it as the recipient, and enter the amount shown above."
              : "Open your preferred UPI app and pay the amount shown above using the recipient details."}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {upiId && (
              <Button variant="outlined" onClick={handleCopyUpiId}>
                {copied ? "Copied" : "Copy UPI ID"}
              </Button>
            )}
            <Button variant="contained" onClick={handleCopyAmount}>
              {amountCopied ? "Amount copied" : "Copy amount"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

QrCodeHolder.propTypes = {
  upiLink: PropTypes.string,
  upiId: PropTypes.string,
  upiPhoneNumber: PropTypes.string,
  amount: PropTypes.string.isRequired,
};
