import { create } from "zustand";

interface AudioState {
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playCelebration: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  hitSound: null,
  successSound: null,
  isMuted: false,
  
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playCelebration: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      // Play celebration sound 3 times with slight delays for a festive effect
      const playWithDelay = (delay: number, volumeLevel: number) => {
        setTimeout(() => {
          const soundClone = successSound.cloneNode() as HTMLAudioElement;
          soundClone.volume = volumeLevel;
          soundClone.play().catch(error => {
            console.log("Celebration sound play prevented:", error);
          });
        }, delay);
      };
      
      // Play 3 success sounds in quick succession with increasing volume
      playWithDelay(0, 0.6);
      playWithDelay(200, 0.7);
      playWithDelay(400, 0.8);
      
      console.log("Playing celebration sound!");
    }
  }
}));
