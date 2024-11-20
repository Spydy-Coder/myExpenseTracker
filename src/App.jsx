import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Join from './Pages/Join';
import AddNew from './Pages/AddNew';
import ListOfExpense from './Pages/ListOfExpense';
import './App.css';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<ListOfExpense />} />
        <Route path="/join" element={<Join />} />
        <Route path="/add-new" element={<AddNew />} />
        <Route path="/list" element={<ListOfExpense />} />
      </Routes>
    </Router>
  );
}

export default App;
