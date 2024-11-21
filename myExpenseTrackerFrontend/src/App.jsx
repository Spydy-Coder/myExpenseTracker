import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Join from './Pages/Join';
import AddNew from './Pages/AddNew';
import ListOfExpense from './Pages/ListOfExpense';
import Login from "./Pages/Login"
import UserDashboard from './Pages/UserDashboard';
import './App.css';
import Login from './Pages/Login';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<ListOfExpense />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/join" element={<Join />} />
        <Route path="/add-new" element={<AddNew />} />
        <Route path="/list" element={<ListOfExpense />} />
      </Routes>
    </Router>
  );
}

export default App;
