import React from 'react';
import { LogOut, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import type { MedicalProfile } from '../backend';

interface DashboardHeaderProps {
  profile: MedicalProfile | null;
  currentPage: string;
  onNavigate: (page: string) => void;
}

function getConditionBadge(profile: MedicalProfile | null): string {
  if (!profile) return '';
  const conditions = profile.chronicConditions.slice(0, 2);
  return conditions.join(' | ');
}

export function DashboardHeader({ profile, currentPage, onNavigate }: DashboardHeaderProps) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const conditionBadge = getConditionBadge(profile);
  const isAuthenticated = !!identity;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'medicines', label: 'Dawaiyan', icon: '💊' },
    { id: 'chat', label: 'Health Chat', icon: '💬' },
  ];

  return (
    <header className="teal-gradient shadow-teal sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="relative">
              <img
                src="/assets/generated/jeevan-rakshak-logo.dim_256x256.png"
                alt="Jeevan Rakshak"
                className="w-10 h-10 rounded-full border-2 border-white/40 object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-saffron rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" fill="white" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight font-heading">
                Jeevan Rakshak
              </h1>
              <p className="text-white/70 text-xs">AI Health Assistant</p>
            </div>
          </div>

          {/* Nav Items - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-white/25 text-white'
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-white/70" />
                  <span className="text-white font-medium text-sm">{profile.name}</span>
                </div>
                {conditionBadge && (
                  <Badge className="text-xs bg-saffron/30 text-white border-saffron/40 mt-0.5">
                    {conditionBadge}
                  </Badge>
                )}
              </div>
            )}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Logout</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="flex md:hidden items-center gap-1 mt-2 overflow-x-auto pb-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-white/25 text-white'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
