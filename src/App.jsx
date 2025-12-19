import React, { useState, useEffect, useRef } from 'react';
import { X, Wifi, Battery, SignalHigh } from 'lucide-react';

// Create simplified Button component since we don't have access to the actual UI components
const Button = ({ children, variant, className, onClick }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-300 hover:bg-gray-100';
      case 'default':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };
  
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-colors ${getVariantClass()} ${className}`}
    >
      {children}
    </button>
  );
};

const HackAttackAdventure = () => {
  // Initialize all state variables at the top of the component
  // Start menu state
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [matrixCode, setMatrixCode] = useState([]);
  
  // Game state
  const [currentPath, setCurrentPath] = useState('START HERE');
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isHacked, setIsHacked] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const messagesEndRef = useRef(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }));
  
  // Banner state
  const [bannerPosition, setBannerPosition] = useState({ x: 50, y: 50 });
  const [bannerMoving, setBannerMoving] = useState(false);
  
  // Pong game state
  const [showPong, setShowPong] = useState(false);
  const [pongBallPosition, setPongBallPosition] = useState({ x: 50, y: 50 });
  const [pongPaddlePosition, setPongPaddlePosition] = useState(50);
  const [pongScore, setPongScore] = useState(0);
  const [pongGameOver, setPongGameOver] = useState(false);
  const [pongLives, setPongLives] = useState(3);
  const ballSpeedRef = useRef({ x: 1.5, y: 2 });

  // Final trap minigame state
  const [showFinalTrap, setShowFinalTrap] = useState(false);
  const [showTrapMessage, setShowTrapMessage] = useState(false);
  const [trapPongActive, setTrapPongActive] = useState(false);
  const [trapPongTimer, setTrapPongTimer] = useState(10);
  const [showTrapReveal, setShowTrapReveal] = useState(false);
  const trapBallSpeedRef = useRef({ x: 1.5, y: 2 });

  // Distracting banner content
  const banners = [
    { text: "🎮 New Game Available! Click to play now!", color: "bg-purple-500", size: "normal" },
    { text: "🎁 You won a FREE gift card! Claim now!", color: "bg-pink-500", size: "normal" },
    { text: "⚡ Flash Sale! 90% off! Limited time only!", color: "bg-orange-500", size: "normal" },
    { text: "🏆 Congratulations! You're our 1,000,000th visitor!", color: "bg-green-500", size: "large" },
    { text: "📱 Your device needs an urgent update! Click here!", color: "bg-red-500", size: "fullscreen" }
  ];

  // Complete scenarios object
  const scenarios = {
    'START HERE': {
      text: 'hey, did you just send me a weird link? your account is posting strange stuff…',
      choices: [
        { text: 'Try logging into account', nextPath: '3' },
        { text: 'Ignore the message', nextPath: '7' },
        { text: 'Tell trusted adult', nextPath: '4' }
      ]
    },
    '3': {
      text: 'You try to log in but your password doesn\'t work... 😰',
      choices: [
        { text: 'Keep trying different passwords', nextPath: '8' },
        { text: 'Tell a trusted adult', nextPath: '4' },
        { text: 'Create a new account', nextPath: '12' }
      ]
    },
    '4': {
      text: 'Good thinking! What do you want to do while waiting for help?',
      choices: [
        { text: 'Take screenshots of activity', nextPath: '5' },
        { text: 'Change passwords', nextPath: '6' },
        { text: 'Do both', nextPath: '9' }
      ]
    },
    '5': {
      text: 'You\'ve got the screenshots. What next? 📱',
      choices: [
        { text: 'Share with support team', nextPath: '10' },
        { text: 'Post screenshots publicly', nextPath: '11' },
        { text: 'Wait for a trusted adult\'s guidance', nextPath: '6' }
      ]
    },
    '6': {
      text: 'Time to update those passwords! What\'s your strategy? 🔐',
      choices: [
        { text: 'Use same password for all accounts', nextPath: '13' },
        { text: 'Create unique, strong passwords', nextPath: '14' },
        { text: 'Use password manager', nextPath: '15' }
      ]
    },
    '7': {
      text: 'You decide to ignore the warning message... 😬',
      choices: [
        { text: 'Continue using account normally', nextPath: '16' },
        { text: 'Check account activity', nextPath: '17' },
        { text: 'Tell a trusted adult', nextPath: '4' }
      ]
    },
    '8': {
      text: 'Multiple password attempts... this is risky! 😱',
      choices: [
        { text: 'Get locked out of account', nextPath: '18' },
        { text: 'Trigger security alerts', nextPath: '19' },
        { text: 'Successfully guess password', nextPath: '20' }
      ]
    },
    '9': {
      text: '🎉 Success! Working with a trusted adult and taking precautions was the best choice!',
      outcome: true,
      type: 'success'
    },
    '10': {
      text: 'The support team is ready to help. What details will you share?',
      choices: [
        { text: 'Provide detailed information', nextPath: '21' },
        { text: 'Share minimal details', nextPath: '22' },
        { text: 'Get frustrated and give up', nextPath: '23' }
      ]
    },
    '11': {
      text: '⚠️ Oh no! Posting screenshots publicly exposed sensitive information!',
      outcome: true,
      type: 'danger'
    },
    '12': {
      text: 'Creating a new account - what\'s your plan? 🤔',
      choices: [
        { text: 'Use same email as compromised account', nextPath: '24' },
        { text: 'Create completely new email address', nextPath: '25' },
        { text: 'Transfer important connections', nextPath: '26' }
      ]
    },
    '13': {
      text: '❌ Using the same password everywhere is dangerous! All your accounts could be at risk!',
      outcome: true,
      type: 'danger'
    },
    '14': {
      text: '✅ Great job! Using unique, strong passwords makes your accounts much safer!',
      outcome: true,
      type: 'success'
    },
    '15': {
      text: '🏆 Excellent choice! A password manager gives you the best protection!',
      outcome: true,
      type: 'success'
    },
    '16': {
      text: '⚠️ Continuing to use a compromised account puts you at risk!',
      outcome: true,
      type: 'danger'
    },
    '17': {
      text: '🔍 Smart move checking your account activity!',
      outcome: true,
      type: 'caution'
    },
    '18': {
      text: '🔒 Account locked! Too many password attempts!',
      outcome: true,
      type: 'danger'
    },
    '19': {
      text: '⚠️ Multiple login attempts triggered security alerts!',
      outcome: true,
      type: 'danger'
    },
    '20': {
      text: '😰 You guessed the password... but that was super risky!',
      outcome: true,
      type: 'danger'
    },
    '21': {
      text: '✅ Great job! Providing detailed information helps the support team help you!',
      outcome: true,
      type: 'success'
    },
    '22': {
      text: '⚠️ Limited information means limited help...',
      outcome: true,
      type: 'caution'
    },
    '23': {
      text: '❌ Giving up leaves your account vulnerable!',
      outcome: true,
      type: 'danger'
    },
    '24': {
      text: '⚠️ Using the same email could leave you vulnerable again!',
      outcome: true,
      type: 'danger'
    },
    '25': {
      text: '✅ Perfect! A fresh email gives you a secure new start!',
      outcome: true,
      type: 'success'
    },
    '26': {
      text: '🤔 Careful transfer of connections is a balanced approach.',
      outcome: true,
      type: 'caution'
    }
  };

  // Custom CSS for animations
  const animations = `
    @keyframes shake {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      25% { transform: translate(-50%, -50%) rotate(1deg); }
      50% { transform: translate(-50%, -50%) rotate(0deg); }
      75% { transform: translate(-50%, -50%) rotate(-1deg); }
      100% { transform: translate(-50%, -50%) rotate(0deg); }
    }
    
    @keyframes slideDown {
      from { transform: translate(-50%, -150%); }
      to { transform: translate(-50%, -50%); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes matrixRain {
      0% { opacity: 1; }
      75% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    @keyframes sparkle {
      0% { filter: brightness(1); }
      50% { filter: brightness(1.5); }
      100% { filter: brightness(1); }
    }
  `;
  
  const slideDownAnimation = {
    animation: 'slideDown 0.5s ease-out forwards'
  };

  // *** Function Definitions ***
  
  // Function to start the actual game after start menu
  const startMainGame = () => {
    setShowStartMenu(false);
    setCurrentPath('START HERE');
    setHistory([]);
    setMessages([{
      type: 'received',
      text: scenarios['START HERE'].text
    }]);
  };
  
  // Function to handle paddle movement in Pong game
  const handlePaddleMove = (e) => {
    const container = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - container.left;
    const paddlePosition = (relativeX / container.width) * 100;
    setPongPaddlePosition(Math.max(10, Math.min(90, paddlePosition)));
  };
  
  // Function to start Pong game
  const startPongGame = () => {
    setShowPong(true);
    setPongBallPosition({ x: 50, y: 20 });
    setPongPaddlePosition(50);
    setPongScore(0);
    setPongGameOver(false);
    setPongLives(3);
    ballSpeedRef.current = { x: 1.5, y: 2 };
  };
  
  // Function to scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  
  // Function to handle user choices
  const handleChoice = (nextPath) => {
    const currentScenario = scenarios[currentPath];
    const nextScenario = scenarios[nextPath];
    
    // 30% chance of triggering a banner when making a choice
    if (Math.random() < 0.3 && !isHacked) {
      const randomBanner = Math.floor(Math.random() * banners.length);
      setCurrentBanner(randomBanner);
      setShowBanner(true);
      setBannerPosition({
        x: 50, // Center
        y: 40  // Near the top to be disruptive
      });
      
      // Banners triggered during choices are more aggressive
      setBannerMoving(true);
      
      setTimeout(() => {
        setShowBanner(false);
        setBannerMoving(false);
      }, 4000);
    }
    
    setMessages(prev => [...prev, {
      type: 'sent',
      text: currentScenario.choices.find(c => c.nextPath === nextPath).text
    }]);
    
    setMessages(prev => [...prev, {
      type: 'received',
      text: nextScenario.text
    }]);
    
    setHistory([...history, currentPath]);
    setCurrentPath(nextPath);
    
    // If this is an outcome scenario, show the final trap after a short delay
    if (nextScenario.outcome) {
      setTimeout(() => {
        setShowFinalTrap(true);
      }, 1500);
    }
  };
  
  // Function to reset the game
  const handleReset = () => {
    setCurrentPath('START HERE');
    setHistory([]);
    setMessages([{
      type: 'received',
      text: scenarios['START HERE'].text
    }]);
    setIsHacked(false);
    setIsShuttingDown(false);
    setShowFinalTrap(false);
    setShowTrapMessage(false);
    setTrapPongActive(false);
    setTrapPongTimer(10);
    setShowTrapReveal(false);
    setShowPong(false);
    setPongGameOver(false);
    setPongLives(3);
    setPongScore(0);
    // Don't show start menu again, just reset the game
  };
  
  // Function to handle the final trap
  const startFinalTrap = () => {
    setTrapPongActive(true);
    trapBallSpeedRef.current = { x: 1.5, y: 2 };
    
    // Set a timer to show the "YOU'VE BEEN HACKED" message after 10 seconds
    const timer = setInterval(() => {
      setTrapPongTimer(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTrapPongActive(false);
          setShowTrapReveal(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // *** Effect Hooks ***
  
  // Effect for Matrix code animation
  useEffect(() => {
    if (!showStartMenu) return;
    
    // Characters to use for Matrix code (mix of letters, numbers, and symbols)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    
    // Generate initial matrix code columns
    const columns = [];
    for (let i = 0; i < 50; i++) {
      const column = {
        x: Math.random() * 100, // Random horizontal position
        y: -Math.random() * 100, // Start above the viewport
        speed: 1 + Math.random() * 3, // Random speed
        chars: []
      };
      
      // Generate random characters for this column
      const length = 5 + Math.floor(Math.random() * 15); // Random length between 5-20
      for (let j = 0; j < length; j++) {
        column.chars.push(characters.charAt(Math.floor(Math.random() * characters.length)));
      }
      
      columns.push(column);
    }
    
    setMatrixCode(columns);
    
    // Animation loop for Matrix code
    const interval = setInterval(() => {
      setMatrixCode(prevColumns => {
        return prevColumns.map(column => {
          // Move column down
          const newY = column.y + column.speed;
          
          // If column is off screen, reset it to the top with new random position
          if (newY > 120) {
            return {
              ...column,
              x: Math.random() * 100,
              y: -Math.random() * 20,
              speed: 1 + Math.random() * 3,
              chars: column.chars.map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
            };
          }
          
          // Occasionally change a character in the column
          if (Math.random() < 0.1) {
            const charIndex = Math.floor(Math.random() * column.chars.length);
            const newChars = [...column.chars];
            newChars[charIndex] = characters.charAt(Math.floor(Math.random() * characters.length));
            
            return {
              ...column,
              y: newY,
              chars: newChars
            };
          }
          
          return {
            ...column,
            y: newY
          };
        });
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [showStartMenu]);
  
  // Effect for scrolling to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Effect for updating the time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Effect for banner display
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      if (!showBanner && !isHacked && !showStartMenu && !showFinalTrap) {
        const randomBanner = Math.floor(Math.random() * banners.length);
        setCurrentBanner(randomBanner);
        setShowBanner(true);
        
        // Random starting position for moving banners
        setBannerPosition({
          x: Math.floor(Math.random() * 70),
          y: Math.floor(Math.random() * 60)
        });
        
        // Set banner to move for some types
        setBannerMoving(banners[randomBanner].size === "large");
        
        // Banners stay longer now
        setTimeout(() => {
          setShowBanner(false);
          setBannerMoving(false);
        }, banners[randomBanner].size === "fullscreen" ? 6000 : 4000);
      }
    }, 3000); // More frequent banners

    return () => clearInterval(bannerInterval);
  }, [showBanner, isHacked, showStartMenu, showFinalTrap]);
  
  // Effect for moving banners around
  useEffect(() => {
    let moveInterval;
    if (bannerMoving && showBanner) {
      moveInterval = setInterval(() => {
        setBannerPosition(prev => ({
          x: (prev.x + Math.floor(Math.random() * 10) - 5 + 100) % 80,
          y: (prev.y + Math.floor(Math.random() * 10) - 5 + 100) % 70
        }));
      }, 300);
    }
    return () => clearInterval(moveInterval);
  }, [bannerMoving, showBanner]);
  
  // Effect for Pong game loop
  useEffect(() => {
    if (!showPong || pongGameOver) return;
    
    const gameLoop = setInterval(() => {
      // Determine if we should make the ball "miss" the paddle
      // The higher the score, the more likely we'll make it miss
      const shouldMiss = Math.random() < (0.3 + (pongScore * 0.05));
      
      // Update ball position
      setPongBallPosition(prev => {
        let speedX = ballSpeedRef.current.x;
        let speedY = ballSpeedRef.current.y;
        
        const newX = prev.x + speedX;
        const newY = prev.y + speedY;
        
        // Bounce off left and right walls
        if (newX <= 0 || newX >= 100) {
          ballSpeedRef.current.x = -ballSpeedRef.current.x;
          speedX = ballSpeedRef.current.x;
        }
        
        // Bounce off the top
        if (newY <= 0) {
          ballSpeedRef.current.y = -ballSpeedRef.current.y;
          speedY = ballSpeedRef.current.y;
        }
        
        // Check if ball hits the paddle or goes past bottom
        if (newY >= 90) {
          // Check if ball hits paddle
          if (newX >= pongPaddlePosition - 10 && newX <= pongPaddlePosition + 10 && !shouldMiss) {
            ballSpeedRef.current.y = -Math.abs(ballSpeedRef.current.y);
            speedY = ballSpeedRef.current.y;
            // Increase score
            setPongScore(score => {
              const newScore = score + 1;
              // Make the ball move faster as score increases
              if (newScore > 0 && newScore % 3 === 0) {
                ballSpeedRef.current.x = ballSpeedRef.current.x * 1.1;
                ballSpeedRef.current.y = Math.abs(ballSpeedRef.current.y) * 1.1;
              }
              return newScore;
            });
            return { x: newX, y: newY };
          } else if (newY >= 100) {
            // Lose a life
            setPongLives(lives => {
              const newLives = lives - 1;
              // Game over if no lives left
              if (newLives <= 0) {
                setPongGameOver(true);
                
                // After a short delay, trigger the hack
                setTimeout(() => {
                  setShowPong(false);
                  setIsShuttingDown(true);
                  setTimeout(() => {
                    setIsHacked(true);
                    setIsShuttingDown(false);
                  }, 1000);
                }, 1500);
              } else {
                // Reset ball position for next life
                setTimeout(() => {
                  setPongBallPosition({ x: 50, y: 20 });
                  ballSpeedRef.current = { x: 1.5, y: 2 };
                }, 1000);
              }
              return newLives;
            });
            
            return { x: 50, y: 110 }; // Move ball out of bounds to pause
          }
        }
        
        // If we want to make it miss and the ball is coming down toward the paddle,
        // subtly adjust the X position away from the paddle
        if (shouldMiss && speedY > 0 && newY > 70) {
          const distanceFromPaddle = Math.abs(newX - pongPaddlePosition);
          
          // If close to paddle, move it away
          if (distanceFromPaddle < 15) {
            const moveDirection = newX < pongPaddlePosition ? -1 : 1;
            return {
              x: Math.max(0, Math.min(100, newX + moveDirection * 2)),
              y: newY
            };
          }
        }
        
        return { x: newX, y: newY };
      });
    }, 30);
    
    // Clean up
    return () => clearInterval(gameLoop);
  }, [showPong, pongGameOver, pongPaddlePosition, pongScore]);
  
  // Effect for trap Pong game loop
  useEffect(() => {
    if (!trapPongActive) return;
    
    const gameLoop = setInterval(() => {
      setPongBallPosition(prev => {
        let speedX = trapBallSpeedRef.current.x;
        let speedY = trapBallSpeedRef.current.y;
        
        const newX = prev.x + speedX;
        const newY = prev.y + speedY;
        
        // Bounce off walls
        if (newX <= 0 || newX >= 100) {
          trapBallSpeedRef.current.x = -trapBallSpeedRef.current.x;
          speedX = trapBallSpeedRef.current.x;
        }
        
        if (newY <= 0) {
          trapBallSpeedRef.current.y = -trapBallSpeedRef.current.y;
          speedY = trapBallSpeedRef.current.y;
        }
        
        // Check paddle collision
        if (newY >= 90) {
          if (newX >= pongPaddlePosition - 10 && newX <= pongPaddlePosition + 10) {
            trapBallSpeedRef.current.y = -Math.abs(trapBallSpeedRef.current.y);
            speedY = trapBallSpeedRef.current.y;
          } else if (newY >= 100) {
            // Reset ball
            return { x: 50, y: 20 };
          }
        }
        
        return { x: newX, y: newY };
      });
    }, 30);
    
    return () => clearInterval(gameLoop);
  }, [trapPongActive, pongPaddlePosition]);
  
  // Get current scenario for display
  const currentScenario = scenarios[currentPath];

  // Component render
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* Matrix Start Menu */}
      {showStartMenu ? (
        <div className="relative h-auto max-h-screen w-full max-w-2xl bg-black rounded-3xl p-4 shadow-lg overflow-hidden" style={{ minHeight: "700px" }}>
          {/* Matrix code rain effect */}
          <div className="absolute inset-0 overflow-hidden">
            {matrixCode.map((column, i) => (
              <div 
                key={i} 
                className="absolute"
                style={{
                  left: `${column.x}%`,
                  top: `${column.y}%`,
                  color: `rgba(0, 255, 70, ${0.5 + Math.random() * 0.5})`,
                  textShadow: '0 0 5px #0f0',
                  fontSize: `${Math.max(10, Math.min(16, 10 + Math.random() * 6))}px`,
                  fontFamily: 'monospace',
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                  opacity: Math.random() * 0.3 + 0.7,
                  zIndex: 1
                }}
              >
                {column.chars.join('')}
              </div>
            ))}
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-6">
            <h1 className="text-green-400 text-4xl font-bold mb-8 animate-pulse">Hack Attack Adventure</h1>
            
            <div className="bg-black bg-opacity-70 p-6 rounded-lg border border-green-500 mb-8 max-w-lg">
              <p className="text-green-300 mb-4">
                Welcome to Hack Attack Adventure, an interactive cybersecurity challenge that simulates 
                common online threats and teaches you how to stay safe.
              </p>
              <p className="text-green-300 mb-4">
                You'll navigate through scenarios involving potential hacking attempts, suspicious messages, 
                and deceptive pop-ups. Your choices will determine if you can protect your digital identity or 
                if you'll fall victim to cyber attacks.
              </p>
              <p className="text-green-300 mb-4">
                <span className="text-red-400 font-bold">WARNING:</span> This simulation will try to trick you! 
                Be vigilant about what you click on, even elements that seem harmless.
              </p>
              <p className="text-green-300">
                Are you ready to test your cybersecurity awareness?
              </p>
            </div>
            
            <button
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors"
              onClick={startMainGame}
            >
              START SIMULATION
            </button>
          </div>
        </div>
      ) : (
        <div className="h-auto max-h-screen w-full max-w-2xl bg-black rounded-3xl p-4 shadow-lg overflow-hidden" style={{ minHeight: "700px" }}>
          <div className="relative w-full h-full bg-gray-100 rounded-2xl overflow-auto flex flex-col" style={{ minHeight: "680px" }}>
            {/* Add custom CSS for animations */}
            <style dangerouslySetInnerHTML={{ __html: animations }} />
            
            {/* Top status bar */}
            <div className="bg-gray-100 px-4 flex justify-between items-center h-8 z-40">
              <span className="text-xs font-medium">{time}</span>
              <div className="flex items-center space-x-2">
                <SignalHigh size={16} />
                <Wifi size={16} />
                <Battery size={16} />
              </div>
            </div>

            {/* Distracting Banner */}
            {showBanner && !isHacked && !showPong && !showFinalTrap && (
              <div 
                className={`absolute ${banners[currentBanner].color} text-white p-4 shadow-lg cursor-pointer z-30 rounded`}
                style={{
                  ...slideDownAnimation,
                  left: `${bannerPosition.x}%`,
                  top: `${bannerPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: banners[currentBanner].size === "fullscreen" ? "95%" : 
                         banners[currentBanner].size === "large" ? "70%" : "auto",
                  maxWidth: banners[currentBanner].size === "normal" ? "250px" : "none",
                  animation: bannerMoving ? 'shake 0.5s infinite' : 'slideDown 0.5s ease-out forwards',
                  zIndex: banners[currentBanner].size === "fullscreen" ? 50 : 30,
                  boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                  border: '2px solid white'
                }}
                onClick={() => {
                  // For the first banner (game banner), start the pong game
                  if (currentBanner === 0) {
                    startPongGame();
                    setShowBanner(false);
                  } else {
                    setIsShuttingDown(true);
                    setTimeout(() => {
                      setIsHacked(true);
                      setIsShuttingDown(false);
                    }, 1000);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <p className={`flex-1 text-center font-bold ${banners[currentBanner].size === "large" || banners[currentBanner].size === "fullscreen" ? "text-lg" : "text-base"}`}>
                    {banners[currentBanner].text}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Make the X harder to hit for larger banners
                      if (banners[currentBanner].size === "large" || banners[currentBanner].size === "fullscreen") {
                        if (Math.random() > 0.5) {
                          setShowBanner(false);
                        } else {
                          // Move the banner when X is clicked but doesn't close
                          setBannerPosition({
                            x: Math.floor(Math.random() * 70),
                            y: Math.floor(Math.random() * 60)
                          });
                        }
                      } else {
                        setShowBanner(false);
                      }
                    }}
                    className="ml-2 p-1 hover:bg-white bg-opacity-20 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
                {banners[currentBanner].size === "fullscreen" && (
                  <div className="mt-4 flex justify-center">
                    <button
                      className="bg-green-400 text-white px-6 py-2 rounded-full font-bold text-lg animate-pulse"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsShuttingDown(true);
                        setTimeout(() => {
                          setIsHacked(true);
                          setIsShuttingDown(false);
                        }, 1000);
                      }}
                    >
                      DOWNLOAD NOW
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Pong Game */}
            {showPong && !isHacked && (
              <div 
                className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center"
                onMouseMove={handlePaddleMove}
              >
                <div className="relative w-full max-w-md h-96 border-2 border-white overflow-hidden">
                  {/* Ball */}
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full" 
                    style={{ 
                      left: `${pongBallPosition.x}%`, 
                      top: `${pongBallPosition.y}%`, 
                      transform: 'translate(-50%, -50%)' 
                    }}
                  />
                  
                  {/* Paddle */}
                  <div 
                    className="absolute bottom-0 h-2 w-20 bg-white rounded-full"
                    style={{ 
                      left: `${pongPaddlePosition}%`, 
                      transform: 'translateX(-50%)' 
                    }}
                  />
                  
                  {/* Score and Lives */}
                  <div className="absolute top-2 left-0 right-0 flex justify-between px-4">
                    <div className="text-white text-xl font-bold">
                      Score: {pongScore}
                    </div>
                    <div className="text-white text-xl font-bold">
                      Lives: {pongLives}
                    </div>
                  </div>
                  
                  {/* Game Over Message */}
                  {pongGameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                      <div className="text-center">
                        <p className="text-red-500 text-3xl font-bold mb-2">Game Over!</p>
                        <p className="text-white">Final Score: {pongScore}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Exit Button */}
                <button
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded"
                  onClick={() => {
                    setShowPong(false);
                    // 80% chance clicking exit button still leads to hack
                    if (Math.random() < 0.8) {
                      setIsShuttingDown(true);
                      setTimeout(() => {
                        setIsHacked(true);
                        setIsShuttingDown(false);
                      }, 1000);
                    }
                  }}
                >
                  Exit Game
                </button>
              </div>
            )}

            {/* Final Trap Mini-Game */}
            {showFinalTrap && !isHacked && (
              <div className="absolute inset-0 bg-gray-100 z-50 flex flex-col">
                {/* Mock message screen */}
                <div className="bg-blue-500 text-white p-4">
                  <h2 className="text-xl font-bold">Messages</h2>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto bg-blue-50" style={{ minHeight: "600px" }}>
                  {!trapPongActive && !showTrapReveal ? (
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl shadow-sm max-w-xs">
                          <p className="text-sm text-gray-800">Hey! You did really well in that lesson.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl shadow-sm max-w-xs">
                          <p className="text-sm text-gray-800">Click this. The teacher will never know, it's a game of pong. 🎮</p>
                          <button 
                            className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                            onClick={startFinalTrap}
                          >
                            Play Pong
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : trapPongActive ? (
                    // Simple Pong Game with timer
                    <div className="w-full h-96 bg-black relative rounded-lg overflow-hidden"
                         onMouseMove={handlePaddleMove}>
                      {/* Ball */}
                      <div 
                        className="absolute w-4 h-4 bg-white rounded-full" 
                        style={{ 
                          left: `${pongBallPosition.x}%`, 
                          top: `${pongBallPosition.y}%`, 
                          transform: 'translate(-50%, -50%)' 
                        }}
                      />
                      
                      {/* Paddle */}
                      <div 
                        className="absolute bottom-0 h-2 w-20 bg-white rounded-full"
                        style={{ 
                          left: `${pongPaddlePosition}%`, 
                          transform: 'translateX(-50%)' 
                        }}
                      />
                      
                      {/* Timer */}
                      <div className="absolute top-2 left-0 right-0 text-center">
                        <span className="text-white text-lg font-bold">
                          {trapPongTimer}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Reveal message - "YOU'VE BEEN HACKED"
                    <div className="w-full h-96 bg-black flex items-center justify-center relative rounded-lg">
                      <p className="text-red-500 text-4xl font-bold text-center animate-pulse">
                        DID YOU NOT LEARN ANYTHING?
                        <br />
                        YOU'VE BEEN HACKED!
                      </p>
                      
                      <div className="absolute top-4 right-4">
                        <Button 
                          variant="danger" 
                          onClick={handleReset}
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main container */}
            <div className="flex flex-1">
              {/* Messages section (left side) */}
              <div className="flex-1 flex flex-col border-r">
                {/* App Header */}
                <div className="bg-gray-200 p-2 text-center border-b relative">
                  <h1 className="text-lg font-semibold">Hack Attack Adventure</h1>
                  
                  {/* Occasional pop-up in the header */}
                  {showBanner && Math.random() < 0.3 && !isHacked && !showFinalTrap && (
                    <div 
                      className="absolute top-0 right-0 bg-yellow-400 text-black text-xs px-2 py-1 rounded-bl cursor-pointer"
                      onClick={() => {
                        setIsShuttingDown(true);
                        setTimeout(() => {
                          setIsHacked(true);
                          setIsShuttingDown(false);
                        }, 1000);
                      }}
                    >
                      1 new notification
                    </div>
                  )}
                </div>

                {/* Messages container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-2xl ${
                        message.type === 'sent' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 text-black'
                      }`}>
                        <p className="text-sm break-words">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-px" />
                </div>
              </div>

              {/* Choices section (right side) */}
              <div className="w-64 min-w-64 flex flex-col bg-gray-50 overflow-y-auto">
                <div className="flex-1 p-4 flex items-center">
                  <div className="w-full space-y-2 relative">
                    {/* Fake ad occasionally overlaps real buttons */}
                    {showBanner && Math.random() < 0.4 && !isHacked && !currentScenario.outcome && !showFinalTrap && (
                      <div 
                        className="absolute inset-0 bg-blue-100 border-2 border-blue-500 p-3 z-10 rounded-lg cursor-pointer"
                        style={{
                          boxShadow: '0 0 10px rgba(0,100,255,0.5)'
                        }}
                        onClick={() => {
                          setIsShuttingDown(true);
                          setTimeout(() => {
                            setIsHacked(true);
                            setIsShuttingDown(false);
                          }, 1000);
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="text-blue-800 font-bold">SECURITY ALERT</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // 50% chance it actually goes away
                              if (Math.random() > 0.5) {
                                setShowBanner(false);
                              }
                            }}
                            className="text-blue-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs mt-2 text-blue-700">Your account may be compromised. Click to scan and secure your device now!</p>
                        <button className="mt-2 w-full bg-blue-500 text-white py-1 rounded text-sm">
                          Secure Now
                        </button>
                      </div>
                    )}
                  
                    {!currentScenario.outcome ? (
                      <>
                        {currentScenario.choices.map((choice, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start text-left text-sm break-words mb-2"
                            onClick={() => handleChoice(choice.nextPath)}
                          >
                            {choice.text}
                          </Button>
                        ))}
                      </>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={handleReset}
                      >
                        Play Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="shrink-0 h-1 bg-gray-300 mx-auto w-32 rounded-full mb-1" />

            {/* Hacked Overlay */}
            {isHacked && (
              <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500 text-4xl font-bold mb-4" style={{animation: 'pulse 2s infinite'}}>
                    You got hacked!
                  </p>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500"
                    onClick={handleReset}
                  >
                    Restart Game
                  </Button>
                </div>
              </div>
            )}

            {/* Shutdown Animation */}
            {isShuttingDown && (
              <div className="absolute inset-0 bg-black z-10 opacity-80" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HackAttackAdventure;
