import { useMatchingGame } from "@/lib/stores/useMemoryGame";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import Confetti from "react-confetti";

export function MatchingGameUI() {
  const { 
    matchedPairs, 
    moves, 
    gameComplete,
    resetGame,
    nextLevel
  } = useMatchingGame();
  
  const { playCelebration } = useAudio();
  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [matchedPairs]);

  useEffect(() => {
    if (gameComplete) {
      playCelebration();
    }
  }, [gameComplete, playCelebration]);

  return (
    <>
      {/* Game Header - RTL Layout */}
      <div className="game-ui-overlay">
        <div className="game-header" dir="rtl" ref={headerRef}>
          {/* Right: Title (first in RTL) */}
          <div className="header-section">
            <div className="game-title">لعبة تطابق الصور</div>
          </div>

          {/* Center: Pairs counter */}
          <div className="header-section header-center">
            <div className="pairs-counter-header">
              الأزواج: {matchedPairs} / 5
            </div>
          </div>

          {/* Left: Restart button (last in RTL) */}
          <div className="header-section">
            <button className="header-button" onClick={resetGame}>
              إعادة
            </button>
          </div>
        </div>
      </div>

      {/* Game Complete Overlay */}
      {gameComplete && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="game-over-overlay">
            <div className="game-over-card pulse">
              <div className="celebration-icon">🎉</div>
              
              <div className="game-over-message animated">
                أحسنت! أكملت جميع الأزواج 🎉
              </div>

              <div className="game-stats">
                <div className="stat-item">
                  <span className="stat-value">{moves}</span>
                  <span className="stat-label">محاولات</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{matchedPairs}</span>
                  <span className="stat-label">أزواج</span>
                </div>
              </div>

              <div className="game-over-actions">
                <button className="game-over-button primary" onClick={resetGame}>
                  العب مرة أخرى 🎮
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
