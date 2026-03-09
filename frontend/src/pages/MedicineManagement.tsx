import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Pill, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MedicineDoseLog } from '../components/MedicineDoseLog';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import type { Medicine, MedicalProfile } from '../backend';
import type { DoseLogEntry } from '../hooks/useMedicineReminders';

interface MedicineManagementProps {
  profile: MedicalProfile;
  doseLog: DoseLogEntry[];
  onBack: () => void;
}

interface MedicineForm {
  name: string;
  dosage: string;
  scheduleTimesStr: string;
  description: string;
}

const emptyForm: MedicineForm = {
  name: '',
  dosage: '',
  scheduleTimesStr: '',
  description: '',
};

function parseScheduleTimes(str: string): bigint[] {
  return str.split(',').map(s => {
    const trimmed = s.trim();
    const [h, m] = trimmed.split(':').map(Number);
    if (isNaN(h)) return null;
    const mins = (h * 60) + (isNaN(m) ? 0 : m);
    return BigInt(mins);
  }).filter((v): v is bigint => v !== null);
}

function formatScheduleTimes(times: bigint[]): string {
  return times.map(t => {
    const total = Number(t);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }).join(', ');
}

export function MedicineManagement({ profile, doseLog, onBack }: MedicineManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<MedicineForm>(emptyForm);
  const saveProfile = useSaveCallerUserProfile();

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (med: Medicine) => {
    setForm({
      name: med.name,
      dosage: med.dosage,
      scheduleTimesStr: formatScheduleTimes(med.scheduleTimes),
      description: med.description,
    });
    setEditingId(med.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.dosage.trim()) return;
    const times = parseScheduleTimes(form.scheduleTimesStr);

    let updatedMedicines: Medicine[];
    if (editingId !== null) {
      updatedMedicines = profile.medicines.map(m =>
        m.id === editingId
          ? { ...m, name: form.name.trim(), dosage: form.dosage.trim(), scheduleTimes: times, description: form.description.trim() }
          : m
      );
    } else {
      const newMed: Medicine = {
        id: BigInt(Date.now()),
        name: form.name.trim(),
        dosage: form.dosage.trim(),
        scheduleTimes: times,
        description: form.description.trim(),
      };
      updatedMedicines = [...profile.medicines, newMed];
    }

    await saveProfile.mutateAsync({ ...profile, medicines: updatedMedicines });
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (id: bigint) => {
    const updatedMedicines = profile.medicines.filter(m => m.id !== id);
    await saveProfile.mutateAsync({ ...profile, medicines: updatedMedicines });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl text-teal-mid hover:bg-teal-pale"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-teal-deep font-heading">Dawaiyan</h2>
          <p className="text-muted-foreground text-sm">Apni dawaiyon ka schedule manage karein</p>
        </div>
        <Button
          onClick={openAdd}
          className="ml-auto teal-gradient text-white border-0 rounded-xl shadow-teal hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nai Dawa
        </Button>
      </div>

      {/* Medicine List */}
      {profile.medicines.length === 0 ? (
        <Card className="card-warm">
          <CardContent className="py-12 text-center">
            <Pill className="w-12 h-12 text-teal-light mx-auto mb-3" />
            <p className="text-muted-foreground text-lg">Koi dawa add nahi ki gayi hai.</p>
            <p className="text-muted-foreground text-sm mt-1">Upar "+ Nai Dawa" button dabayein.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {profile.medicines.map(med => (
            <Card key={String(med.id)} className="card-warm hover:shadow-teal transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl teal-gradient flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-teal-deep text-lg">{med.name}</h3>
                      <p className="text-muted-foreground text-sm">{med.dosage}</p>
                      {med.scheduleTimes.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-saffron" />
                          <span className="text-saffron-warm text-sm font-medium">
                            {formatScheduleTimes(med.scheduleTimes)}
                          </span>
                        </div>
                      )}
                      {med.description && (
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{med.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(med)}
                      className="rounded-xl text-teal-mid hover:bg-teal-pale w-8 h-8"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(med.id)}
                      className="rounded-xl text-emergency-red hover:bg-emergency-red/10 w-8 h-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dose Log */}
      <MedicineDoseLog entries={doseLog} />

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-sm mx-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-teal-deep text-xl">
              {editingId !== null ? '✏️ Dawa Edit Karein' : '💊 Nai Dawa Add Karein'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Dawa ka Naam *</Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jaise: Metformin, Aspirin"
                className="text-base border-teal-light rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-base font-semibold">Dose (Matra) *</Label>
              <Input
                value={form.dosage}
                onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
                placeholder="Jaise: 500mg, 1 tablet"
                className="text-base border-teal-light rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-base font-semibold">Samay (HH:MM format)</Label>
              <Input
                value={form.scheduleTimesStr}
                onChange={e => setForm(f => ({ ...f, scheduleTimesStr: e.target.value }))}
                placeholder="Jaise: 08:00, 14:00, 20:00"
                className="text-base border-teal-light rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Multiple times ke liye comma se alag karein</p>
            </div>
            <div className="space-y-1">
              <Label className="text-base font-semibold">Kyun Zaroori Hai?</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Is dawa ki zaroorat kyun hai..."
                className="text-base border-teal-light rounded-xl resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl border-teal-light text-teal-mid"
            >
              Raddh Karein
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveProfile.isPending || !form.name.trim() || !form.dosage.trim()}
              className="flex-1 teal-gradient text-white border-0 rounded-xl"
            >
              {saveProfile.isPending ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Karein'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
