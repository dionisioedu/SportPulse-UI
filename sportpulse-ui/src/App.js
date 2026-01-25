import React from 'react';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className='App-title'>SportPulse</h1>
      </header>
      <main>
        <Dashboard />
      </main>
      <footer>
        <p>© 2026 SportPulse. All rights reserved. By <a href="https://dionisio.dev"><strong>Dionisio</strong></a>.</p>
      </footer>
    </div>
  );
}

export default App;
