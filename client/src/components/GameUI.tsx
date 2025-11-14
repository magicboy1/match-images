import { useTicTacToe, type Character } from "@/lib/stores/useTicTacToe";
import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { voiceManager } from "./VoiceManager";
import Confetti from "react-confetti";

const characterIcons: Record<Character, { icon: string; isImage?: boolean }> = {
  girl: { icon: "/characters/girl.png", isImage: true },
  robot: { icon: "/characters/robot.png", isImage: true },
  cat: { icon: "🐱" },
  dog: { icon: "🐶" },
  bear: { icon: "🐻" },
  lion: { icon: "🦁" }
};

export function GameUI() {
  const { phase, winner, restart, player1Character, player2Character, currentTurn, gameMode, unlockCharacter, resetToStart } = useTicTacToe();
  const { playSuccess } = useAudio();
  const prevTurnRef = useRef(currentTurn);

  useEffect(() => {
    if (phase === "playing" && currentTurn !== prevTurnRef.current) {
      prevTurnRef.current = currentTurn;
      
      if (currentTurn === "player1") {
        setTimeout(() => voiceManager.speakYourTurn(), 300);
      } else if (gameMode === "two_player") {
        setTimeout(() => voiceManager.speakPlayer2Turn(), 300);
      }
    }
  }, [currentTurn, phase, gameMode]);

  useEffect(() => {
    if (winner && winner !== "draw") {
      playSuccess();
      
      if (winner === "player1") {
        setTimeout(() => voiceManager.speakExcellent(), 500);
        
        const characters: Character[] = ["cat", "dog", "bear", "lion"];
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        setTimeout(() => {
          unlockCharacter(randomChar);
        }, 2000);
      } else {
        setTimeout(() => voiceManager.speakTryAgain(), 500);
      }
    } else if (winner === "draw") {
      setTimeout(() => voiceManager.speakDraw(), 500);
    }
  }, [winner, playSuccess, unlockCharacter]);

  if (phase !== "playing" && phase !== "game_over") {
    return null;
  }

  const getStatusMessage = () => {
    if (phase === "game_over") {
      if (winner === "player1") {
        return "رائع! فزت بالجولة 🎉";
      } else if (winner === "player2") {
        if (gameMode === "single") {
          return "حاول مرة ثانية! 💪";
        } else {
          return "اللاعب الثاني فاز! 🎉";
        }
      } else if (winner === "draw") {
        return "تعادل! جرب مرة ثانية 🤝";
      }
    } else if (currentTurn === "player1") {
      return gameMode === "two_player" ? "دور اللاعب الأول! 👆" : "دورك! 👆";
    } else {
      return gameMode === "two_player" ? "دور اللاعب الثاني! 👆" : "دور الروبوت... 🤔";
    }
    return "";
  };

  const getWinnerIcon = () => {
    if (winner === "draw") {
      return (
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
          {player1Character && (() => {
            const charData = characterIcons[player1Character];
            if (charData.isImage) {
              return <img src={charData.icon} alt="" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />;
            }
            return <span style={{ fontSize: '90px' }}>{charData.icon}</span>;
          })()}
          {player2Character && (() => {
            const charData = characterIcons[player2Character];
            if (charData.isImage) {
              return <img src={charData.icon} alt="" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />;
            }
            return <span style={{ fontSize: '90px' }}>{charData.icon}</span>;
          })()}
        </div>
      );
    }
    
    const winnerCharacter = winner === "player1" ? player1Character : player2Character;
    if (!winnerCharacter) return null;
    
    const charData = characterIcons[winnerCharacter];
    if (charData.isImage) {
      return <img src={charData.icon} alt="" style={{ width: '140px', height: '140px', objectFit: 'contain' }} />;
    }
    return <span style={{ fontSize: '140px' }}>{charData.icon}</span>;
  };

  const getGameOverMessage = () => {
    if (winner === "player1") {
      return "رائع! فزت بالجولة 🎉";
    } else if (winner === "player2") {
      if (gameMode === "single") {
        return "حاول مرة ثانية! 💪";
      } else {
        return "اللاعب الثاني فاز! 🎉";
      }
    } else if (winner === "draw") {
      return "تعادل! جرب مرة ثانية 🤝";
    }
    return "";
  };

  const getCurrentPlayerIcon = () => {
    const character = currentTurn === "player1" ? player1Character : player2Character;
    if (!character) return null;
    
    const charData = characterIcons[character];
    if (charData.isImage) {
      return <img src={charData.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    }
    return charData.icon;
  };

  const goToStart = () => {
    resetToStart();
  };

  return (
    <>
      <div className="game-header" dir="rtl">
        <div className="player-indicator">
          <div className="player-icon">{getCurrentPlayerIcon()}</div>
          <span className="player-label">
            {gameMode === "two_player" 
              ? (currentTurn === "player1" ? "اللاعب 1" : "اللاعب 2")
              : (currentTurn === "player1" ? "أنت" : "الروبوت")
            }
          </span>
        </div>
        
        <div className="status-message">
          {getStatusMessage()}
        </div>

        <div className="header-actions">
          <button className="header-button" onClick={restart}>
            <span>إعادة اللعب</span>
            <span>🔄</span>
          </button>
          <button className="header-button" onClick={goToStart}>
            <span>البداية</span>
            <span>🏠</span>
          </button>
        </div>
      </div>

      {phase === "game_over" && (
        <>
          {winner && winner !== "draw" && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={400}
              colors={['#48A079', '#E5F26B', '#F46A4E', '#2C3A52', '#FFFFFF']}
            />
          )}
          <div className="game-over-overlay" dir="rtl">
            <div className="game-over-card pulse">
              <div className="winner-icon-container">
                {getWinnerIcon()}
              </div>
              <h2 className="game-over-message animated">{getGameOverMessage()}</h2>
              <div className="game-over-actions">
                <button className="game-over-button primary" onClick={restart}>
                  <span>إعادة اللعب</span>
                  <span>🔄</span>
                </button>
                <button className="game-over-button secondary" onClick={goToStart}>
                  <span>البداية</span>
                  <span>🏠</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
