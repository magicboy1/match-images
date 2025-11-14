import { create } from "zustand";

export type Character = "girl" | "robot" | "cat" | "dog" | "bear" | "lion";
export type Player = "player1" | "player2";
export type CellValue = null | Player;
export type GamePhase = "mode_selection" | "difficulty_selection" | "character_selection" | "playing" | "game_over";
export type GameMode = "single" | "two_player";
export type Difficulty = "easy" | "medium" | "hard";

interface TicTacToeState {
  phase: GamePhase;
  gameMode: GameMode | null;
  difficulty: Difficulty | null;
  player1Character: Character | null;
  player2Character: Character | null;
  board: CellValue[];
  currentTurn: Player;
  winner: Player | "draw" | null;
  unlockedCharacters: Character[];
  
  selectMode: (mode: GameMode) => void;
  selectDifficulty: (difficulty: Difficulty) => void;
  selectCharacter: (character: Character) => void;
  makeMove: (index: number) => void;
  restart: () => void;
  resetToStart: () => void;
  checkWinner: () => Player | "draw" | null;
  makeAIMove: () => void;
  findSmartMove: (board: CellValue[]) => number;
  unlockCharacter: (character: Character) => void;
}

const initialBoard: CellValue[] = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export const useTicTacToe = create<TicTacToeState>((set, get) => ({
  phase: "mode_selection",
  gameMode: null,
  difficulty: null,
  player1Character: null,
  player2Character: null,
  board: initialBoard,
  currentTurn: "player1",
  winner: null,
  unlockedCharacters: ["girl", "robot"],
  
  selectMode: (mode: GameMode) => {
    if (mode === "single") {
      set({ gameMode: mode, phase: "difficulty_selection" });
    } else {
      set({ gameMode: mode, phase: "character_selection" });
    }
  },
  
  selectDifficulty: (difficulty: Difficulty) => {
    set({ difficulty, phase: "character_selection" });
  },
  
  selectCharacter: (character: Character) => {
    const { player1Character, gameMode } = get();
    
    if (!player1Character) {
      set({ player1Character: character });
      
      if (gameMode === "single") {
        const aiChars: Character[] = ["girl", "robot", "cat", "dog", "bear", "lion"];
        const availableAiChars = aiChars.filter(c => c !== character);
        const aiChar = availableAiChars[Math.floor(Math.random() * availableAiChars.length)];
        set({ player2Character: aiChar, phase: "playing" });
      }
    } else {
      if (character !== player1Character) {
        set({ player2Character: character, phase: "playing" });
      }
    }
  },
  
  unlockCharacter: (character: Character) => {
    const { unlockedCharacters } = get();
    if (!unlockedCharacters.includes(character)) {
      set({ unlockedCharacters: [...unlockedCharacters, character] });
    }
  },
  
  checkWinner: () => {
    const { board } = get();
    
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player;
      }
    }
    
    if (board.every(cell => cell !== null)) {
      return "draw";
    }
    
    return null;
  },
  
  makeMove: (index: number) => {
    const { board, currentTurn, winner, phase, gameMode } = get();
    
    if (phase !== "playing" || winner || board[index]) {
      return;
    }
    
    const newBoard = [...board];
    newBoard[index] = currentTurn;
    
    set({ board: newBoard });
    
    const result = get().checkWinner();
    
    if (result) {
      set({ winner: result, phase: "game_over" });
    } else {
      const nextTurn = currentTurn === "player1" ? "player2" : "player1";
      set({ currentTurn: nextTurn });
      
      if (gameMode === "single" && nextTurn === "player2") {
        setTimeout(() => {
          get().makeAIMove();
        }, 500);
      }
    }
  },
  
  makeAIMove: () => {
    const { board, winner, phase, difficulty } = get();
    
    if (phase !== "playing" || winner) {
      return;
    }
    
    const emptyIndices = board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];
    
    if (emptyIndices.length === 0) {
      return;
    }
    
    let aiMoveIndex: number;
    
    if (difficulty === "easy") {
      aiMoveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else if (difficulty === "medium") {
      const shouldPlaySmart = Math.random() > 0.4;
      
      if (shouldPlaySmart) {
        const smartMove = get().findSmartMove(board);
        if (smartMove !== -1) {
          aiMoveIndex = smartMove;
        } else {
          aiMoveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
      } else {
        aiMoveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    } else {
      const smartMove = get().findSmartMove(board);
      if (smartMove !== -1) {
        aiMoveIndex = smartMove;
      } else if (board[4] === null) {
        aiMoveIndex = 4;
      } else {
        const corners = [0, 2, 6, 8].filter(i => board[i] === null);
        if (corners.length > 0) {
          aiMoveIndex = corners[Math.floor(Math.random() * corners.length)];
        } else {
          aiMoveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
      }
    }
    
    const newBoard = [...board];
    newBoard[aiMoveIndex] = "player2";
    set({ board: newBoard, currentTurn: "player1" });
    
    const result = get().checkWinner();
    if (result) {
      set({ winner: result, phase: "game_over" });
    }
  },
  
  findSmartMove: (board: CellValue[]) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      const cells = [board[a], board[b], board[c]];
      const emptyInCombo = combo.filter(i => board[i] === null);
      
      if (cells.filter(c => c === "player2").length === 2 && emptyInCombo.length === 1) {
        return emptyInCombo[0];
      }
    }
    
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      const cells = [board[a], board[b], board[c]];
      const emptyInCombo = combo.filter(i => board[i] === null);
      
      if (cells.filter(c => c === "player1").length === 2 && emptyInCombo.length === 1) {
        return emptyInCombo[0];
      }
    }
    
    return -1;
  },
  
  restart: () => {
    set({
      board: Array(9).fill(null),
      currentTurn: "player1",
      winner: null,
      phase: "playing"
    });
  },
  
  resetToStart: () => {
    set({
      phase: "mode_selection",
      gameMode: null,
      difficulty: null,
      player1Character: null,
      player2Character: null,
      board: Array(9).fill(null),
      currentTurn: "player1",
      winner: null
    });
  }
}));
