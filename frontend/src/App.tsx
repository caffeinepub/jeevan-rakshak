import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useHeartRateSimulation } from './hooks/useHeartRateSimulation';
import { useEmergencyAlert } from './hooks/useEmergencyAlert';
import { useMedicineReminders } from './hooks/useMedicineReminders';
import { DashboardHeader } from './components/DashboardHeader';
import { EmergencyAlertOverlay } from './components/EmergencyAlertOverlay';
import { EmergencyActivatedScreen } from './components/EmergencyActivatedScreen';
import { MedicineReminderModal } from './components/MedicineReminderModal';
import { ProfileSetup } from './pages/ProfileSetup';
import { Dashboard } from './pages/Dashboard';
import { MedicineManagement } from './pages/MedicineManagement';
import { HealthChat } from './pages/HealthChat';

type Page = 'dashboard' | 'medicines' | 'chat';

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, oklch(0.93 0.03 185), oklch(0.97 0.008 180))' }}
    >
      <div className="text-center">
        <div className="w-20 h-20 rounded-full teal-gradient flex items-center justify-center mx-auto mb-4 shadow-teal">
          <Heart className="w-10 h-10 text-white animate-pulse" fill="white" />
        </div>
        <h1 className="text-2xl font-bold text-teal-deep font-heading mb-2">Jeevan Rakshak</h1>
        <p className="text-muted-foreground">Loading ho raha hai...</p>
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-teal-mid animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, oklch(0.93 0.03 185), oklch(0.97 0.008 180), oklch(0.95 0.02 65))',
      }}
    >
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full teal-gradient flex items-center justify-center shadow-teal">
            <Heart className="w-12 h-12 text-white" fill="white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-teal-deep font-heading mb-2">Jeevan Rakshak</h1>
        <p className="text-xl text-muted-foreground mb-2">AI Life-Saver &amp; Health Assistant</p>
        <p className="text-base text-muted-foreground mb-8">
          Bimar aur buzurg logon ka vishwasniya saathi 💙
        </p>

        <div className="card-warm rounded-3xl p-8 mb-6 shadow-card">
          <div className="space-y-4 mb-6 text-left">
            {[
              { icon: '❤️', text: 'Real-time dhadkan monitoring' },
              { icon: '💊', text: 'Dawa reminder system' },
              { icon: '🏥', text: 'Symptom checker & health chat' },
              { icon: '🚨', text: 'Emergency alert system' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-base text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full py-5 text-lg font-bold rounded-2xl teal-gradient text-white border-0 shadow-teal hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Login ho raha hai...
              </span>
            ) : (
              '🔐 Login Karein'
            )}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Aapka data surakshit hai — Internet Computer par store hota hai
        </p>

        {/* Footer */}
        <footer className="mt-8 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Jeevan Rakshak &nbsp;·&nbsp; Built with{' '}
            <span className="text-emergency-red">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'jeevan-rakshak'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-teal-mid transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // Heart rate simulation
  const { bpm, setBpm, resetToNormal, isManualOverride } = useHeartRateSimulation();

  // Emergency alert
  const { alertState, countdown, dismissAlert, resetEmergency } = useEmergencyAlert(bpm);

  // Medicine reminders
  const medicines = profile?.medicines ?? [];
  const {
    activeReminder,
    doseLog,
    confirmTaken,
    snoozeReminder,
    dismissReminder,
    showImportance,
    setShowImportance,
  } = useMedicineReminders(medicines);

  // Show loading while initializing auth
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show loading while fetching profile
  if (profileLoading && !isFetched) {
    return <LoadingScreen />;
  }

  // Show profile setup if no profile exists
  const showProfileSetup = isAuthenticated && isFetched && profile === null;
  if (showProfileSetup) {
    return <ProfileSetup onComplete={() => {}} />;
  }

  // Fallback loading if profile still not available
  if (!profile) {
    return <LoadingScreen />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Emergency overlays — rendered on top of everything */}
      {alertState === 'alerting' && (
        <EmergencyAlertOverlay countdown={countdown} onDismiss={dismissAlert} />
      )}
      {alertState === 'emergency' && (
        <EmergencyActivatedScreen profile={profile} onFalseAlarm={resetEmergency} />
      )}

      {/* Medicine reminder modal */}
      <MedicineReminderModal
        medicine={activeReminder}
        onTaken={confirmTaken}
        onSnooze={snoozeReminder}
        onDismiss={dismissReminder}
        showImportance={showImportance}
        onShowImportance={setShowImportance}
      />

      {/* Header */}
      <DashboardHeader
        profile={profile}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === 'dashboard' && (
          <Dashboard
            profile={profile}
            bpm={bpm}
            onBpmChange={setBpm}
            onBpmReset={resetToNormal}
            isManualOverride={isManualOverride}
            doseLog={doseLog}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'medicines' && (
          <MedicineManagement
            profile={profile}
            doseLog={doseLog}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
        {currentPage === 'chat' && (
          <HealthChat onBack={() => setCurrentPage('dashboard')} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border bg-card">
        <p>
          © {new Date().getFullYear()} Jeevan Rakshak &nbsp;·&nbsp; Built with{' '}
          <span className="text-emergency-red">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'jeevan-rakshak'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-teal-mid transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
