import { useTicTacToe, type Character } from "@/lib/stores/useTicTacToe";
import { useAudio } from "@/lib/stores/useAudio";

const characterIcons: Record<Character, { icon: string; isImage?: boolean }> = {
  girl: { icon: "/characters/girl.png", isImage: true },
  robot: { icon: "/characters/robot.png", isImage: true },
  cat: { icon: "🐱" },
  dog: { icon: "🐶" },
  bear: { icon: "🐻" },
  lion: { icon: "🦁" }
};

export function GameBoard() {
  const { board, makeMove, player1Character, player2Character, currentTurn, gameMode } = useTicTacToe();
  const { playHit } = useAudio();

  const handleCellClick = (index: number) => {
    if (board[index] === null) {
      playHit();
      makeMove(index);
    }
  };

  const getCharacterIcon = (cellValue: "player1" | "player2" | null) => {
    if (cellValue === null) return null;
    
    const character = cellValue === "player1" ? player1Character : player2Character;
    
    if (character) {
      const charData = characterIcons[character];
      if (charData.isImage) {
        return <img src={charData.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
      }
      return charData.icon;
    }
    return null;
  };

  const canClick = (index: number) => {
    if (board[index] !== null) return false;
    if (gameMode === "two_player") return true;
    return currentTurn === "player1";
  };

  return (
    <div className="game-board-container">
      <div className="game-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`game-cell ${cell !== null ? 'filled' : ''} ${canClick(index) ? 'clickable' : ''}`}
            onClick={() => handleCellClick(index)}
            disabled={!canClick(index)}
          >
            <div className="cell-icon">{getCharacterIcon(cell)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
