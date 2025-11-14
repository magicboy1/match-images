import { useMatchingGame, type CardImage } from "@/lib/stores/useMemoryGame";
import { useAudio } from "@/lib/stores/useAudio";

const cardImages: Record<CardImage, { src: string; name: string }> = {
  scientist: { src: "/game-images/scientist.png", name: "عالم" },
  microscope: { src: "/game-images/microscope.png", name: "مجهر" },
  robot: { src: "/game-images/robot.png", name: "روبوت" },
  gear: { src: "/game-images/gear.png", name: "ترس" },
  lock: { src: "/game-images/lock.png", name: "قفل" },
  key: { src: "/game-images/key.png", name: "مفتاح" },
  shield: { src: "/game-images/shield.png", name: "درع" },
  knight: { src: "/game-images/knight.png", name: "فارس" },
  earth: { src: "/game-images/earth.png", name: "أرض" },
  satellite: { src: "/game-images/satellite.png", name: "قمر صناعي" }
};

export function MatchingCardBoard() {
  const { cards, selectCard } = useMatchingGame();
  const { playHit, playSuccess } = useAudio();

  const handleCardClick = (cardId: string, isMatched: boolean) => {
    if (isMatched) return;
    playHit();
    selectCard(cardId);
  };

  return (
    <div className="matching-board-container" dir="rtl">
      {/* Grid with 10 cards (5 pairs) in 4x3 layout */}
      <div className="matching-grid">
        {cards.map((card, index) => {
          const imgData = cardImages[card.imageType];
          
          return (
            <button
              key={card.id}
              className={`matching-card ${card.isSelected ? 'selected' : ''} ${card.isMatched ? 'matched' : ''} ${card.showError ? 'error' : ''}`}
              onClick={() => handleCardClick(card.id, card.isMatched)}
              disabled={card.isMatched}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img 
                src={imgData.src} 
                alt={imgData.name}
                className="card-image"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
