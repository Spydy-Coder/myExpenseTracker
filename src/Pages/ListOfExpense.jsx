import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card } from '@mui/material';
import './Form.css'


function ListOfExpense() {
  const [expenses, setExpenses] = useState([
    { id: 1, date: '14-09-2024', title: 'Puri Trip', status: true },
  ]);

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="expense-container">
      <Card className='card'>
      <TableContainer component={Paper}>
        <Table  aria-label="caption table">
          <caption>List Of Expenses</caption>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell align="right">{expense.title}</TableCell>
                  <TableCell align="right">
                    <IconButton color={expense.status ? 'success' : 'default'}>
                      <CheckCircleIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      size="large"
                      color="error"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No expenses to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Card>
    </div>
  );
}

export default ListOfExpense;
