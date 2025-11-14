import { useTicTacToe, type GameMode } from "@/lib/stores/useTicTacToe";

export function ModeSelection() {
  const { selectMode } = useTicTacToe();

  const handleModeSelect = (mode: GameMode) => {
    selectMode(mode);
  };

  return (
    <div className="mode-selection-screen" dir="rtl">
      <div className="mode-selection-container">
        <h1 className="selection-title animated-title">اختر نوع اللعبة!</h1>
        
        <div className="mode-options">
          <button
            className="mode-card single-player-card"
            onClick={() => handleModeSelect("single")}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="mode-icon">🤖</div>
            <div className="mode-name">لاعب واحد</div>
            <div className="mode-description">العب ضد الكمبيوتر</div>
          </button>
          
          <button
            className="mode-card two-player-card"
            onClick={() => handleModeSelect("two_player")}
            style={{ animationDelay: '0.35s' }}
          >
            <div className="mode-icon">👥</div>
            <div className="mode-name">لاعبان</div>
            <div className="mode-description">العب مع صديق</div>
          </button>
        </div>
      </div>
    </div>
  );
}
