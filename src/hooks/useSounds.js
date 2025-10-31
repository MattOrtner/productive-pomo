import { useState, useCallback, useRef, useEffect } from "react";

const useSounds = () => {
  // Sound settings state
  const [workSoundType, setWorkSoundType] = useState("bell");
  const [breakSoundType, setBreakSoundType] = useState("alert");
  
  // Persistent AudioContext for mobile compatibility
  const audioContextRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Initialize AudioContext and handle mobile requirements
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn("Web Audio API not supported:", error);
        return false;
      }
    }

    // Resume AudioContext if suspended (required for mobile)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        setIsAudioReady(true);
      }).catch((error) => {
        console.warn("Could not resume AudioContext:", error);
      });
    } else {
      setIsAudioReady(true);
    }
    
    return true;
  }, []);

  // Set up user interaction listeners for mobile
  useEffect(() => {
    const handleUserInteraction = () => {
      initAudioContext();
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [initAudioContext]);

  const soundOptions = {
    work: {
      bell: "Calming Bell",
      chime: "Gentle Chime",
      ding: "Soft Ding",
      tone: "Meditation Tone",
      gong: "Tibetan Gong",
    },
    break: {
      alert: "Alert Bell",
      chirp: "Bird Chirp",
      beep: "Digital Beep",
      ring: "Phone Ring",
      whistle: "Soft Whistle",
    },
  };

  // Sound functions with multiple options
  const playWorkSound = useCallback(
    (soundType = workSoundType) => {
      // Ensure AudioContext is initialized and ready
      if (!initAudioContext() || !audioContextRef.current || audioContextRef.current.state !== 'running') {
        console.warn("AudioContext not ready for playback");
        return;
      }

      try {
        const audioContext = audioContextRef.current;
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        switch (soundType) {
          case "bell":
            // Calming dual-tone bell (C5 and E5)
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            osc1.frequency.setValueAtTime(523.25, audioContext.currentTime);
            osc2.frequency.setValueAtTime(659.25, audioContext.currentTime);
            osc1.type = "sine";
            osc2.type = "sine";
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.15,
              audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 1.5
            );
            osc1.start(audioContext.currentTime);
            osc2.start(audioContext.currentTime);
            osc1.stop(audioContext.currentTime + 1.5);
            osc2.stop(audioContext.currentTime + 1.5);
            break;

          case "chime":
            // Gentle wind chime (F4, A4, C5)
            [349.23, 440, 523.25].forEach((freq, i) => {
              const osc = audioContext.createOscillator();
              osc.frequency.setValueAtTime(freq, audioContext.currentTime);
              osc.type = "sine";
              osc.connect(gainNode);
              gainNode.gain.setValueAtTime(
                0,
                audioContext.currentTime + i * 0.2
              );
              gainNode.gain.linearRampToValueAtTime(
                0.1,
                audioContext.currentTime + i * 0.2 + 0.1
              );
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + i * 0.2 + 1.5
              );
              osc.start(audioContext.currentTime + i * 0.2);
              osc.stop(audioContext.currentTime + i * 0.2 + 1.5);
            });
            break;

          case "ding":
            // Soft single tone ding (G4)
            const dingOsc = audioContext.createOscillator();
            dingOsc.frequency.setValueAtTime(392, audioContext.currentTime);
            dingOsc.type = "sine";
            dingOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.05
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 1
            );
            dingOsc.start(audioContext.currentTime);
            dingOsc.stop(audioContext.currentTime + 1);
            break;

          case "tone":
            // Meditation bowl tone (low frequency)
            const toneOsc = audioContext.createOscillator();
            toneOsc.frequency.setValueAtTime(256, audioContext.currentTime);
            toneOsc.type = "sine";
            toneOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.15,
              audioContext.currentTime + 0.3
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 3
            );
            toneOsc.start(audioContext.currentTime);
            toneOsc.stop(audioContext.currentTime + 3);
            break;

          case "gong":
            // Tibetan gong (multiple harmonics)
            [200, 300, 400].forEach((freq, i) => {
              const osc = audioContext.createOscillator();
              osc.frequency.setValueAtTime(freq, audioContext.currentTime);
              osc.type = "sine";
              osc.connect(gainNode);
              gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              gainNode.gain.linearRampToValueAtTime(
                0.1 - i * 0.02,
                audioContext.currentTime + 0.2
              );
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 4
              );
              osc.start(audioContext.currentTime);
              osc.stop(audioContext.currentTime + 4);
            });
            break;

          default:
            // Fall back to bell
            const defaultOsc1 = audioContext.createOscillator();
            const defaultOsc2 = audioContext.createOscillator();
            defaultOsc1.frequency.setValueAtTime(
              523.25,
              audioContext.currentTime
            );
            defaultOsc2.frequency.setValueAtTime(
              659.25,
              audioContext.currentTime
            );
            defaultOsc1.type = "sine";
            defaultOsc2.type = "sine";
            defaultOsc1.connect(gainNode);
            defaultOsc2.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.15,
              audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 1.5
            );
            defaultOsc1.start(audioContext.currentTime);
            defaultOsc2.start(audioContext.currentTime);
            defaultOsc1.stop(audioContext.currentTime + 1.5);
            defaultOsc2.stop(audioContext.currentTime + 1.5);
        }
      } catch (error) {
        console.log("Audio not supported:", error);
      }
    },
    [workSoundType, initAudioContext]
  );

  const playBreakSound = useCallback(
    (soundType = breakSoundType) => {
      // Ensure AudioContext is initialized and ready
      if (!initAudioContext() || !audioContextRef.current || audioContextRef.current.state !== 'running') {
        console.warn("AudioContext not ready for playback");
        return;
      }

      try {
        const audioContext = audioContextRef.current;
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        switch (soundType) {
          case "alert":
            // Higher pitched alert bell (A5 and C6)
            const osc1 = audioContext.createOscillator();
            osc1.frequency.setValueAtTime(880, audioContext.currentTime);
            osc1.type = "sine";
            osc1.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.05
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.8
            );
            osc1.start(audioContext.currentTime);
            osc1.stop(audioContext.currentTime + 0.8);

            // Add a second chime for emphasis
            setTimeout(() => {
              const osc2 = audioContext.createOscillator();
              const gain2 = audioContext.createGain();
              osc2.frequency.setValueAtTime(1046.5, audioContext.currentTime);
              osc2.type = "sine";
              osc2.connect(gain2);
              gain2.connect(audioContext.destination);
              gain2.gain.setValueAtTime(0, audioContext.currentTime);
              gain2.gain.linearRampToValueAtTime(
                0.15,
                audioContext.currentTime + 0.05
              );
              gain2.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.6
              );
              osc2.start(audioContext.currentTime);
              osc2.stop(audioContext.currentTime + 0.6);
            }, 200);
            break;

          case "chirp":
            // Bird-like chirp
            const chirpOsc = audioContext.createOscillator();
            chirpOsc.frequency.setValueAtTime(1200, audioContext.currentTime);
            chirpOsc.frequency.linearRampToValueAtTime(
              800,
              audioContext.currentTime + 0.1
            );
            chirpOsc.type = "sine";
            chirpOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.02
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.3
            );
            chirpOsc.start(audioContext.currentTime);
            chirpOsc.stop(audioContext.currentTime + 0.3);

            // Second chirp
            setTimeout(() => {
              const chirp2 = audioContext.createOscillator();
              const gain2 = audioContext.createGain();
              chirp2.frequency.setValueAtTime(1000, audioContext.currentTime);
              chirp2.frequency.linearRampToValueAtTime(
                700,
                audioContext.currentTime + 0.1
              );
              chirp2.type = "sine";
              chirp2.connect(gain2);
              gain2.connect(audioContext.destination);
              gain2.gain.setValueAtTime(0, audioContext.currentTime);
              gain2.gain.linearRampToValueAtTime(
                0.2,
                audioContext.currentTime + 0.02
              );
              gain2.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.3
              );
              chirp2.start(audioContext.currentTime);
              chirp2.stop(audioContext.currentTime + 0.3);
            }, 200);
            break;

          case "beep":
            // Digital beep pattern
            [1000, 1000, 1000].forEach((freq, i) => {
              setTimeout(() => {
                const beepOsc = audioContext.createOscillator();
                const beepGain = audioContext.createGain();
                beepOsc.frequency.setValueAtTime(
                  freq,
                  audioContext.currentTime
                );
                beepOsc.type = "square";
                beepOsc.connect(beepGain);
                beepGain.connect(audioContext.destination);
                beepGain.gain.setValueAtTime(0.15, audioContext.currentTime);
                beepGain.gain.exponentialRampToValueAtTime(
                  0.01,
                  audioContext.currentTime + 0.15
                );
                beepOsc.start(audioContext.currentTime);
                beepOsc.stop(audioContext.currentTime + 0.15);
              }, i * 200);
            });
            break;

          case "ring":
            // Phone ring pattern
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                const ringOsc1 = audioContext.createOscillator();
                const ringOsc2 = audioContext.createOscillator();
                const ringGain = audioContext.createGain();
                ringOsc1.frequency.setValueAtTime(
                  440,
                  audioContext.currentTime
                );
                ringOsc2.frequency.setValueAtTime(
                  480,
                  audioContext.currentTime
                );
                ringOsc1.type = "sine";
                ringOsc2.type = "sine";
                ringOsc1.connect(ringGain);
                ringOsc2.connect(ringGain);
                ringGain.connect(audioContext.destination);
                ringGain.gain.setValueAtTime(0.1, audioContext.currentTime);
                ringGain.gain.exponentialRampToValueAtTime(
                  0.01,
                  audioContext.currentTime + 0.3
                );
                ringOsc1.start(audioContext.currentTime);
                ringOsc2.start(audioContext.currentTime);
                ringOsc1.stop(audioContext.currentTime + 0.3);
                ringOsc2.stop(audioContext.currentTime + 0.3);
              }, i * 400);
            }
            break;

          case "whistle":
            // Soft whistle
            const whistleOsc = audioContext.createOscillator();
            whistleOsc.frequency.setValueAtTime(2000, audioContext.currentTime);
            whistleOsc.frequency.linearRampToValueAtTime(
              1500,
              audioContext.currentTime + 0.5
            );
            whistleOsc.type = "sine";
            whistleOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.1,
              audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.8
            );
            whistleOsc.start(audioContext.currentTime);
            whistleOsc.stop(audioContext.currentTime + 0.8);
            break;

          default:
            // Fall back to alert
            const defaultOsc1 = audioContext.createOscillator();
            defaultOsc1.frequency.setValueAtTime(880, audioContext.currentTime);
            defaultOsc1.type = "sine";
            defaultOsc1.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.05
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.8
            );
            defaultOsc1.start(audioContext.currentTime);
            defaultOsc1.stop(audioContext.currentTime + 0.8);
        }
      } catch (error) {
        console.log("Audio not supported:", error);
      }
    },
    [breakSoundType, initAudioContext]
  );

  return {
    workSoundType,
    setWorkSoundType,
    breakSoundType,
    setBreakSoundType,
    soundOptions,
    playWorkSound,
    playBreakSound,
    isAudioReady,
  };
};

export default useSounds;
