import { create } from "zustand";

export type GameImage = "robot" | "scientist" | "girl" | "lock" | "earth" | "cloud";
export type GamePhase = "mode_selection" | "level_selection" | "character_selection" | "playing" | "game_over";
export type GameMode = "single" | "two_player";
export type Level = 1 | 2 | 3;

export interface GameCard {
  id: string;
  imageType: GameImage;
  position: number;
}

export interface SlotState {
  id: string;
  expectedImageType: GameImage;
  placedCard: GameCard | null;
  isCorrect: boolean;
}

export type FeedbackType = "correct" | "incorrect" | null;

interface MatchingGameState {
  phase: GamePhase;
  gameMode: GameMode | null;
  level: Level;
  player1Character: GameImage | null;
  player2Character: GameImage | null;
  
  // Game state
  shuffledCards: GameCard[];
  slots: SlotState[];
  selectedCard: GameCard | null;
  matchesFound: number;
  feedback: FeedbackType;
  feedbackSlotId: string | null;
  
  // Actions
  selectMode: (mode: GameMode) => void;
  selectLevel: (level: Level) => void;
  selectCharacter: (character: GameImage) => void;
  selectCard: (card: GameCard) => void;
  placeCard: (slotId: string) => void;
  advanceLevel: () => void;
  restart: () => void;
  resetToStart: () => void;
  initializeGame: () => void;
}

const imageTypes: GameImage[] = ["robot", "scientist", "girl", "lock", "earth", "cloud"];

const getImagesForLevel = (level: Level): GameImage[] => {
  if (level === 1) return ["robot", "girl"];
  if (level === 2) return ["robot", "scientist", "girl", "lock"];
  return ["robot", "scientist", "girl", "lock", "earth", "cloud"];
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const createGameCards = (level: Level): GameCard[] => {
  const images = getImagesForLevel(level);
  const cards: GameCard[] = images.map((imageType, index) => ({
    id: `card-${index}`,
    imageType,
    position: index
  }));
  return shuffleArray(cards);
};

const createSlots = (level: Level): SlotState[] => {
  const images = getImagesForLevel(level);
  return images.map((imageType, index) => ({
    id: `slot-${index}`,
    expectedImageType: imageType,
    placedCard: null,
    isCorrect: false
  }));
};

export const useMatchingGame = create<MatchingGameState>((set, get) => ({
  phase: "mode_selection",
  gameMode: null,
  level: 1,
  player1Character: null,
  player2Character: null,
  shuffledCards: [],
  slots: [],
  selectedCard: null,
  matchesFound: 0,
  feedback: null,
  feedbackSlotId: null,
  
  selectMode: (mode: GameMode) => {
    set({ 
      gameMode: mode, 
      phase: "level_selection"
    });
  },
  
  selectLevel: (level: Level) => {
    set({ 
      level,
      phase: "character_selection"
    });
  },
  
  selectCharacter: (character: GameImage) => {
    const { player1Character, gameMode } = get();
    
    if (!player1Character) {
      set({ player1Character: character });
      
      if (gameMode === "single") {
        const otherImages = imageTypes.filter(c => c !== character);
        const randomChar = otherImages[Math.floor(Math.random() * otherImages.length)];
        set({ player2Character: randomChar });
        get().initializeGame();
      }
    } else {
      if (character !== player1Character) {
        set({ player2Character: character });
        get().initializeGame();
      }
    }
  },
  
  initializeGame: () => {
    const { level } = get();
    const cards = createGameCards(level);
    const slots = createSlots(level);
    
    set({
      shuffledCards: cards,
      slots,
      selectedCard: null,
      matchesFound: 0,
      feedback: null,
      feedbackSlotId: null,
      phase: "playing"
    });
    
    console.log("Game initialized with level", level);
    console.log("Cards:", cards);
    console.log("Slots:", slots);
  },
  
  selectCard: (card: GameCard) => {
    const { selectedCard, slots } = get();
    
    // Check if this card is already placed
    const isPlaced = slots.some(slot => slot.placedCard?.id === card.id);
    if (isPlaced) {
      console.log("Card already placed, ignoring selection");
      return;
    }
    
    // Toggle selection
    if (selectedCard?.id === card.id) {
      set({ selectedCard: null });
      console.log("Card deselected");
    } else {
      set({ selectedCard: card });
      console.log("Card selected:", card);
    }
  },
  
  placeCard: (slotId: string) => {
    const { selectedCard, slots, matchesFound, level } = get();
    
    if (!selectedCard) {
      console.log("No card selected");
      return;
    }
    
    const slotIndex = slots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) {
      console.log("Slot not found");
      return;
    }
    
    const slot = slots[slotIndex];
    
    // Check if slot is already filled
    if (slot.placedCard) {
      console.log("Slot already filled");
      return;
    }
    
    // Check if it's a match
    const isCorrect = slot.expectedImageType === selectedCard.imageType;
    console.log("Placement attempt:", { slot: slotId, expected: slot.expectedImageType, placed: selectedCard.imageType, isCorrect });
    
    if (isCorrect) {
      // Correct match!
      const newSlots = [...slots];
      newSlots[slotIndex] = {
        ...slot,
        placedCard: selectedCard,
        isCorrect: true
      };
      
      const newMatchesFound = matchesFound + 1;
      const totalImages = getImagesForLevel(level).length;
      
      set({
        slots: newSlots,
        selectedCard: null,
        matchesFound: newMatchesFound,
        feedback: "correct",
        feedbackSlotId: slotId
      });
      
      // Clear feedback after animation
      setTimeout(() => {
        set({ feedback: null, feedbackSlotId: null });
        
        // Check if level is complete
        if (newMatchesFound === totalImages) {
          console.log("Level complete!");
          setTimeout(() => {
            set({ phase: "game_over" });
          }, 500);
        }
      }, 800);
      
    } else {
      // Incorrect match
      set({
        feedback: "incorrect",
        feedbackSlotId: slotId
      });
      
      // Return card after showing feedback
      setTimeout(() => {
        set({
          selectedCard: null,
          feedback: null,
          feedbackSlotId: null
        });
      }, 800);
    }
  },
  
  advanceLevel: () => {
    const { level } = get();
    if (level < 3) {
      const nextLevel = (level + 1) as Level;
      set({ 
        level: nextLevel,
        matchesFound: 0,
        selectedCard: null,
        feedback: null,
        feedbackSlotId: null
      });
      get().initializeGame();
    } else {
      // Game complete, go back to start
      get().resetToStart();
    }
  },
  
  restart: () => {
    set({
      matchesFound: 0,
      selectedCard: null,
      feedback: null,
      feedbackSlotId: null,
      phase: "playing"
    });
    get().initializeGame();
  },
  
  resetToStart: () => {
    set({
      phase: "mode_selection",
      gameMode: null,
      level: 1,
      player1Character: null,
      player2Character: null,
      shuffledCards: [],
      slots: [],
      selectedCard: null,
      matchesFound: 0,
      feedback: null,
      feedbackSlotId: null
    });
  }
}));
