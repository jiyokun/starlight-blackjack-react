import React, { useState } from 'react';
import './App.css';

function App() {
  // Game state
  const [gameState, setGameState] = useState({
    bankroll: 1000,
    currentBet: 0,
    wins: 0,
    losses: 0,
    playerHand: [],
    dealerHand: [],
    playerScore: 0,
    dealerScore: 0,
    gameActive: false,
    message: 'Welcome! Place your bet to start.'
  });

  // Card deck
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Get random card
  const getRandomCard = () => {
    const value = values[Math.floor(Math.random() * values.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return { value, suit, isRed: suit === '♥' || suit === '♦' };
  };

  // Calculate score
  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    });
    
    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  // Place bet
  const placeBet = (amount) => {
    if (!gameState.gameActive && gameState.bankroll >= amount) {
      const newBet = gameState.currentBet + amount;
      const newBankroll = gameState.bankroll - amount;
      
      setGameState(prev => ({
        ...prev,
        bankroll: newBankroll,
        currentBet: newBet,
        message: `Bet placed: $${newBet}. Click Deal to start!`
      }));
    }
  };

  // Deal cards
  const dealCards = () => {
    if (gameState.currentBet === 0) {
      setGameState(prev => ({ ...prev, message: 'Please place a bet first!' }));
      return;
    }
    
    const playerHand = [getRandomCard(), getRandomCard()];
    const dealerHand = [getRandomCard(), getRandomCard()];
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore([dealerHand[1]]); // Only show second card
    
    setGameState(prev => ({
      ...prev,
      playerHand,
      dealerHand,
      playerScore,
      dealerScore,
      gameActive: true,
      message: `Game started! Your score: ${playerScore}. Hit or Stand?`
    }));
  };

  // Player hits
  const playerHit = () => {
    if (!gameState.gameActive) return;
    
    const newPlayerHand = [...gameState.playerHand, getRandomCard()];
    const newPlayerScore = calculateScore(newPlayerHand);
    
    if (newPlayerScore > 21) {
      setGameState(prev => ({
        ...prev,
        playerHand: newPlayerHand,
        playerScore: newPlayerScore,
        gameActive: false,
        losses: prev.losses + 1,
        message: 'Bust! You went over 21. You lose!'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        playerHand: newPlayerHand,
        playerScore: newPlayerScore,
        message: `Score: ${newPlayerScore}. Hit again or Stand?`
      }));
    }
  };

  // Player stands
  const playerStand = () => {
    if (!gameState.gameActive) return;
    
    let dealerHand = [...gameState.dealerHand];
    let dealerScore = calculateScore(dealerHand);
    
    // Dealer draws until at least 17
    while (dealerScore < 17) {
      dealerHand.push(getRandomCard());
      dealerScore = calculateScore(dealerHand);
    }
    
    const playerScore = gameState.playerScore;
    let newMessage = '';
    let newWins = gameState.wins;
    let newLosses = gameState.losses;
    let newBankroll = gameState.bankroll;
    
    // Determine winner
    if (dealerScore > 21 || playerScore > dealerScore) {
      newMessage = `You win! Dealer: ${dealerScore}, You: ${playerScore}`;
      newWins += 1;
      newBankroll += gameState.currentBet * 2;
    } else if (playerScore < dealerScore) {
      newMessage = `Dealer wins! Dealer: ${dealerScore}, You: ${playerScore}`;
      newLosses += 1;
    } else {
      newMessage = `Push! Dealer: ${dealerScore}, You: ${playerScore}`;
      newBankroll += gameState.currentBet;
    }
    
    setGameState(prev => ({
      ...prev,
      dealerHand,
      dealerScore,
      gameActive: false,
      wins: newWins,
      losses: newLosses,
      bankroll: newBankroll,
      currentBet: 0,
      message: newMessage
    }));
  };

  // Reset game
  const resetGame = () => {
    setGameState({
      bankroll: 1000,
      currentBet: 0,
      wins: 0,
      losses: 0,
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0,
      gameActive: false,
      message: 'Welcome! Place your bet to start.'
    });
  };

  // Chip color function
  const getChipColor = (value) => {
    switch(value) {
      case 10: return '#ff6b6b';
      case 25: return '#4ecdc4';
      case 50: return '#ffeaa7';
      case 100: return '#a29bfe';
      default: return '#61dafb';
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🎰 Starlight Blackjack <span className="react-badge">React</span></h1>
        <p>Complete React Game with Logic</p>
      </header>

      <div className="game-container">
        {/* Left Panel - Stats */}
        <div className="stats-panel">
          <h3><span role="img" aria-label="chart">📊</span> Player Stats</h3>
          <div className="stat">
            <span className="stat-label">Bankroll:</span>
            <span className="stat-value">${gameState.bankroll}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Current Bet:</span>
            <span className="stat-value">${gameState.currentBet}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Wins:</span>
            <span className="stat-value win">{gameState.wins}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Losses:</span>
            <span className="stat-value loss">{gameState.losses}</span>
          </div>
          
          <div className="betting-section">
            <h3><span role="img" aria-label="coins">💰</span> Place Bet</h3>
            <div className="chips">
              {[10, 25, 50, 100].map(chip => (
                <button
                  key={chip}
                  className="chip"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${getChipColor(chip)}, ${getChipColor(chip)}CC)`,
                    color: chip === 50 ? 'black' : 'white'
                  }}
                  onClick={() => placeBet(chip)}
                  disabled={gameState.gameActive || gameState.bankroll < chip}
                >
                  ${chip}
                </button>
              ))}
            </div>
            <button 
              className="btn-secondary"
              onClick={() => {
                if (!gameState.gameActive && gameState.currentBet > 0) {
                  const returned = gameState.currentBet;
                  setGameState(prev => ({
                    ...prev,
                    bankroll: prev.bankroll + returned,
                    currentBet: 0,
                    message: `Bet of $${returned} cleared.`
                  }));
                }
              }}
            >
              Clear Bet
            </button>
          </div>
        </div>

        {/* Center Panel - Game Table */}
        <div className="game-table">
          <div className="dealer-section">
            <h3><span role="img" aria-label="robot">🤖</span> Dealer's Hand</h3>
            <div className="cards">
              {gameState.dealerHand.map((card, index) => (
                <div 
                  key={index}
                  className={`card ${card.isRed ? 'red' : ''} ${gameState.gameActive && index === 0 ? 'back' : ''}`}
                >
                  {!(gameState.gameActive && index === 0) && (
                    <>
                      <div className="card-value">{card.value}</div>
                      <div className="card-suit">{card.suit}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="score">
              Score: <span className="score-value">
                {gameState.gameActive ? '?' : gameState.dealerScore}
              </span>
            </div>
          </div>

          <div className="game-message">
            {gameState.message}
          </div>

          <div className="player-section">
            <h3><span role="img" aria-label="user">👤</span> Your Hand</h3>
            <div className="cards">
              {gameState.playerHand.map((card, index) => (
                <div 
                  key={index}
                  className={`card ${card.isRed ? 'red' : ''}`}
                >
                  <div className="card-value">{card.value}</div>
                  <div className="card-suit">{card.suit}</div>
                </div>
              ))}
            </div>
            <div className="score">
              Score: <span className="score-value">{gameState.playerScore}</span>
            </div>
          </div>

          <div className="controls">
            {!gameState.gameActive && gameState.currentBet > 0 ? (
              <button className="btn-primary" onClick={dealCards}>
                <span role="img" aria-label="cards">🃏</span> Deal Cards
              </button>
            ) : gameState.gameActive ? (
              <>
                <button className="btn-action" onClick={playerHit}>
                  <span role="img" aria-label="plus">➕</span> Hit
                </button>
                <button className="btn-action" onClick={playerStand}>
                  <span role="img" aria-label="hand">✋</span> Stand
                </button>
              </>
            ) : null}
            
            <button className="btn-secondary" onClick={resetGame}>
              <span role="img" aria-label="refresh">🔄</span> New Game
            </button>
          </div>
        </div>

        {/* Right Panel - Tech Info */}
        <div className="tech-panel">
          <h3><span role="img" aria-label="react">⚛️</span> React Features Demonstrated</h3>
          <ul>
            <li>✅ useState Hook for game state</li>
            <li>✅ Functional Components</li>
            <li>✅ Component Composition</li>
            <li>✅ Event Handling</li>
            <li>✅ Conditional Rendering</li>
            <li>✅ Game Logic in React</li>
            <li>✅ Responsive Design</li>
          </ul>
          
          <div className="game-info">
            <h4><span role="img" aria-label="game">🎮</span> Game Rules:</h4>
            <p>• Get as close to 21 as possible without going over</p>
            <p>• Beat the dealer's hand to win</p>
            <p>• Aces count as 1 or 11</p>
            <p>• Dealer must hit until 17 or higher</p>
          </div>
        </div>
      </div>

      <footer>
        <h3>Game Developer Portfolio</h3>
        <p>Complete React implementation with game logic, state management, and component architecture.</p>
        <p>Deployed on Vercel | Built with Create-React-App</p>
      </footer>
    </div>
  );
}

export default App;
