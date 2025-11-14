import { useTicTacToe, type Character } from "@/lib/stores/useTicTacToe";
import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { voiceManager } from "./VoiceManager";
import Confetti from "react-confetti";

const characterIcons: Record<Character, string> = {
  girl: "👧",
  robot: "🤖",
  cat: "🐱",
  dog: "🐶",
  bear: "🐻",
  lion: "🦁"
};

export function GameUI() {
  const { phase, winner, restart, player1Character, player2Character, currentTurn, gameMode, unlockCharacter } = useTicTacToe();
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

  const getCurrentPlayerIcon = () => {
    const character = currentTurn === "player1" ? player1Character : player2Character;
    return character ? characterIcons[character] : "";
  };

  return (
    <>
      <div className="game-header" dir="rtl">
        <div className="player-indicator">
          <span className="player-icon">{getCurrentPlayerIcon()}</span>
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
      </div>

      <div className="game-ui-overlay" dir="rtl">
        {phase === "game_over" && (
          <div className="game-over-overlay">
            {winner && winner !== "draw" && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={400}
                colors={['#48A079', '#E5F26B', '#F46A4E', '#2C3A52', '#FFFFFF']}
              />
            )}
            <div className="game-over-card celebration-card">
              <h2 className="game-over-message">{getStatusMessage()}</h2>
              {winner === "player1" && (
                <div className="win-celebration">
                  <div className="celebration-text">أحسنت! 🎊</div>
                </div>
              )}
              <button className="restart-button" onClick={restart}>
                إعادة اللعب 🔄
              </button>
            </div>
          </div>
        )}

        {phase === "playing" && (
          <div className="game-controls">
            <button className="restart-button-small" onClick={restart}>
              إعادة اللعب 🔄
            </button>
          </div>
        )}
      </div>
    </>
  );
}
