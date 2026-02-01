interface NPCSpriteProps {
  variant: 'bob' | 'sally' | 'lily' | 'max' | 'zoe';
  mood?: 'neutral' | 'worried' | 'happy';
}

export function NPCSprite({ variant, mood = 'neutral' }: NPCSpriteProps) {
  const configs = {
    lily: { bodyColor: '#ffb3ba', hairColor: '#ffb3ba', accessory: 'bow' },
    max: { bodyColor: '#ffffba', hairColor: '#bae1ff', accessory: 'cap' },
    zoe: { bodyColor: '#ffffba', hairColor: '#c9a0dc', accessory: 'flower' },
    bob: { bodyColor: '#ffffba', hairColor: '#d4af37', accessory: 'cap' },
    sally: { bodyColor: '#ffffba', hairColor: '#ff9966', accessory: 'flower' },
  };

  const config = configs[variant];

  const getEyes = () => {
    switch (mood) {
      case 'worried':
        return { leftY: 14, rightY: 14, eyeShape: 'circle' };
      case 'happy':
        return { leftY: 15, rightY: 15, eyeShape: 'arc' };
      default:
        return { leftY: 15, rightY: 15, eyeShape: 'circle' };
    }
  };

  const getMouth = () => {
    switch (mood) {
      case 'worried':
        return 'M 19 20 Q 24 18 29 20';
      case 'happy':
        return 'M 19 18 Q 24 22 29 18';
      default:
        return 'M 19 19 Q 24 20 29 19';
    }
  };

  const eyes = getEyes();

  return (
    <svg viewBox="0 0 48 64" className="w-12 h-16">
      {/* Head */}
      <circle cx="24" cy="18" r="12" fill="#ffd4a8" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Hair/Accessory */}
      {config.accessory === 'bow' && (
        <>
          <ellipse cx="24" cy="10" rx="14" ry="8" fill={config.hairColor} stroke="#2c2c2c" strokeWidth="2" />
          <path d="M 14 8 Q 10 10 12 14 L 16 12 Z" fill="#ff6b9d" stroke="#2c2c2c" strokeWidth="2" />
        </>
      )}
      {config.accessory === 'cap' && (
        <path d="M 12 12 L 12 8 L 36 8 L 36 12 Q 24 6 12 12" fill={config.hairColor} stroke="#2c2c2c" strokeWidth="2" />
      )}
      {config.accessory === 'flower' && (
        <>
          <ellipse cx="24" cy="10" rx="14" ry="8" fill={config.hairColor} stroke="#2c2c2c" strokeWidth="2" />
          <circle cx="32" cy="10" r="3" fill="#ff69b4" stroke="#2c2c2c" strokeWidth="1" />
          <circle cx="29" cy="8" r="2" fill="#ffb6c1" />
          <circle cx="35" cy="8" r="2" fill="#ffb6c1" />
        </>
      )}
      
      {/* Eyes */}
      {eyes.eyeShape === 'circle' ? (
        <>
          <circle cx="19" cy={eyes.leftY} r="1.5" fill="#2c2c2c" />
          <circle cx="29" cy={eyes.rightY} r="1.5" fill="#2c2c2c" />
        </>
      ) : (
        <>
          <path d="M 17 15 Q 19 13 21 15" stroke="#2c2c2c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 27 15 Q 29 13 31 15" stroke="#2c2c2c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      
      {/* Mouth */}
      <path d={getMouth()} stroke="#2c2c2c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Body */}
      <rect x="14" y="30" width="20" height="24" rx="10" fill={config.bodyColor} stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Arms */}
      <rect x="7" y="32" width="6" height="14" rx="3" fill={config.bodyColor} stroke="#2c2c2c" strokeWidth="2" />
      <rect x="35" y="32" width="6" height="14" rx="3" fill={config.bodyColor} stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Legs */}
      <rect x="16" y="54" width="6" height="8" rx="3" fill="#6b4423" stroke="#2c2c2c" strokeWidth="2" />
      <rect x="26" y="54" width="6" height="8" rx="3" fill="#6b4423" stroke="#2c2c2c" strokeWidth="2" />
    </svg>
  );
}
