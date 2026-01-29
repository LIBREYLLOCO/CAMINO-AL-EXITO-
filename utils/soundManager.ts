// Sound Manager using Web Audio API (Synthesizer)
// Eliminates dependence on external assets that often fail in previews/iframes.

export type SoundEffect = 
  | 'diceRoll' 
  | 'tokenMove' 
  | 'cardDraw' 
  | 'moneyGain' 
  | 'moneyLoss' 
  | 'winGame' 
  | 'uiClick' 
  | 'turnStart' 
  | 'statIncrease' 
  | 'statDecrease'
  | 'typewriter'
  | 'error'
  | 'welcome'; // Added welcome sound

let audioContext: AudioContext | null = null;
let isMuted = false;

export const initAudio = () => {
    if (typeof window !== 'undefined' && !audioContext) {
        // Support standard and webkit prefix for Safari
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContext = new AudioContextClass();
        }
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(e => console.warn("Audio resume failed", e));
    }
};

export const toggleMute = (): boolean => {
    isMuted = !isMuted;
    return isMuted;
};

export const getMuteState = (): boolean => {
    return isMuted;
};

// Helper to create an oscillator tone
const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0, volume: number = 0.1) => {
    if (!audioContext) return;
    const t = audioContext.currentTime;
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t + delay);
    
    // Envelope
    gain.gain.setValueAtTime(0, t + delay);
    gain.gain.linearRampToValueAtTime(volume, t + delay + 0.02); // Faster Attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + duration); // Decay
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(t + delay);
    osc.stop(t + delay + duration);
};

// Helper for sliding tones (good for loss/fail sounds)
const playSlide = (startFreq: number, endFreq: number, type: OscillatorType, duration: number, delay: number = 0, volume: number = 0.1) => {
    if (!audioContext) return;
    const t = audioContext.currentTime;
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, t + delay);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + delay + duration);
    
    gain.gain.setValueAtTime(volume, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + duration);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(t + delay);
    osc.stop(t + delay + duration);
};

// Helper to generate noise (for dice/shuffles)
const playNoise = (duration: number, volume: number = 0.1) => {
    if (!audioContext) return;
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    // Simple Lowpass filter to soften the noise
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    noise.start();
};

export const playInspirationalTheme = () => {
    if (isMuted || !audioContext) return;
    const v = 0.05;
    // Arpeggio C Major 7
    playTone(523.25, 'sine', 1.5, 0.0, v); // C5
    playTone(659.25, 'sine', 1.5, 0.2, v); // E5
    playTone(783.99, 'sine', 1.5, 0.4, v); // G5
    playTone(987.77, 'sine', 2.0, 0.6, v); // B5
    playTone(1046.50, 'sine', 2.5, 0.8, v); // C6
};

export const playSound = (sound: SoundEffect, volume: number = 0.5) => {
    if (isMuted) return;
    initAudio(); // Ensure context is ready
    if (!audioContext) return;

    // Global volume scaler for synth sounds
    const v = volume * 0.3; 

    switch (sound) {
        case 'uiClick':
            playTone(800, 'sine', 0.05, 0, v * 0.5);
            break;
            
        case 'tokenMove':
            // Short, wooden-like tick
            playTone(300, 'triangle', 0.05, 0, v);
            break;
            
        case 'typewriter':
            // Very short high tick
            playNoise(0.03, v * 0.3);
            break;

        case 'turnStart':
            // Soft "Your turn" chime
            playTone(440, 'sine', 0.4, 0, v);
            playTone(880, 'sine', 0.4, 0.1, v * 0.5);
            break;
            
        case 'diceRoll':
            // Shaking noise bursts
            playNoise(0.08, v);
            setTimeout(() => playNoise(0.08, v), 90);
            setTimeout(() => playNoise(0.15, v), 180);
            break;
            
        case 'cardDraw':
            // Sliding noise
            playNoise(0.15, v * 0.5);
            break;
            
        case 'moneyGain':
            // AGUDO: High pitch coin shimmer (Sine)
            // 1500Hz -> 2500Hz rapid slide
            playSlide(1500, 2500, 'sine', 0.15, 0, v);
            playTone(3000, 'sine', 0.2, 0.1, v * 0.5); // Sparkle tail
            break;
            
        case 'moneyLoss':
            // GRAVE: Low pitch heavy thud/buzz (Sawtooth)
            // 100Hz -> 50Hz. Deep mechanical failure sound.
            playSlide(100, 50, 'sawtooth', 0.4, 0, v * 1.5);
            break;
            
        case 'error':
             // Short sharp buzz
             playTone(150, 'sawtooth', 0.1, 0, v);
             playTone(100, 'sawtooth', 0.1, 0.05, v);
             break;

        case 'statIncrease':
            // AGUDO: Happy ascending trill (Triangle/Sine)
            // High frequencies for lightness
            playTone(880, 'triangle', 0.1, 0, v);     // A5
            playTone(1108, 'triangle', 0.1, 0.08, v); // C#6
            playTone(1318, 'triangle', 0.2, 0.16, v); // E6
            break;
            
        case 'statDecrease':
            // GRAVE: Low "Womp" (Sawtooth/Square)
            // 150Hz -> 60Hz drop. Sad trombone feel but shorter.
            playSlide(150, 60, 'sawtooth', 0.3, 0, v * 1.3);
            break;
            
        case 'winGame':
            // Victory Fanfare
            const now = 0;
            playTone(523.25, 'triangle', 0.2, now, v); 
            playTone(523.25, 'triangle', 0.2, now + 0.15, v); 
            playTone(523.25, 'triangle', 0.2, now + 0.30, v); 
            playTone(783.99, 'triangle', 0.8, now + 0.45, v); // G5
            playTone(1046.50, 'triangle', 1.2, now + 0.60, v); // C6
            break;
        
        case 'welcome':
            // Acorde de bienvenida suave y ascendente (Sine wave)
            playTone(392.00, 'sine', 1.0, 0, v); // G4
            playTone(523.25, 'sine', 1.0, 0.1, v); // C5
            playTone(659.25, 'sine', 1.0, 0.2, v); // E5
            playTone(783.99, 'sine', 1.5, 0.35, v); // G5 (sustain)
            break;
            
        default:
            break;
    }
};