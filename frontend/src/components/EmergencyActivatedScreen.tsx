import React from 'react';
import { Phone, MapPin, AlertCircle, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { MedicalProfile } from '../backend';

interface EmergencyActivatedScreenProps {
  profile: MedicalProfile | null;
  onFalseAlarm: () => void;
}

export function EmergencyActivatedScreen({ profile, onFalseAlarm }: EmergencyActivatedScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{
        background: 'linear-gradient(160deg, oklch(0.2 0.15 25), oklch(0.28 0.18 35), oklch(0.22 0.12 20))',
      }}
    >
      <div className="w-full max-w-lg mx-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Emergency Activated!</h1>
          <p className="text-white/80 text-lg">Aapki emergency activate ho gayi hai</p>
        </div>

        {/* Calling Animation */}
        <Card className="mb-4 border-0 bg-white/15 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-xl">Calling 108...</p>
                <p className="text-white/70 text-sm">Ambulance bulai ja rahi hai</p>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              <div className="flex-1 bg-white/10 rounded-full px-4 py-2 text-center">
                <span className="text-white font-bold">102</span>
                <p className="text-white/60 text-xs">Ambulance</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-full px-4 py-2 text-center">
                <span className="text-white font-bold">108</span>
                <p className="text-white/60 text-xs">Emergency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Shared */}
        <Card className="mb-4 border-0 bg-white/15 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-300" />
              </div>
              <div>
                <p className="text-white font-semibold">Location Share Ho Gayi</p>
                <p className="text-white/70 text-sm">Aapki live location ambulance ko bheji ja rahi hai</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Profile Summary */}
        {profile && (
          <Card className="mb-4 border-0 bg-white/15 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-white/80" />
                <p className="text-white font-semibold">Medical History Bheji Gayi</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Naam:</span>
                  <span className="text-white font-medium">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Umra:</span>
                  <span className="text-white font-medium">{Number(profile.age)} saal</span>
                </div>
                {profile.emergencyContact && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Emergency Contact:</span>
                    <span className="text-white font-medium">{profile.emergencyContact}</span>
                  </div>
                )}
                {profile.chronicConditions.length > 0 && (
                  <div>
                    <span className="text-white/60">Bimariyan:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.chronicConditions.map((c, i) => (
                        <span key={i} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.allergies.length > 0 && (
                  <div>
                    <span className="text-white/60">Allergies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.allergies.map((a, i) => (
                        <span key={i} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Heart Rate Note */}
        <Card className="mb-6 border-0 bg-white/10 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Heart className="w-5 h-5 text-white/70" />
            <p className="text-white/70 text-sm">
              Aapki dhadkan bahut kam ho gayi thi. Ambulance raaste mein hai.
            </p>
          </CardContent>
        </Card>

        {/* False Alarm Button */}
        <Button
          onClick={onFalseAlarm}
          variant="outline"
          className="w-full py-4 text-lg font-semibold rounded-2xl border-white/40 text-white hover:bg-white/20 bg-transparent"
        >
          ✋ False Alarm — Main Theek Hoon
        </Button>
        <p className="text-center text-white/50 text-xs mt-3">
          Agar aap theek hain toh upar button dabayein
        </p>
      </div>
    </div>
  );
}
