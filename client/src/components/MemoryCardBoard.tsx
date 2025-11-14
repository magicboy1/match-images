import { useMemoryGame, type CardImage } from "@/lib/stores/useMemoryGame";
import { useAudio } from "@/lib/stores/useAudio";

const cardImages: Record<CardImage, { src: string; name: string }> = {
  scientist: { src: "/game-images/scientist.png", name: "عالم" },
  microscope: { src: "/game-images/microscope.png", name: "مجهر" },
  robot: { src: "/game-images/robot.png", name: "روبوت" },
  gear: { src: "/game-images/gear.png", name: "ترس" },
  lock: { src: "/game-images/lock.png", name: "قفل" },
  key: { src: "/game-images/key.png", name: "مفتاح" },
  girl: { src: "/game-images/girl.png", name: "بنت" },
  earth: { src: "/game-images/earth.png", name: "أرض" },
  cloud: { src: "/game-images/cloud.png", name: "سحابة" },
  shield: { src: "/game-images/shield.png", name: "درع" },
  knight: { src: "/game-images/knight.png", name: "فارس" },
  rainbow: { src: "/game-images/rainbow.png", name: "قوس قزح" }
};

export function MemoryCardBoard() {
  const { cards, flipCard, level } = useMemoryGame();
  const { playHit } = useAudio();

  const handleCardClick = (cardId: string) => {
    playHit();
    flipCard(cardId);
  };

  // Determine grid class based on level
  const getGridClass = () => {
    if (level === 1) return "memory-grid-2x2"; // 2x2 = 4 cards
    if (level === 2) return "memory-grid-2x4"; // 2x4 = 8 cards
    return "memory-grid-3x4"; // 3x4 = 12 cards
  };

  const gridClass = getGridClass();

  return (
    <div className="memory-board-container" dir="rtl">
      <div className={`memory-grid ${gridClass}`}>
        {cards.map((card, index) => {
          const imgData = cardImages[card.imageType];
          const showFront = card.isFlipped || card.isMatched;
          
          return (
            <button
              key={card.id}
              className={`memory-card ${showFront ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-inner">
                {/* Card Back */}
                <div className="card-back">
                  <div className="card-back-pattern">?</div>
                </div>
                
                {/* Card Front */}
                <div className="card-front">
                  <img 
                    src={imgData.src} 
                    alt={imgData.name}
                    className="card-image"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
