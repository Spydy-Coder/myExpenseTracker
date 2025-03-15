import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";

const NewCategoryForm = ({ open, onClose, handleAddNewCategory, tripId }) => {
  const [category, setCategory] = useState("");

  const handleSave = () => {
    handleAddNewCategory(tripId, category);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upi-form-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Add a New Category
        </Typography>
        <TextField
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="category"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
          fullWidth
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

NewCategoryForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NewCategoryForm;
