import React from 'react';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyAlertOverlayProps {
  countdown: number;
  onDismiss: () => void;
}

export function EmergencyAlertOverlay({ countdown, onDismiss }: EmergencyAlertOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, oklch(0.25 0.18 25), oklch(0.35 0.2 35))',
      }}
      onClick={onDismiss}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/emergency-bg.dim_1440x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full border-4 border-white/20 animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="absolute w-72 h-72 rounded-full border-4 border-white/30 animate-ping" style={{ animationDuration: '1s' }} />
      </div>

      <div
        className="relative z-10 text-center px-8 py-10 max-w-lg mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Alert Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-14 h-14 text-white" />
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-6">
          <div
            className="w-28 h-28 rounded-full border-8 border-white/50 flex items-center justify-center mx-auto mb-4"
            style={{
              background: `conic-gradient(white ${countdown * 36}deg, transparent 0deg)`,
            }}
          >
            <div className="w-20 h-20 rounded-full bg-emergency-red flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{countdown}</span>
            </div>
          </div>
          <p className="text-white/80 text-sm">seconds mein emergency activate hogi</p>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
          Kya aap theek hain?
        </h1>
        <p className="text-xl text-white/90 mb-2">
          Kripya screen touch karein
        </p>
        <p className="text-xl text-white/90 mb-8">
          ya <strong>'Haan'</strong> bolein
        </p>

        {/* Emergency Numbers */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            <Phone className="w-4 h-4 text-white" />
            <span className="text-white font-bold">102</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            <Phone className="w-4 h-4 text-white" />
            <span className="text-white font-bold">108</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onDismiss}
            className="w-full py-6 text-xl font-bold rounded-2xl bg-white text-emergency-red hover:bg-white/90 shadow-lg"
          >
            ✅ Haan, Main Theek Hoon
          </Button>
          <p className="text-white/60 text-sm">
            Ya screen par kahin bhi touch karein
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-white/60 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Location monitoring active hai</span>
        </div>
      </div>
    </div>
  );
}
