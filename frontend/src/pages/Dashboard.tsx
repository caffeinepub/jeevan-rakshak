import React from 'react';
import { Heart, Pill, MessageCircle, Phone, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartRateMonitor } from '../components/HeartRateMonitor';
import { MedicineDoseLog } from '../components/MedicineDoseLog';
import type { MedicalProfile } from '../backend';
import type { DoseLogEntry } from '../hooks/useMedicineReminders';

interface DashboardProps {
  profile: MedicalProfile;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onBpmReset: () => void;
  isManualOverride: boolean;
  doseLog: DoseLogEntry[];
  onNavigate: (page: string) => void;
}

export function Dashboard({
  profile,
  bpm,
  onBpmChange,
  onBpmReset,
  isManualOverride,
  doseLog,
  onNavigate,
}: DashboardProps) {
  const todayMedicines = profile.medicines.length;
  const takenToday = doseLog.filter(e => e.status === 'taken').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-3xl p-6 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, oklch(0.35 0.13 195), oklch(0.48 0.12 185), oklch(0.42 0.12 195))',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(/assets/generated/dashboard-bg.dim_1440x900.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10">
          <p className="text-white/80 text-base mb-1">Namaste,</p>
          <h2 className="text-3xl font-bold font-heading mb-1">{profile.name} ji 🙏</h2>
          <p className="text-white/80 text-base">
            Aaj aap kaisa/kaisi feel kar rahe/rahi hain?
          </p>
          {profile.chronicConditions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.chronicConditions.map((c, i) => (
                <span key={i} className="bg-white/20 text-white text-sm px-3 py-1 rounded-full border border-white/30">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="card-warm text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl teal-gradient flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-teal-deep">{bpm}</p>
            <p className="text-xs text-muted-foreground">BPM</p>
          </CardContent>
        </Card>
        <Card className="card-warm text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center mx-auto mb-2">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-teal-deep">{takenToday}/{todayMedicines}</p>
            <p className="text-xs text-muted-foreground">Dawaiyan Li</p>
          </CardContent>
        </Card>
        <Card className="card-warm text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-teal-deep">Safe</p>
            <p className="text-xs text-muted-foreground">Status</p>
          </CardContent>
        </Card>
        <Card className="card-warm text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl bg-saffron-warm flex items-center justify-center mx-auto mb-2">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-teal-deep">{profile.age.toString()}</p>
            <p className="text-xs text-muted-foreground">Umra</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Heart Rate Monitor */}
        <HeartRateMonitor
          bpm={bpm}
          onBpmChange={onBpmChange}
          onReset={onBpmReset}
          isManualOverride={isManualOverride}
        />

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="card-warm">
            <CardHeader className="pb-3">
              <CardTitle className="text-teal-deep text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => onNavigate('medicines')}
                className="w-full justify-start gap-3 py-4 text-base rounded-2xl teal-gradient text-white border-0 shadow-teal hover:opacity-90"
              >
                <Pill className="w-5 h-5" />
                Dawaiyan Manage Karein
              </Button>
              <Button
                onClick={() => onNavigate('chat')}
                variant="outline"
                className="w-full justify-start gap-3 py-4 text-base rounded-2xl border-2 border-teal-light text-teal-mid hover:bg-teal-pale"
              >
                <MessageCircle className="w-5 h-5" />
                Health Chat Karein
              </Button>
              <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-4">
                <p className="text-sm font-semibold text-saffron-warm mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Emergency Numbers
                </p>
                <div className="flex gap-3">
                  <a
                    href="tel:102"
                    className="flex-1 bg-saffron text-white text-center py-2 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                  >
                    102
                  </a>
                  <a
                    href="tel:108"
                    className="flex-1 bg-emergency-red text-white text-center py-2 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                  >
                    108
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {profile.emergencyContact && (
            <Card className="card-warm border-saffron/30">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-saffron" />
                  Emergency Contact
                </p>
                <a
                  href={`tel:${profile.emergencyContact}`}
                  className="text-xl font-bold text-teal-deep hover:text-teal-mid transition-colors"
                >
                  {profile.emergencyContact}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dose Log */}
      <MedicineDoseLog entries={doseLog} />
    </div>
  );
}
