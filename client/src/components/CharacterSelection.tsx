import { useTicTacToe, type Character } from "@/lib/stores/useTicTacToe";

const characterData: Record<Character, { icon: string; name: string; isImage?: boolean }> = {
  girl: { icon: "/characters/girl.png", name: "البنت", isImage: true },
  robot: { icon: "/characters/robot.png", name: "الروبوت", isImage: true },
  cat: { icon: "🐱", name: "القطة" },
  dog: { icon: "🐶", name: "الكلب" },
  bear: { icon: "🐻", name: "الدب" },
  lion: { icon: "🦁", name: "الأسد" }
};

export function CharacterSelection() {
  const { selectCharacter, unlockedCharacters, player1Character, gameMode } = useTicTacToe();

  const handleCharacterSelect = (character: Character) => {
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
    ? (["girl", "robot"] as Character[])
    : (Object.keys(characterData) as Character[]);

  return (
    <div className="character-selection-screen" dir="rtl">
      <div className="character-selection-container">
        <h1 className="selection-title">{getTitle()}</h1>
        
        <div className="character-options">
          {availableCharacters.map((character) => {
            const isUnlocked = gameMode === "two_player" || unlockedCharacters.includes(character);
            const isSelected = character === player1Character;
            const charData = characterData[character];
            
            return (
              <button
                key={character}
                className={`character-card ${!isUnlocked ? 'locked' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => isUnlocked && handleCharacterSelect(character)}
                disabled={!isUnlocked || isSelected}
              >
                <div className="character-icon">
                  {charData.isImage ? (
                    <img src={charData.icon} alt={charData.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    charData.icon
                  )}
                </div>
                <div className="character-name">{charData.name}</div>
                {!isUnlocked && <div className="lock-badge">🔒</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
