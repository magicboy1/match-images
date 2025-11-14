import "@fontsource/inter";
import { useMatchingGame } from "./lib/stores/useMemoryGame";
import { MatchingCardBoard } from "./components/MemoryCardBoard";
import { MatchingGameUI } from "./components/MemoryGameUI";
import { SoundManager } from "./components/SoundManager";
import { FullscreenButton } from "./components/FullscreenButton";
import { useEffect } from "react";

function App() {
  const { initializeGame } = useMatchingGame();
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  console.log("Arabic Matching Game - 5 Pairs 🎴");

  return (
    <>
      <SoundManager />
      <FullscreenButton />
      
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <MatchingGameUI />
        <MatchingCardBoard />
      </div>
    </>
  );
}

export default App;
