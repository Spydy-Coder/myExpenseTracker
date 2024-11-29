import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HandymanIcon from '@mui/icons-material/Handyman';


export default function CustomSpeedDial({handleShowTotalExpense,handleCreateExpense}) {
  const actions = [
    { icon: <AddIcon onClick={handleCreateExpense} />, name: 'Add Expense' },
    { icon: <AccountBalanceWalletIcon onClick={handleShowTotalExpense} />, name: 'Your Total Expenses' },
    
  ];
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<HandymanIcon  />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            sx={{height:"40px",width:"40px"}}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
