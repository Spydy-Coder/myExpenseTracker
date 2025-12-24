import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function InfoDialog({ open, handleClose }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Note"}</DialogTitle>
       <DialogContent>
  <DialogContentText
    id="alert-dialog-description"
    sx={{ padding: '16px' }} // or p: 2 (theme spacing)
  >
    ⚠️ If you mistakenly added a split, you can delete it from the
    respective group members. However, please note that once the request
    has been sent and the amount has been paid, the split cannot be deleted.
    <br /><br />
    ℹ️ Don’t forget to add your UPI ID through the 'Manage UPI ID' section for easy and seamless transfers.
  </DialogContentText>
</DialogContent>


        <DialogActions>
          <Button onClick={handleClose}>Ok, Understood</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
