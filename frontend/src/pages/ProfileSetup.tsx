import React, { useState } from 'react';
import { Heart, User, Phone, Activity, AlertCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import type { MedicalProfile } from '../backend';

interface ProfileSetupProps {
  onComplete: () => void;
  existingProfile?: MedicalProfile | null;
}

export function ProfileSetup({ onComplete, existingProfile }: ProfileSetupProps) {
  const [name, setName] = useState(existingProfile?.name || '');
  const [age, setAge] = useState(existingProfile ? String(Number(existingProfile.age)) : '');
  const [emergencyContact, setEmergencyContact] = useState(existingProfile?.emergencyContact || '');
  const [conditionInput, setConditionInput] = useState('');
  const [conditions, setConditions] = useState<string[]>(existingProfile?.chronicConditions || []);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>(existingProfile?.allergies || []);

  const saveProfile = useSaveCallerUserProfile();

  const addCondition = () => {
    const trimmed = conditionInput.trim();
    if (trimmed && !conditions.includes(trimmed)) {
      setConditions(prev => [...prev, trimmed]);
      setConditionInput('');
    }
  };

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies(prev => [...prev, trimmed]);
      setAllergyInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age) return;

    const profile: MedicalProfile = {
      name: name.trim(),
      age: BigInt(parseInt(age)),
      emergencyContact: emergencyContact.trim(),
      chronicConditions: conditions,
      allergies,
      medicines: existingProfile?.medicines || [],
      photo: existingProfile?.photo,
    };

    await saveProfile.mutateAsync(profile);
    onComplete();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, oklch(0.93 0.03 185), oklch(0.97 0.008 180), oklch(0.95 0.02 65))',
      }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full teal-gradient flex items-center justify-center shadow-teal">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-teal-deep font-heading">Jeevan Rakshak</h1>
          <p className="text-muted-foreground text-lg mt-1">
            {existingProfile ? 'Apni profile update karein' : 'Apna medical profile banayein'}
          </p>
        </div>

        <Card className="card-warm shadow-card">
          <CardHeader>
            <CardTitle className="text-teal-deep text-xl flex items-center gap-2">
              <User className="w-5 h-5" />
              {existingProfile ? 'Profile Update' : 'Namaskar! Pehle apna parichay dijiye'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-mid" />
                  Aapka Naam *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Apna poora naam likhein"
                  className="text-base py-3 border-teal-light focus:border-teal-mid rounded-xl"
                  required
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-mid" />
                  Aapki Umra *
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="Umra (saalon mein)"
                  className="text-base py-3 border-teal-light focus:border-teal-mid rounded-xl"
                  min={1}
                  max={120}
                  required
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <Label htmlFor="emergency" className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-saffron" />
                  Emergency Contact Number
                </Label>
                <Input
                  id="emergency"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="Parivaar ka phone number"
                  className="text-base py-3 border-teal-light focus:border-teal-mid rounded-xl"
                />
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-saffron" />
                  Purani Bimariyan (Chronic Conditions)
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={conditionInput}
                    onChange={e => setConditionInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                    placeholder="Jaise: Diabetes, BP, Asthma"
                    className="text-base border-teal-light focus:border-teal-mid rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={addCondition}
                    size="icon"
                    className="teal-gradient text-white border-0 rounded-xl flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {conditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {conditions.map((c, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 bg-teal-pale text-teal-deep text-sm px-3 py-1 rounded-full border border-teal-light"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => setConditions(prev => prev.filter((_, idx) => idx !== i))}
                          className="hover:text-emergency-red transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emergency-red" />
                  Allergies
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={allergyInput}
                    onChange={e => setAllergyInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    placeholder="Jaise: Penicillin, Dust, Pollen"
                    className="text-base border-teal-light focus:border-teal-mid rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={addAllergy}
                    size="icon"
                    className="bg-saffron text-white border-0 rounded-xl flex-shrink-0 hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {allergies.map((a, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 bg-saffron/10 text-saffron-warm text-sm px-3 py-1 rounded-full border border-saffron/30"
                      >
                        {a}
                        <button
                          type="button"
                          onClick={() => setAllergies(prev => prev.filter((_, idx) => idx !== i))}
                          className="hover:text-emergency-red transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={saveProfile.isPending || !name.trim() || !age}
                className="w-full py-4 text-lg font-bold rounded-2xl teal-gradient text-white border-0 shadow-teal hover:opacity-90 transition-opacity"
              >
                {saveProfile.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Save ho raha hai...
                  </span>
                ) : (
                  existingProfile ? '✅ Profile Update Karein' : '🙏 Shuru Karein'
                )}
              </Button>

              {saveProfile.isError && (
                <p className="text-emergency-red text-sm text-center">
                  Kuch galat hua. Dobara koshish karein.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
