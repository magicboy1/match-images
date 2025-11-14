import { useMatchingGame, type GameImage, type GameCard } from "@/lib/stores/useMatchingGame";
import { useAudio } from "@/lib/stores/useAudio";

const imageData: Record<GameImage, { src: string; name: string }> = {
  robot: { src: "/game-images/robot.png", name: "روبوت" },
  scientist: { src: "/game-images/scientist.png", name: "عالم" },
  girl: { src: "/game-images/girl.png", name: "بنت" },
  lock: { src: "/game-images/lock.png", name: "قفل" },
  earth: { src: "/game-images/earth.png", name: "أرض" },
  cloud: { src: "/game-images/cloud.png", name: "سحابة" }
};

export function MatchingBoard() {
  const { 
    shuffledCards, 
    slots, 
    selectedCard, 
    selectCard, 
    placeCard, 
    feedback, 
    feedbackSlotId,
    level 
  } = useMatchingGame();
  
  const { playHit, playSuccess } = useAudio();

  const handleCardClick = (card: GameCard) => {
    // Check if card is already placed
    const isPlaced = slots.some(slot => slot.placedCard?.id === card.id);
    if (!isPlaced) {
      playHit();
      selectCard(card);
    }
  };

  const handleSlotClick = (slotId: string) => {
    if (selectedCard) {
      const slot = slots.find(s => s.id === slotId);
      if (slot && !slot.placedCard) {
        playHit();
        placeCard(slotId);
      }
    }
  };

  // Determine grid layout based on level
  const getGridClass = () => {
    if (level === 1) return "grid-cols-1"; // 2 images: 1x2 (vertical)
    if (level === 2) return "grid-cols-2"; // 4 images: 2x2
    return "grid-cols-3"; // 6 images: 3x2 (3 columns, 2 rows)
  };

  const gridClass = getGridClass();

  return (
    <div className="matching-board-container" dir="rtl">
      <div className="matching-board-wrapper">
        {/* Left side: Shuffled images */}
        <div className="matching-section">
          <h2 className="section-title">اختر الصورة المناسبة</h2>
          <div className={`matching-grid ${gridClass}`}>
            {shuffledCards.map((card) => {
              const isPlaced = slots.some(slot => slot.placedCard?.id === card.id);
              const isSelected = selectedCard?.id === card.id;
              const imgData = imageData[card.imageType];
              
              return (
                <button
                  key={card.id}
                  className={`matching-card ${isPlaced ? 'placed' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCardClick(card)}
                  disabled={isPlaced}
                  style={{ animationDelay: `${card.position * 0.1}s` }}
                >
                  {!isPlaced && (
                    <img 
                      src={imgData.src} 
                      alt={imgData.name} 
                      className="card-image"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: Empty slots */}
        <div className="matching-section">
          <h2 className="section-title">ضع الصورة هنا</h2>
          <div className={`matching-grid ${gridClass}`}>
            {slots.map((slot, index) => {
              const imgData = imageData[slot.expectedImageType];
              const showFeedback = feedbackSlotId === slot.id && feedback;
              
              return (
                <button
                  key={slot.id}
                  className={`matching-slot ${slot.placedCard ? 'filled' : 'empty'} ${showFeedback === 'correct' ? 'correct-glow' : ''} ${showFeedback === 'incorrect' ? 'incorrect-glow' : ''}`}
                  onClick={() => handleSlotClick(slot.id)}
                  disabled={!!slot.placedCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {slot.placedCard ? (
                    <img 
                      src={imageData[slot.placedCard.imageType].src} 
                      alt={imageData[slot.placedCard.imageType].name}
                      className="card-image placed-animation"
                    />
                  ) : (
                    <div className="slot-outline">
                      <div className="slot-icon">?</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
