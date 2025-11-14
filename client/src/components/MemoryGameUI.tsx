import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import Confetti from "react-confetti";

export function MemoryGameUI() {
  const { 
    level, 
    matchedPairs, 
    moves, 
    gameComplete,
    resetGame,
    nextLevel
  } = useMemoryGame();
  
  const { playSuccess, toggleMute, isMuted } = useAudio();

  useEffect(() => {
    if (gameComplete) {
      playSuccess();
    }
  }, [gameComplete, playSuccess]);

  const totalPairs = level === 1 ? 2 : level === 2 ? 4 : 6;
  const progress = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;

  return (
    <>
      {/* Game Header */}
      <div className="game-ui-overlay">
        <div className="game-header">
          {/* Left: Restart button */}
          <div className="header-left">
            <button className="header-button" onClick={resetGame}>
              إعادة
            </button>
          </div>

          {/* Center: Level + Pairs counter stacked */}
          <div className="header-center">
            <div className="level-indicator">
              المستوى {level}
            </div>
            {!gameComplete && (
              <div className="pairs-counter">
                {matchedPairs} / {totalPairs} أزواج
              </div>
            )}
          </div>

          {/* Right: Title */}
          <div className="header-right">
            <div className="game-title">لعبة تطابق الصور</div>
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
                أحسنت! اكتشفت كل الأزواج 🎊
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
                {level < 3 ? (
                  <>
                    <button className="game-over-button primary" onClick={nextLevel}>
                      المستوى التالي ▶
                    </button>
                    <button className="game-over-button secondary" onClick={resetGame}>
                      🔄 إعادة اللعب
                    </button>
                  </>
                ) : (
                  <>
                    <button className="game-over-button primary" onClick={() => nextLevel()}>
                      🔄 العب من جديد
                    </button>
                    <button className="game-over-button secondary" onClick={resetGame}>
                      إعادة المستوى
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
