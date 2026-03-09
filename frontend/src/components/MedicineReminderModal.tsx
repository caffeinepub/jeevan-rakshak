import React from 'react';
import { Bell, Droplets, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Medicine } from '../backend';

interface MedicineReminderModalProps {
  medicine: Medicine | null;
  onTaken: (id: bigint) => void;
  onSnooze: (id: bigint) => void;
  onDismiss: (id: bigint) => void;
  showImportance: boolean;
  onShowImportance: (v: boolean) => void;
}

export function MedicineReminderModal({
  medicine,
  onTaken,
  onSnooze,
  onDismiss,
  showImportance,
  onShowImportance,
}: MedicineReminderModalProps) {
  if (!medicine) return null;

  return (
    <Dialog open={!!medicine}>
      <DialogContent
        className="max-w-sm mx-auto rounded-3xl border-2 border-teal-light shadow-teal"
        onInteractOutside={e => e.preventDefault()}
      >
        {showImportance ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-teal-deep text-xl flex items-center gap-2">
                💊 Dawa Kyun Zaroori Hai?
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-teal-pale rounded-2xl p-4 mb-4">
                <p className="text-teal-deep font-semibold text-lg mb-2">{medicine.name}</p>
                <p className="text-foreground text-base leading-relaxed">
                  {medicine.description || `${medicine.name} aapki sehat ke liye bahut zaroori hai. Isko regular lene se aap theek rehte hain aur bimari nahi badhti.`}
                </p>
              </div>
              <p className="text-muted-foreground text-sm text-center italic">
                Aapki sehat hamari zimmedari hai 💙
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => onTaken(medicine.id)}
                className="w-full py-4 text-lg font-bold rounded-2xl teal-gradient text-white border-0"
              >
                ✅ Theek Hai, Le Lunga/Lungi
              </Button>
              <Button
                variant="outline"
                onClick={() => onDismiss(medicine.id)}
                className="w-full py-3 rounded-2xl border-teal-light text-teal-mid"
              >
                Baad Mein Yaad Dilana
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-teal-deep text-xl flex items-center gap-2">
                <Bell className="w-5 h-5 text-saffron" />
                Dawa ka Samay!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-4 mb-4">
                <p className="text-foreground text-base leading-relaxed">
                  🙏 <strong>Namaste!</strong> Aapki{' '}
                  <span className="text-teal-deep font-bold text-lg">{medicine.name}</span>{' '}
                  ({medicine.dosage}) ka samay ho gaya hai.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-teal-pale rounded-xl p-3 mb-4">
                <Droplets className="w-5 h-5 text-teal-mid flex-shrink-0" />
                <p className="text-teal-deep text-sm">
                  Kya main aapke liye pani ka reminder bhi set karun? 💧
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => onTaken(medicine.id)}
                className="w-full py-4 text-lg font-bold rounded-2xl teal-gradient text-white border-0"
              >
                ✅ Le Li (Taken)
              </Button>
              <Button
                variant="outline"
                onClick={() => onSnooze(medicine.id)}
                className="w-full py-3 rounded-2xl border-saffron/50 text-saffron-warm font-semibold"
              >
                ⏰ Baad Mein (5 min baad)
              </Button>
              <button
                onClick={() => onShowImportance(true)}
                className="text-sm text-muted-foreground underline text-center py-1 hover:text-teal-mid transition-colors"
              >
                Nahi Lunga — Kyun Zaroori Hai?
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
