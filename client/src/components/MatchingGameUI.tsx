import { useMatchingGame, type GameImage } from "@/lib/stores/useMatchingGame";
import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import Confetti from "react-confetti";

const characterIcons: Record<GameImage, { icon: string; isImage: boolean }> = {
  girl: { icon: "/game-images/girl.png", isImage: true },
  robot: { icon: "/game-images/robot.png", isImage: true },
  scientist: { icon: "/game-images/scientist.png", isImage: true },
  lock: { icon: "/game-images/lock.png", isImage: true },
  earth: { icon: "/game-images/earth.png", isImage: true },
  cloud: { icon: "/game-images/cloud.png", isImage: true }
};

export function MatchingGameUI() {
  const { 
    phase, 
    restart, 
    player1Character, 
    player2Character, 
    gameMode, 
    resetToStart,
    level,
    matchesFound,
    slots,
    advanceLevel
  } = useMatchingGame();
  
  const { playSuccess, toggleMute, isMuted } = useAudio();

  useEffect(() => {
    if (phase === "game_over") {
      playSuccess();
    }
  }, [phase, playSuccess]);

  if (phase !== "playing" && phase !== "game_over") {
    return null;
  }

  const totalImages = slots.length;
  const progress = totalImages > 0 ? (matchesFound / totalImages) * 100 : 0;

  const getStatusMessage = () => {
    if (phase === "game_over") {
      if (level < 3) {
        if (gameMode === "two_player") {
          return "أحسنتم! أكملتم المستوى بنجاح 🎉";
        }
        return "أحسنت! أكملت المستوى بنجاح 🎉";
      } else {
        if (gameMode === "two_player") {
          return "رائع! أكملتم جميع المستويات! 🌟";
        }
        return "رائع! أكملت جميع المستويات! 🌟";
      }
    } else {
      if (gameMode === "two_player") {
        return `المستوى ${level} - اختاروا الصور المناسبة`;
      }
      return `المستوى ${level} - اختر الصورة المناسبة`;
    }
  };

  const getWinnerIcon = () => {
    const character = player1Character;
    if (!character) return null;
    
    const charData = characterIcons[character];
    return <img src={charData.icon} alt="" style={{ width: '140px', height: '140px', objectFit: 'contain' }} />;
  };

  const goToStart = () => {
    resetToStart();
  };

  const handleNextLevel = () => {
    advanceLevel();
  };

  return (
    <>
      {/* Game Header */}
      <div className="game-ui-overlay">
        <div className="game-header">
          {/* Player indicator */}
          {player1Character && (
            <div className="player-indicator">
              <div className="player-icon">
                {(() => {
                  const charData = characterIcons[player1Character];
                  return <img src={charData.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
                })()}
              </div>
              <span className="player-label">
                {gameMode === "two_player" ? "معاً" : "أنت"}
              </span>
            </div>
          )}

          {/* Status message */}
          <div className="status-message">{getStatusMessage()}</div>

          {/* Header actions */}
          <div className="header-actions">
            <button 
              className="header-button"
              onClick={toggleMute}
              aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

        {/* Progress bar during play */}
        {phase === "playing" && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">{matchesFound} / {totalImages}</div>
          </div>
        )}

        {/* Game controls (restart button) */}
        {phase === "playing" && (
          <div className="game-controls">
            <button className="restart-button-small" onClick={restart}>
              🔄 إعادة
            </button>
          </div>
        )}
      </div>

      {/* Game Over Overlay */}
      {phase === "game_over" && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="game-over-overlay">
            <div className="game-over-card pulse">
              <div className="winner-icon-container">
                {getWinnerIcon()}
              </div>
              
              <div className="game-over-message animated">
                {level < 3 
                  ? (gameMode === "two_player" ? "أحسنتم! أكملتم المستوى بنجاح 🎉" : "أحسنت! أكملت المستوى بنجاح 🎉")
                  : (gameMode === "two_player" ? "رائع! أكملتم جميع المستويات! 🌟" : "رائع! أكملت جميع المستويات! 🌟")
                }
              </div>

              <div className="game-over-actions">
                {level < 3 ? (
                  <>
                    <button className="game-over-button primary" onClick={handleNextLevel}>
                      المستوى التالي ▶
                    </button>
                    <button className="game-over-button secondary" onClick={restart}>
                      🔄 إعادة اللعب
                    </button>
                  </>
                ) : (
                  <>
                    <button className="game-over-button primary" onClick={goToStart}>
                      🏠 القائمة الرئيسية
                    </button>
                    <button className="game-over-button secondary" onClick={restart}>
                      🔄 إعادة اللعب
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
