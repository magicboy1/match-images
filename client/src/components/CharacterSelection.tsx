import { useMatchingGame, type GameImage } from "@/lib/stores/useMatchingGame";

const characterData: Record<GameImage, { icon: string; name: string; isImage: boolean }> = {
  girl: { icon: "/game-images/girl.png", name: "البنت", isImage: true },
  robot: { icon: "/game-images/robot.png", name: "الروبوت", isImage: true },
  scientist: { icon: "/game-images/scientist.png", name: "العالم", isImage: true },
  lock: { icon: "/game-images/lock.png", name: "القفل", isImage: true },
  earth: { icon: "/game-images/earth.png", name: "الأرض", isImage: true },
  cloud: { icon: "/game-images/cloud.png", name: "السحابة", isImage: true }
};

export function CharacterSelection() {
  const { selectCharacter, player1Character, gameMode } = useMatchingGame();

  const handleCharacterSelect = (character: GameImage) => {
    selectCharacter(character);
  };

  const getTitle = () => {
    if (!player1Character) {
      return gameMode === "two_player" ? "اللاعب الأول: اختر شخصيتك!" : "اختر شخصيتك!";
    } else {
      return "اللاعب الثاني: اختر شخصيتك!";
    }
  };

  const availableCharacters = gameMode === "two_player" 
    ? (["girl", "robot", "scientist", "lock"] as GameImage[])
    : (["girl", "robot", "scientist", "earth"] as GameImage[]);

  return (
    <div className="character-selection-screen" dir="rtl">
      <div className="character-selection-container">
        <h1 className="selection-title animated-title">{getTitle()}</h1>
        
        <div className="character-options">
          {availableCharacters.map((character, index) => {
            const isSelected = character === player1Character;
            const charData = characterData[character];
            
            return (
              <button
                key={character}
                className={`character-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCharacterSelect(character)}
                disabled={isSelected}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="character-icon">
                  <img src={charData.icon} alt={charData.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="character-name">{charData.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
