import "@fontsource/inter";
import { useMemoryGame } from "./lib/stores/useMemoryGame";
import { MemoryCardBoard } from "./components/MemoryCardBoard";
import { MemoryGameUI } from "./components/MemoryGameUI";
import { SoundManager } from "./components/SoundManager";
import { FullscreenButton } from "./components/FullscreenButton";
import { useEffect } from "react";

function App() {
  const { initializeGame } = useMemoryGame();
  
  useEffect(() => {
    initializeGame(1);
  }, [initializeGame]);
  
  console.log("Memory Matching Game - v2.0 🎴");

  return (
    <>
      <SoundManager />
      <FullscreenButton />
      
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <MemoryGameUI />
        <MemoryCardBoard />
      </div>
    </>
  );
}

export default App;
