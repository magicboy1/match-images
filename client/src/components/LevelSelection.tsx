import { useMatchingGame, type Level } from "@/lib/stores/useMatchingGame";

export function LevelSelection() {
  const { selectLevel } = useMatchingGame();

  const handleLevelSelect = (level: Level) => {
    selectLevel(level);
  };

  return (
    <div className="difficulty-selection-screen" dir="rtl">
      <div className="difficulty-selection-container">
        <h1 className="selection-title animated-title">اختر المستوى!</h1>
        
        <div className="difficulty-options">
          <button
            className="difficulty-card easy-card"
            onClick={() => handleLevelSelect(1)}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="difficulty-icon">⭐</div>
            <div className="difficulty-name">المستوى 1</div>
            <div className="difficulty-description">صورتان</div>
          </button>
          
          <button
            className="difficulty-card medium-card"
            onClick={() => handleLevelSelect(2)}
            style={{ animationDelay: '0.35s' }}
          >
            <div className="difficulty-icon">⭐⭐</div>
            <div className="difficulty-name">المستوى 2</div>
            <div className="difficulty-description">أربع صور</div>
          </button>
          
          <button
            className="difficulty-card hard-card"
            onClick={() => handleLevelSelect(3)}
            style={{ animationDelay: '0.5s' }}
          >
            <div className="difficulty-icon">⭐⭐⭐</div>
            <div className="difficulty-name">المستوى 3</div>
            <div className="difficulty-description">ست صور</div>
          </button>
        </div>
      </div>
    </div>
  );
}
