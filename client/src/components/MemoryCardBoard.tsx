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
  satellite: { src: "/game-images/satellite.png", name: "قمر صناعي" },
  "robot-head": { src: "/game-images/robot-head.png", name: "رأس روبوت" },
  "robot-body": { src: "/game-images/robot-body.png", name: "جسم روبوت" },
  necklace: { src: "/game-images/necklace.png", name: "عقد" },
  "hero-girl": { src: "/game-images/hero-girl.png", name: "بطلة" },
  "hero-boy": { src: "/game-images/hero-boy.png", name: "بطل" },
  "lock-blue": { src: "/game-images/lock-blue.png", name: "قفل" },
  "hero-girl-red": { src: "/game-images/hero-girl-red.png", name: "بطلة" },
  "cloud-red": { src: "/game-images/cloud-red.png", name: "سحابة" },
  "hero-boy-green": { src: "/game-images/hero-boy-green.png", name: "بطل" },
  "shield-green": { src: "/game-images/shield-green.png", name: "درع" }
};

export function MatchingCardBoard() {
  const { cards, selectCard } = useMatchingGame();
  const { playHit, playSuccess } = useAudio();

  const handleCardClick = (cardId: string, isMatched: boolean) => {
    if (isMatched) return;
    playHit();
    selectCard(cardId);
  };

  // Images that should be displayed smaller
  const smallImages = ["lock-blue", "shield-green", "necklace", "cloud-red"];

  return (
    <div className="matching-board-container" dir="rtl">
      {/* Grid with 10 cards (5 pairs) in 4x3 layout */}
      <div className="matching-grid">
        {cards.map((card, index) => {
          const imgData = cardImages[card.imageType];
          const isSmallImage = smallImages.includes(card.imageType);
          
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
                className={isSmallImage ? "card-image-small" : "card-image"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
