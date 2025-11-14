import "@fontsource/inter";
import { useTicTacToe } from "./lib/stores/useTicTacToe";
import { ModeSelection } from "./components/ModeSelection";
import { DifficultySelection } from "./components/DifficultySelection";
import { CharacterSelection } from "./components/CharacterSelection";
import { GameBoard } from "./components/GameBoard";
import { GameUI } from "./components/GameUI";
import { SoundManager } from "./components/SoundManager";
import { VoiceManager } from "./components/VoiceManager";
import { FullscreenButton } from "./components/FullscreenButton";

function App() {
  const { phase } = useTicTacToe();

  return (
    <>
      <SoundManager />
      <VoiceManager />
      <FullscreenButton />
      
      {phase === "mode_selection" && <ModeSelection />}
      
      {phase === "difficulty_selection" && <DifficultySelection />}
      
      {phase === "character_selection" && <CharacterSelection />}
      
      {(phase === "playing" || phase === "game_over") && (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <GameUI />
          <GameBoard />
        </div>
      )}
    </>
  );
}

export default App;
