import { useCallback } from 'react';

// Singleton AudioContext to avoid creating multiple contexts
let audioCtx: AudioContext | null = null;
let isUnlocked = false;

// Attempt to initialize and unlock AudioContext
const initAudio = () => {
  if (typeof window === 'undefined') return;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      isUnlocked = true;
    }).catch(e => {
      // Browser autoplay policy blocked it
      console.warn("AudioContext resume failed due to autoplay policy:", e);
    });
  } else if (audioCtx && audioCtx.state === 'running') {
    isUnlocked = true;
  }
};

// Listen for user interactions globally to unlock audio
if (typeof window !== 'undefined') {
  const unlockEvents = ['mousedown', 'touchstart', 'keydown', 'click', 'pointerdown'];
  const unlock = () => {
    initAudio();
    if (isUnlocked) {
      unlockEvents.forEach(e => window.removeEventListener(e, unlock));
    }
  };
  unlockEvents.forEach(e => window.addEventListener(e, unlock, { once: true }));
  // Force attempt immediately for browsers that might allow it
  initAudio();
}

export const useSoundEffects = () => {
  
  const playHover = useCallback(() => {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    
    // Glassy tick
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    // Start at a high frequency, drop slightly
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    
    // Envelope: quick attack, quick decay
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01); // kept low volume for subtle UI feel
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }, []);

  const playType = useCallback(() => {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    
    // Mechanical clack (filtered white noise)
    const bufferSize = audioCtx.sampleRate * 0.05; // 50ms of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Bandpass filter to make it sound "clacky" rather than "hissy"
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2500;
    filter.Q.value = 1.5;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noiseSource.start();
  }, []);

  return { playHover, playType };
};
