import React from 'react'
import Input from '@mui/joy/Input';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/joy/Card';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import AddIcon from '@mui/icons-material/Add';
import './Form.css'


function AddNew() {
  return (
    <div>
      <Card className="card">
      <FormControl>
        <FormLabel>Enter the title</FormLabel>
        <Input placeholder="" />
        <FormLabel>Enter the Date</FormLabel>
        <Input placeholder="" type='date'/>
        <FormLabel>Add a discription</FormLabel>
        <Input placeholder="" type='text'/>

        </FormControl>
        <div className="icon-button-container">
          <IconButton className="icon-button" aria-label="add" disabled color="primary">
            <AddIcon />
          </IconButton>
        </div>
      </Card>
    </div>
  )
}

export default AddNew
