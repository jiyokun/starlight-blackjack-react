import React, { useState } from 'react';
import './App.css';

function App() {
  const [bankroll, setBankroll] = useState(1000);
  const [bet, setBet] = useState(0);
  const [message, setMessage] = useState('Welcome to React Blackjack!');

  const placeBet = (amount) => {
    if (bankroll >= amount) {
      setBet(amount);
      setBankroll(bankroll - amount);
      setMessage(`Bet $${amount} placed! Click Deal.`);
    }
  };

  const Card = ({ value, suit }) => (
    <div className="card">
      <span className="card-value">{value}</span>
      <span className="card-suit">{suit}</span>
    </div>
  );

  return (
    <div className="App">
      <header className="header">
        <h1>🎰 Starlight Blackjack <span className="react-badge">React</span></h1>
        <p>Built with Create-React-App | For FYB Technologies</p>
      </header>

      <div className="game-container">
        <div className="stats">
          <h3>Bankroll: <span className="highlight">${bankroll}</span></h3>
          <h3>Current Bet: <span className="highlight">${bet}</span></h3>
          <p className="message">{message}</p>
        </div>

        <div className="game-table">
          <h3>Dealer's Hand</h3>
          <div className="cards">
            <Card value="A" suit="♠" />
            <Card value="K" suit="♥" />
          </div>

          <h3>Your Hand</h3>
          <div className="cards">
            <Card value="10" suit="♣" />
            <Card value="7" suit="♦" />
          </div>

          <div className="controls">
            <div className="chips">
              {[10, 25, 50, 100].map(chip => (
                <button
                  key={chip}
                  className="chip"
                  onClick={() => placeBet(chip)}
                >
                  ${chip}
                </button>
              ))}
            </div>

            <div className="buttons">
              <button className="btn btn-primary" onClick={() => setMessage('Cards dealt!')}>
                Deal
              </button>
              <button className="btn" onClick={() => setMessage('You hit!')}>
                Hit
              </button>
              <button className="btn" onClick={() => setMessage('You stand!')}>
                Stand
              </button>
            </div>
          </div>
        </div>

        <div className="tech-demo">
          <h3>⚛️ React Features Demonstrated:</h3>
          <ul>
            <li>✅ Functional Components</li>
            <li>✅ React Hooks (useState)</li>
            <li>✅ Component Composition</li>
            <li>✅ Event Handling</li>
            <li>✅ JSX Syntax</li>
          </ul>
        </div>
      </div>

      <footer>
        <p>This demonstrates React proficiency for FYB Technologies Game Developer position.</p>
        <p>Deployable to Vercel/Netlify with Create-React-App build process.</p>
      </footer>
    </div>
  );
}

export default App;
