import { create } from "zustand";

export type CardImage = "scientist" | "microscope" | "robot" | "gear" | "lock" | "key" | "shield" | "earth" | "satellite" | "knight" | "robot-head" | "robot-body" | "necklace" | "hero-girl" | "hero-boy" | "lock-blue" | "hero-girl-red" | "cloud-red" | "hero-boy-green" | "shield-green";

export interface Card {
  id: string;
  imageType: CardImage;
  pairId: number;
  isSelected: boolean;
  isMatched: boolean;
  showError: boolean;
}

interface MatchingGameState {
  cards: Card[];
  selectedCards: Card[];
  matchedPairs: number;
  moves: number;
  isProcessing: boolean;
  gameComplete: boolean;
  
  initializeGame: () => void;
  selectCard: (cardId: string) => void;
  resetGame: () => void;
  nextLevel: () => void;
}

// Define matching pairs - 5 pairs as requested (all unique images)
const cardPairs: Record<number, [CardImage, CardImage]> = {
  1: ["robot-head", "robot-body"],
  2: ["necklace", "hero-girl"],
  3: ["hero-boy", "lock-blue"],
  4: ["hero-girl-red", "cloud-red"],
  5: ["hero-boy-green", "shield-green"],
};

const createCardDeck = (): Card[] => {
  const cards: Card[] = [];
  
  // Create all 5 pairs (10 cards total)
  for (let i = 1; i <= 5; i++) {
    const pair = cardPairs[i];
    if (pair) {
      cards.push({
        id: `card-${i}-a`,
        imageType: pair[0],
        pairId: i,
        isSelected: false,
        isMatched: false,
        showError: false
      });
      cards.push({
        id: `card-${i}-b`,
        imageType: pair[1],
        pairId: i,
        isSelected: false,
        isMatched: false,
        showError: false
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

export const useMatchingGame = create<MatchingGameState>((set, get) => ({
  cards: [],
  selectedCards: [],
  matchedPairs: 0,
  moves: 0,
  isProcessing: false,
  gameComplete: false,
  
  initializeGame: () => {
    const cards = createCardDeck();
    set({
      cards,
      selectedCards: [],
      matchedPairs: 0,
      moves: 0,
      isProcessing: false,
      gameComplete: false
    });
    console.log("Matching game initialized with 5 pairs");
  },
  
  selectCard: (cardId: string) => {
    const { cards, selectedCards, isProcessing, matchedPairs } = get();
    
    // Don't allow selecting if processing or already 2 cards selected
    if (isProcessing || selectedCards.length >= 2) {
      return;
    }
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isSelected || card.isMatched) {
      return;
    }
    
    // Select the card - store the updated card object (not the old reference)
    const updatedCard = { ...card, isSelected: true };
    const newCards = cards.map(c =>
      c.id === cardId ? updatedCard : c
    );
    
    const newSelectedCards = [...selectedCards, updatedCard];
    
    set({
      cards: newCards,
      selectedCards: newSelectedCards,
      moves: get().moves + (selectedCards.length === 0 ? 1 : 0)
    });
    
    // Check if we have 2 cards selected
    if (newSelectedCards.length === 2) {
      set({ isProcessing: true });
      
      const [first, second] = newSelectedCards;
      const isMatch = first.pairId === second.pairId;
      
      console.log("Checking match:", { 
        first: first.imageType, 
        second: second.imageType, 
        pairId: first.pairId,
        isMatch 
      });
      
      if (isMatch) {
        // Match found! Show green glow
        setTimeout(() => {
          const updatedCards = get().cards.map(c =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true, isSelected: false }
              : c
          );
          
          const newMatchedPairs = matchedPairs + 1;
          const isGameComplete = newMatchedPairs === 5; // Total 5 pairs
          
          set({
            cards: updatedCards,
            selectedCards: [],
            matchedPairs: newMatchedPairs,
            isProcessing: false,
            gameComplete: isGameComplete
          });
          
          if (isGameComplete) {
            console.log("Game complete! All 5 pairs matched!");
          }
        }, 600);
      } else {
        // No match - show red shake animation then reset
        const errorCards = get().cards.map(c =>
          c.id === first.id || c.id === second.id
            ? { ...c, showError: true }
            : c
        );
        set({ cards: errorCards });
        
        setTimeout(() => {
          const updatedCards = get().cards.map(c =>
            c.id === first.id || c.id === second.id
              ? { ...c, isSelected: false, showError: false }
              : c
          );
          
          set({
            cards: updatedCards,
            selectedCards: [],
            isProcessing: false
          });
        }, 800);
      }
    }
  },
  
  resetGame: () => {
    get().initializeGame();
  },
  
  nextLevel: () => {
    // For now, just restart the game (can expand to multiple levels later)
    get().initializeGame();
  }
}));
