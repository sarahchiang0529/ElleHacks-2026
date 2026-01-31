import { Volume2, VolumeX } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';

export function SoundToggle() {
  const { soundOn, toggleSound } = useGameState();

  return (
    <button
      onClick={toggleSound}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-110"
      aria-label={soundOn ? 'Mute sounds' : 'Unmute sounds'}
    >
      {soundOn ? (
        <Volume2 className="w-5 h-5 text-purple-600" />
      ) : (
        <VolumeX className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );
}
