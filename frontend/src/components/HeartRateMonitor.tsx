import React, { useMemo } from 'react';
import { Heart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeartRateMonitorProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onReset: () => void;
  isManualOverride: boolean;
}

function getBpmStatus(bpm: number): { label: string; color: string; bgColor: string } {
  if (bpm === 0 || bpm < 40) return { label: 'CRITICAL', color: 'text-emergency-red', bgColor: 'bg-emergency-red/10 border-emergency-red/30' };
  if (bpm < 60) return { label: 'Low', color: 'text-saffron', bgColor: 'bg-saffron/10 border-saffron/30' };
  if (bpm <= 100) return { label: 'Normal', color: 'text-success', bgColor: 'bg-success/10 border-success/30' };
  return { label: 'High', color: 'text-saffron', bgColor: 'bg-saffron/10 border-saffron/30' };
}

export function HeartRateMonitor({ bpm, onBpmChange, onReset, isManualOverride }: HeartRateMonitorProps) {
  const [inputValue, setInputValue] = React.useState('');
  const status = useMemo(() => getBpmStatus(bpm), [bpm]);
  const beatDuration = bpm > 0 ? `${(60 / bpm).toFixed(2)}s` : '1s';
  const isCritical = bpm === 0 || bpm < 40;

  const handleSetBpm = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && val >= 0 && val <= 250) {
      onBpmChange(val);
      setInputValue('');
    }
  };

  return (
    <Card className={`card-warm overflow-hidden ${isCritical ? 'border-emergency-red/50 shadow-emergency' : ''}`}>
      <CardHeader className="teal-gradient pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-xl">
          <Activity className="w-5 h-5" />
          Dhadkan Monitor
        </CardTitle>
        <p className="text-white/80 text-sm">Real-time Heart Rate</p>
      </CardHeader>
      <CardContent className="p-6">
        {/* BPM Display */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`relative flex items-center justify-center w-36 h-36 rounded-full mb-4 ${
              isCritical
                ? 'bg-emergency-red/10 border-4 border-emergency-red pulse-ring'
                : 'bg-teal-pale border-4 border-teal-light'
            }`}
          >
            <Heart
              className={`w-12 h-12 ${isCritical ? 'text-emergency-red' : 'text-teal-mid'}`}
              style={{
                animation: `heartbeat ${beatDuration} ease-in-out infinite`,
                fill: isCritical ? 'oklch(0.52 0.22 25)' : 'oklch(0.42 0.12 195)',
              }}
            />
            <span className={`absolute bottom-3 text-2xl font-bold ${isCritical ? 'text-emergency-red' : 'text-teal-deep'}`}>
              {bpm}
            </span>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-deep">{bpm} <span className="text-lg font-normal text-muted-foreground">BPM</span></p>
            <Badge className={`mt-2 text-sm px-3 py-1 border ${status.bgColor} ${status.color} font-semibold`} variant="outline">
              {status.label}
            </Badge>
          </div>
        </div>

        {/* ECG Line Visual */}
        <div className="mb-5 overflow-hidden rounded-lg bg-teal-pale p-3">
          <svg viewBox="0 0 300 60" className="w-full h-12" preserveAspectRatio="none">
            <polyline
              points="0,30 20,30 30,30 40,10 50,50 60,30 80,30 100,30 110,30 120,8 130,52 140,30 160,30 180,30 190,30 200,10 210,50 220,30 240,30 260,30 270,30 280,10 290,50 300,30"
              fill="none"
              stroke={isCritical ? 'oklch(0.52 0.22 25)' : 'oklch(0.42 0.12 195)'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Manual BPM Input */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Test ke liye BPM set karein:</p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="BPM darj karein (0-250)"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSetBpm()}
              className="text-base border-teal-light focus:border-teal-mid"
              min={0}
              max={250}
            />
            <Button
              onClick={handleSetBpm}
              className="teal-gradient text-white border-0 hover:opacity-90"
            >
              Set
            </Button>
          </div>
          {isManualOverride && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="w-full text-teal-mid border-teal-light hover:bg-teal-pale"
            >
              Auto-simulation resume karein
            </Button>
          )}
        </div>

        {isCritical && (
          <div className="mt-4 p-3 rounded-xl bg-emergency-red/10 border border-emergency-red/30 text-center">
            <p className="text-emergency-red font-bold text-sm animate-pulse">
              ⚠️ CRITICAL: Emergency alert active hai!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
