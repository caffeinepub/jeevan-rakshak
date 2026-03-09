import { useState, useEffect, useCallback, useRef } from 'react';
import type { Medicine } from '../backend';

export interface DoseLogEntry {
  medicineId: bigint;
  medicineName: string;
  scheduledTime: string;
  takenAt?: string;
  status: 'taken' | 'pending' | 'skipped';
}

interface MedicineReminderHook {
  activeReminder: Medicine | null;
  doseLog: DoseLogEntry[];
  confirmTaken: (medicineId: bigint) => void;
  snoozeReminder: (medicineId: bigint) => void;
  dismissReminder: (medicineId: bigint) => void;
  showImportance: boolean;
  setShowImportance: (v: boolean) => void;
}

function getTimeString(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function useMedicineReminders(medicines: Medicine[]): MedicineReminderHook {
  const [activeReminder, setActiveReminder] = useState<Medicine | null>(null);
  const [doseLog, setDoseLog] = useState<DoseLogEntry[]>([]);
  const [snoozedUntil, setSnoozedUntil] = useState<Map<string, number>>(new Map());
  const [dismissedToday, setDismissedToday] = useState<Set<string>>(new Set());
  const [showImportance, setShowImportance] = useState(false);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkReminders = useCallback(() => {
    if (activeReminder) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const today = now.toDateString();

    for (const med of medicines) {
      for (const schedTime of med.scheduleTimes) {
        const totalMinutes = Number(schedTime);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const key = `${med.id}-${hours}-${mins}-${today}`;

        if (dismissedToday.has(key)) continue;

        const snoozeTime = snoozedUntil.get(key);
        if (snoozeTime && Date.now() < snoozeTime) continue;

        const diff = Math.abs(currentMinutes - (hours * 60 + mins));
        if (diff <= 1) {
          setActiveReminder(med);
          // Add to log if not already there
          setDoseLog(prev => {
            const exists = prev.find(e => e.medicineId === med.id && e.scheduledTime === `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
            if (exists) return prev;
            return [...prev, {
              medicineId: med.id,
              medicineName: med.name,
              scheduledTime: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
              status: 'pending',
            }];
          });
          return;
        }
      }
    }
  }, [medicines, activeReminder, snoozedUntil, dismissedToday]);

  useEffect(() => {
    checkIntervalRef.current = setInterval(checkReminders, 30000);
    checkReminders();
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [checkReminders]);

  const confirmTaken = useCallback((medicineId: bigint) => {
    const now = new Date();
    setDoseLog(prev => prev.map(e =>
      e.medicineId === medicineId
        ? { ...e, status: 'taken', takenAt: getTimeString(now) }
        : e
    ));
    setActiveReminder(null);
    setShowImportance(false);
  }, []);

  const snoozeReminder = useCallback((medicineId: bigint) => {
    const med = medicines.find(m => m.id === medicineId);
    if (!med) return;
    const now = new Date();
    const today = now.toDateString();
    for (const schedTime of med.scheduleTimes) {
      const totalMinutes = Number(schedTime);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const key = `${medicineId}-${hours}-${mins}-${today}`;
      setSnoozedUntil(prev => new Map(prev).set(key, Date.now() + 5 * 60 * 1000));
    }
    setActiveReminder(null);
    setShowImportance(false);
  }, [medicines]);

  const dismissReminder = useCallback((medicineId: bigint) => {
    const med = medicines.find(m => m.id === medicineId);
    if (!med) return;
    const now = new Date();
    const today = now.toDateString();
    for (const schedTime of med.scheduleTimes) {
      const totalMinutes = Number(schedTime);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const key = `${medicineId}-${hours}-${mins}-${today}`;
      setDismissedToday(prev => new Set(prev).add(key));
    }
    setDoseLog(prev => prev.map(e =>
      e.medicineId === medicineId ? { ...e, status: 'skipped' } : e
    ));
    setActiveReminder(null);
    setShowImportance(false);
  }, [medicines]);

  return {
    activeReminder,
    doseLog,
    confirmTaken,
    snoozeReminder,
    dismissReminder,
    showImportance,
    setShowImportance,
  };
}
