// Using standard Web Audio API to generate synthetic retro/glitch sounds
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export function initAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().catch(console.error);
  }
}

export function playSound(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
}

export function playGlitch() {
  playSound(150, 0.1, 'sawtooth', 0.2);
  setTimeout(() => playSound(300, 0.05, 'square', 0.1), 50);
}

export function playTimerTick() {
  playSound(400, 0.05, 'sine', 0.05);
}

export function playHeartbeat() {
  playSound(50, 0.1, 'sine', 0.5);
  setTimeout(() => playSound(50, 0.1, 'sine', 0.3), 200);
}

export function playSuccess() {
  playSound(600, 0.1, 'sine', 0.1);
  setTimeout(() => playSound(800, 0.2, 'sine', 0.1), 100);
}

export function playError() {
  playSound(200, 0.3, 'sawtooth', 0.2);
}
