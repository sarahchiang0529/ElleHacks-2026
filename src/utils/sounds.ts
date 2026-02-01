class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    // Preload all sounds
    this.sounds.walk = new Audio('/sounds/walk.mp3');
    this.sounds.walk.loop = true;
    this.sounds.walk.volume = 0.5;

    this.sounds.door = new Audio('/sounds/door.mp3');
    this.sounds.door.volume = 0.4;

    this.sounds.correct = new Audio('/sounds/correct.mp3');
    this.sounds.correct.volume = 0.3;

    this.sounds.wrong = new Audio('/sounds/wrong.mp3');
    this.sounds.wrong.volume = 0.2;

    this.sounds.ring = new Audio('/sounds/ring.mp3');
    this.sounds.ring.volume = 0.5;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  stop(soundName: string) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  startWalking() {
    if (!this.enabled) return;
    if (this.sounds.walk && this.sounds.walk.paused) {
      this.sounds.walk.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  stopWalking() {
    if (this.sounds.walk) {
      this.sounds.walk.pause();
      this.sounds.walk.currentTime = 0;
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

export const soundManager = new SoundManager();