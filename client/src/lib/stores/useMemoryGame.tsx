import { create } from "zustand";

export type CardImage = "scientist" | "microscope" | "robot" | "gear" | "lock" | "key" | "girl" | "earth" | "cloud" | "shield" | "knight" | "rainbow";
export type Level = 1 | 2 | 3;

export interface Card {
  id: string;
  imageType: CardImage;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameState {
  level: Level;
  cards: Card[];
  flippedCards: Card[];
  matchedPairs: number;
  moves: number;
  isProcessing: boolean;
  gameComplete: boolean;
  
  initializeGame: (level: Level) => void;
  flipCard: (cardId: string) => void;
  resetGame: () => void;
  nextLevel: () => void;
}

// Define matching pairs - each pair has a concept relationship (all unique images)
const cardPairs: Record<number, [CardImage, CardImage]> = {
  1: ["scientist", "microscope"],
  2: ["robot", "gear"],
  3: ["lock", "key"],
  4: ["shield", "knight"],
  5: ["girl", "earth"],
  6: ["cloud", "rainbow"],
};

const createCardDeck = (level: Level): Card[] => {
  const pairsCount = level === 1 ? 2 : level === 2 ? 4 : 6;
  const cards: Card[] = [];
  
  for (let i = 1; i <= pairsCount; i++) {
    const pair = cardPairs[i];
    if (pair) {
      cards.push({
        id: `card-${i}-a`,
        imageType: pair[0],
        pairId: i,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `card-${i}-b`,
        imageType: pair[1],
        pairId: i,
        isFlipped: false,
        isMatched: false
      });
    }
  }
  
  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  return cards;
};

export const useMemoryGame = create<MemoryGameState>((set, get) => ({
  level: 1,
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  isProcessing: false,
  gameComplete: false,
  
  initializeGame: (level: Level) => {
    const cards = createCardDeck(level);
    set({
      level,
      cards,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      isProcessing: false,
      gameComplete: false
    });
    console.log(`Memory game initialized - Level ${level}`);
  },
  
  flipCard: (cardId: string) => {
    const { cards, flippedCards, isProcessing, matchedPairs, level } = get();
    
    // Don't allow flipping if processing or already 2 cards flipped
    if (isProcessing || flippedCards.length >= 2) {
      return;
    }
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) {
      return;
    }
    
    // Flip the card
    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    
    const newFlippedCards = [...flippedCards, card];
    
    set({
      cards: newCards,
      flippedCards: newFlippedCards,
      moves: get().moves + (flippedCards.length === 0 ? 1 : 0)
    });
    
    // Check if we have 2 cards flipped
    if (newFlippedCards.length === 2) {
      set({ isProcessing: true });
      
      const [first, second] = newFlippedCards;
      const isMatch = first.pairId === second.pairId;
      
      console.log("Checking match:", { 
        first: first.imageType, 
        second: second.imageType, 
        pairId: first.pairId,
        isMatch 
      });
      
      if (isMatch) {
        // Match found!
        setTimeout(() => {
          const updatedCards = get().cards.map(c =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true }
              : c
          );
          
          const newMatchedPairs = matchedPairs + 1;
          const totalPairs = level === 1 ? 2 : level === 2 ? 4 : 6;
          const isGameComplete = newMatchedPairs === totalPairs;
          
          set({
            cards: updatedCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            isProcessing: false,
            gameComplete: isGameComplete
          });
          
          if (isGameComplete) {
            console.log("Level complete!");
          }
        }, 600);
      } else {
        // No match - flip back
        setTimeout(() => {
          const updatedCards = get().cards.map(c =>
            c.id === first.id || c.id === second.id
              ? { ...c, isFlipped: false }
              : c
          );
          
          set({
            cards: updatedCards,
            flippedCards: [],
            isProcessing: false
          });
        }, 1200);
      }
    }
  },
  
  resetGame: () => {
    const { level } = get();
    get().initializeGame(level);
  },
  
  nextLevel: () => {
    const { level } = get();
    const nextLevel = level < 3 ? (level + 1) as Level : 1 as Level;
    get().initializeGame(nextLevel);
  }
}));
