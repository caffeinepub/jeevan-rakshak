import { useState, useEffect, useRef, useCallback } from 'react';

interface HeartRateSimulation {
  bpm: number;
  setBpm: (bpm: number) => void;
  resetToNormal: () => void;
  isManualOverride: boolean;
}

function getRealisticBpm(current: number): number {
  const delta = (Math.random() - 0.5) * 6;
  const next = current + delta;
  return Math.max(55, Math.min(105, next));
}

export function useHeartRateSimulation(): HeartRateSimulation {
  const [bpm, setBpmState] = useState<number>(72);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bpmRef = useRef(bpm);

  bpmRef.current = bpm;

  const startSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isManualOverride) {
        setBpmState(prev => getRealisticBpm(prev));
      }
    }, 2000);
  }, [isManualOverride]);

  useEffect(() => {
    if (!isManualOverride) {
      startSimulation();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isManualOverride, startSimulation]);

  const setBpm = useCallback((value: number) => {
    setBpmState(value);
    setIsManualOverride(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const resetToNormal = useCallback(() => {
    setBpmState(72);
    setIsManualOverride(false);
  }, []);

  return { bpm, setBpm, resetToNormal, isManualOverride };
}
