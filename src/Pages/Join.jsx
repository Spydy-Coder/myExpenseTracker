import React from 'react';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import './Form.css'

function Join() {
  return (
    <div>
      <Card className="card">
        <FormControl className="form">
          <FormLabel>Enter the code</FormLabel>
          <Input placeholder="Code" />
          <FormHelperText>It's length should be of 10</FormHelperText>
        </FormControl>
        <Button variant="solid" color='success'>Submit</Button>
      </Card>
    </div>
  );
}

export default Join;