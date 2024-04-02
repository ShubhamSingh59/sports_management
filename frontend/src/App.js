import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Routes instead of Switch
import './App.css';

import HomePage from './Components/Homepage' ; 
import TableData from './Components/Table' ; 
import Insert from './Components/Insert' ;
import Delete from './Components/Delete';
import Update from './Components/Update' ; 
import Rename from './Components/Rename' ; 
import Where from './Components/Where' ; 
import Login from './Components/Login' ;
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sports Management Application</h1>
        </header>
        <div>
        <Routes> 
          
          <Route exact path="/" element={<HomePage />} /> {/* Use element prop */}
          <Route path="/table/:tableName" element={<div> <TableData /> </div> } /> {/* Use element prop */}
          <Route path="/table/:tableName/insert" element={<Insert />} />
          <Route path="/table/:tableName/delete" element={<Delete />} />
          <Route path="/table/:tableName/update" element={<Update />} />
          <Route path="/table/:tableName/rename" element={<Rename />} />
          <Route path="/table/:tableName/where" element={<Where />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
       
      </div>
    </Router>
  );
}

export default App;
