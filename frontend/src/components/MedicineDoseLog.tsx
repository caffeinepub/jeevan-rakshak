import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DoseLogEntry } from '../hooks/useMedicineReminders';

interface MedicineDoseLogProps {
  entries: DoseLogEntry[];
}

export function MedicineDoseLog({ entries }: MedicineDoseLogProps) {
  if (entries.length === 0) {
    return (
      <Card className="card-warm">
        <CardHeader>
          <CardTitle className="text-teal-deep text-xl flex items-center gap-2">
            📋 Aaj Ka Dawa Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6 text-base">
            Aaj koi dawa scheduled nahi hai ya abhi tak koi reminder nahi aaya.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-warm">
      <CardHeader>
        <CardTitle className="text-teal-deep text-xl flex items-center gap-2">
          📋 Aaj Ka Dawa Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                entry.status === 'taken'
                  ? 'bg-success/10 border-success/30'
                  : entry.status === 'skipped'
                  ? 'bg-destructive/10 border-destructive/30'
                  : 'bg-saffron/10 border-saffron/30'
              }`}
            >
              {entry.status === 'taken' ? (
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
              ) : entry.status === 'skipped' ? (
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
              ) : (
                <Clock className="w-6 h-6 text-saffron flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-foreground">{entry.medicineName}</p>
                <p className="text-sm text-muted-foreground">
                  Scheduled: {entry.scheduledTime}
                  {entry.takenAt && ` • Li gayi: ${entry.takenAt}`}
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                entry.status === 'taken'
                  ? 'bg-success/20 text-success'
                  : entry.status === 'skipped'
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-saffron/20 text-saffron-warm'
              }`}>
                {entry.status === 'taken' ? 'Li Gayi ✓' : entry.status === 'skipped' ? 'Skip' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
