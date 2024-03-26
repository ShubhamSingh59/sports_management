import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ALLDB from './Components/AllDB';
function App() {
  
  return (
      <div className="App">
      <header className="App-header">
        <h1>Sports Management Application</h1>
      </header>
      <ALLDB/> 
    </div>
  );
}

export default App;
