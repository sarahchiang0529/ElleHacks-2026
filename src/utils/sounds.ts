class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;
  private backgroundMusicNormalVolume: number = 0.5;
  private backgroundMusicDuckedVolume: number = 0.2; // Lower volume when voices are playing

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

    // Background music
    this.sounds.backgroundMusic = new Audio('/sounds/backgroundMusic.mp3');
    this.sounds.backgroundMusic.loop = true;
    this.sounds.backgroundMusic.volume = this.backgroundMusicNormalVolume;
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
    const walkSound = this.sounds.walk;
    if (walkSound) {
      // Only play if it's not already playing
      if (walkSound.paused) {
        walkSound.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    }
  }

  stopWalking() {
    const walkSound = this.sounds.walk;
    if (walkSound) {
      walkSound.pause();
      walkSound.currentTime = 0;
      // Ensure it's stopped
      if (!walkSound.paused) {
        walkSound.pause();
      }
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  startBackgroundMusic() {
    if (!this.enabled) return;
    const music = this.sounds.backgroundMusic;
    if (music && music.paused) {
      music.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  stopBackgroundMusic() {
    if (this.sounds.backgroundMusic) {
      this.sounds.backgroundMusic.pause();
      this.sounds.backgroundMusic.currentTime = 0;
    }
  }

  duckBackgroundMusic() {
    if (this.sounds.backgroundMusic) {
      this.sounds.backgroundMusic.volume = this.backgroundMusicDuckedVolume;
    }
  }

  restoreBackgroundMusic() {
    if (this.sounds.backgroundMusic) {
      this.sounds.backgroundMusic.volume = this.backgroundMusicNormalVolume;
    }
  }
}

export const soundManager = new SoundManager();