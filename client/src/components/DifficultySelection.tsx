import { useTicTacToe, type Difficulty } from "@/lib/stores/useTicTacToe";

export function DifficultySelection() {
  const { selectDifficulty } = useTicTacToe();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    selectDifficulty(difficulty);
  };

  return (
    <div className="difficulty-selection-screen" dir="rtl">
      <div className="difficulty-selection-container">
        <h1 className="selection-title animated-title">اختر مستوى الصعوبة!</h1>
        
        <div className="difficulty-options">
          <button
            className="difficulty-card easy-card"
            onClick={() => handleDifficultySelect("easy")}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="difficulty-icon">😊</div>
            <div className="difficulty-name">سهل</div>
            <div className="difficulty-description">للمبتدئين</div>
          </button>
          
          <button
            className="difficulty-card medium-card"
            onClick={() => handleDifficultySelect("medium")}
            style={{ animationDelay: '0.35s' }}
          >
            <div className="difficulty-icon">🤔</div>
            <div className="difficulty-name">متوسط</div>
            <div className="difficulty-description">تحدي ممتع</div>
          </button>
          
          <button
            className="difficulty-card hard-card"
            onClick={() => handleDifficultySelect("hard")}
            style={{ animationDelay: '0.5s' }}
          >
            <div className="difficulty-icon">😎</div>
            <div className="difficulty-name">صعب</div>
            <div className="difficulty-description">للمحترفين</div>
          </button>
        </div>
      </div>
    </div>
  );
}
