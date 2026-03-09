import { useState, useEffect, useRef, useCallback } from 'react';

type AlertState = 'idle' | 'alerting' | 'emergency';

interface EmergencyAlertHook {
  alertState: AlertState;
  countdown: number;
  dismissAlert: () => void;
  activateEmergency: () => void;
  resetEmergency: () => void;
}

let audioCtx: AudioContext | null = null;
let alarmNodes: { oscillator: OscillatorNode; gain: GainNode } | null = null;

function startAlarm() {
  try {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.3);
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.6);
    oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.9);

    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);

    // Repeating pattern
    const repeat = () => {
      if (!audioCtx) return;
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.6);
      oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.9);
    };

    const repeatInterval = setInterval(repeat, 1200);
    oscillator.start();
    alarmNodes = { oscillator, gain };

    return () => {
      clearInterval(repeatInterval);
    };
  } catch {
    // Audio not available
  }
}

function stopAlarm() {
  try {
    if (alarmNodes) {
      alarmNodes.gain.gain.setValueAtTime(0, audioCtx?.currentTime || 0);
      alarmNodes.oscillator.stop();
      alarmNodes = null;
    }
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
  } catch {
    // ignore
  }
}

export function useEmergencyAlert(bpm: number): EmergencyAlertHook {
  const [alertState, setAlertState] = useState<AlertState>('idle');
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alarmCleanupRef = useRef<(() => void) | undefined>(undefined);
  const prevBpmRef = useRef(bpm);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const dismissAlert = useCallback(() => {
    clearCountdown();
    stopAlarm();
    if (alarmCleanupRef.current) alarmCleanupRef.current();
    setAlertState('idle');
    setCountdown(10);
  }, [clearCountdown]);

  const activateEmergency = useCallback(() => {
    clearCountdown();
    stopAlarm();
    if (alarmCleanupRef.current) alarmCleanupRef.current();
    setAlertState('emergency');
  }, [clearCountdown]);

  const resetEmergency = useCallback(() => {
    setAlertState('idle');
    setCountdown(10);
  }, []);

  // Trigger alert when BPM drops
  useEffect(() => {
    const wasCritical = prevBpmRef.current === 0 || prevBpmRef.current < 40;
    const isCritical = bpm === 0 || bpm < 40;
    prevBpmRef.current = bpm;

    if (isCritical && !wasCritical && alertState === 'idle') {
      setAlertState('alerting');
      setCountdown(10);
      const cleanup = startAlarm();
      alarmCleanupRef.current = cleanup;
    } else if (!isCritical && alertState === 'alerting') {
      dismissAlert();
    }
  }, [bpm, alertState, dismissAlert]);

  // Countdown timer
  useEffect(() => {
    if (alertState === 'alerting') {
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearCountdown();
            stopAlarm();
            if (alarmCleanupRef.current) alarmCleanupRef.current();
            setAlertState('emergency');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearCountdown();
  }, [alertState, clearCountdown]);

  return { alertState, countdown, dismissAlert, activateEmergency, resetEmergency };
}
