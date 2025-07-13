import { useEffect, useState, useRef } from "react";
import TerminalPortfolio from "./components/TerminalPortfolio";

export default function App() {
  const [phase, setPhase] = useState(0);
  const [matrixChars, setMatrixChars] = useState([]);
  const [displayText, setDisplayText] = useState("");
  const containerRef = useRef(null);
  const textRef = useRef(null);

  // Animation timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),    // Fade in background
      setTimeout(() => setPhase(2), 800),   // Matrix rain starts
      setTimeout(() => setPhase(3), 1200),   // Typing starts
      setTimeout(() => setPhase(4), 3000),   // Full text shown
      setTimeout(() => setPhase(5), 4500),   // Glow effect
      setTimeout(() => setPhase(6), 6000),   // Final transition
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Optimized matrix rain effect
  useEffect(() => {
    if (phase >= 2 && phase < 6) {
      const chars = '01█■◆◇♠♣♥☻☺☼•○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲►▼◄⌂';
      const getColumns = () => Math.max(15, Math.floor(window.innerWidth / 22));

      let columns = getColumns();
      let drops = Array(columns).fill(1);
      let matrix = [];

      const updateMatrix = () => {
        // Clear matrix while keeping some trails
        matrix = matrix.filter(char => Math.random() > 0.3);

        // Add new characters
        drops.forEach((_, i) => {
          if (Math.random() > 0.7) {
            matrix.push({
              char: chars[Math.floor(Math.random() * chars.length)],
              x: i * 22,
              y: 0,
              speed: Math.random() * 2 + 1,
              opacity: Math.random() * 0.6 + 0.4,
              lifetime: Math.floor(Math.random() * 20) + 10
            });
          }
        });

        // Update positions
        matrix.forEach(char => {
          char.y += char.speed;
          char.lifetime -= 1;
          char.opacity = Math.min(char.opacity, char.lifetime / 10);
        });

        // Remove old characters
        matrix = matrix.filter(char => char.lifetime > 0 && char.y < window.innerHeight + 50);

        setMatrixChars(matrix);
      };

      const interval = setInterval(updateMatrix, 50);
      const resizeHandler = () => {
        columns = getColumns();
        drops = Array(columns).fill(1);
      };

      window.addEventListener('resize', resizeHandler);

      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', resizeHandler);
      };
    }
  }, [phase]);

  // Typing effect with realistic pacing
  useEffect(() => {
    if (phase >= 3 && phase < 6) {
      const fullText = "YASH GANDHI";
      const subtitle = "FULL-STACK DEVELOPER";
      let currentIndex = 0;
      let currentLine = 0;
      let typingSpeed = 80;

      const typeNextChar = () => {
        if (currentLine === 0 && currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;

          // Vary typing speed slightly
          const nextDelay = typingSpeed + (currentIndex % 3 === 0 ? Math.random() * 40 - 20 : 0);
          setTimeout(typeNextChar, nextDelay);
        }
        else if (currentLine === 0) {
          currentLine = 1;
          currentIndex = 0;
          setTimeout(typeNextChar, 500);
        }
        else if (currentLine === 1 && currentIndex <= subtitle.length) {
          setDisplayText(prev => prev + "\n" + subtitle.slice(0, currentIndex));
          currentIndex++;
          setTimeout(typeNextChar, typingSpeed * 1.5);
        }
      };

      typeNextChar();

      return () => clearTimeout();
    }
  }, [phase]);

  if (phase >= 6) {
    return <TerminalPortfolio />;
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-90" />

      {/* Matrix rain - now more organized */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.15]">
        {matrixChars.map((item, i) => (
          <div
            key={i}
            className="absolute text-green-400 font-mono transition-all duration-200"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              opacity: item.opacity,
              fontSize: '16px',
              textShadow: `0 0 ${Math.random() * 3 + 3}px rgba(0, 255, 0, ${item.opacity * 0.7})`,
              transform: `translateY(${item.speed}px)`
            }}
          >
            {item.char}
          </div>
        ))}
      </div>

      {/* Clean scan lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-green-400/5 to-transparent"
            style={{
              top: `${(i / 30) * 100}%`,
              animation: `scanline ${3 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div
        ref={containerRef}
        className="relative z-10 text-center px-6 w-full max-w-4xl"
      >
        {/* Main text with proper hierarchy */}
        <div
          ref={textRef}
          className="transition-all duration-700 ease-out whitespace-pre-line"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: `
              translateY(${phase >= 3 ? 0 : 10}px)
              scale(${phase >= 3 ? 1 : 0.97})
            `,
            filter: phase >= 5 ? 'brightness(1.1)' : 'brightness(1)',
            textShadow: phase >= 5
              ? '0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5)'
              : '0 0 5px rgba(0, 255, 0, 0.3)'
          }}
        >
          <h1 className="text-green-400 font-bold leading-none mb-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
            {displayText.split('\n')[0]}
            {phase >= 3 && phase < 4 && displayText.split('\n')[0].length < "YASH PATEL".length && (
              <span className="inline-block w-2 h-8 bg-green-400 ml-1 animate-pulse" />
            )}
          </h1>

          {displayText.includes('\n') && (
            <h2 className="text-green-500 font-mono mt-2 text-lg sm:text-xl md:text-2xl tracking-wider">
              {displayText.split('\n')[1]}
              {phase >= 3 && phase < 4 && displayText.split('\n')[1].length < "FULL-STACK DEVELOPER".length && (
                <span className="inline-block w-2 h-5 bg-green-500 ml-1 animate-pulse" />
              )}
            </h2>
          )}
        </div>

        {/* Status line */}
        {phase >= 4 && (
          <div
            className="mt-6 text-green-600 transition-all duration-500 ease-out font-mono text-sm sm:text-base"
            style={{
              opacity: phase >= 4 ? 1 : 0,
              transform: `translateY(${phase >= 4 ? 0 : 5}px)`,
              transitionDelay: '300ms'
            }}
          >
            <span className="opacity-70">&gt;</span> System ready — Press any key to continue
          </div>
        )}

        {/* Glow overlay */}
        {phase >= 5 && (
          <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay" style={{
            background: `radial-gradient(circle at center, rgba(0,255,0,0.15) 0%, transparent 70%)`,
            opacity: 0.5,
            animation: 'pulseGlow 3s ease-in-out infinite alternate'
          }} />
        )}
      </div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-green-400"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: phase >= 2 ? Math.random() * 0.3 + 0.1 : 0,
              animation: `float ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* CRT border effect */}
      <div className="absolute inset-0 pointer-events-none border border-green-400/10 rounded-sm" style={{
        boxShadow: 'inset 0 0 30px rgba(0, 255, 0, 0.1)',
        opacity: 0.5
      }} />

      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes float {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); opacity: 0; }
        }
        
        @keyframes pulseGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
        
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 5px #00ff00; }
          50% { text-shadow: 0 0 15px #00ff00; }
        }
      `}</style>
    </div>
  );
}