// ============================================================================
// ROLE SWITCHER (RESPONSIVE)
// ============================================================================

import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { User, Store, Shield, Truck, Headphones, ChevronRight, X } from 'lucide-react';

const roleIcons: Record<string, React.ElementType> = {
  customer: User,
  seller: Store,
  admin: Shield,
  delivery: Truck,
  support: Headphones
};

const roleColors: Record<string, string> = {
  customer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  seller: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivery: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  support: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
};

export const RoleSwitcher: React.FC = () => {
  const { currentRole, cycleRole, setRole, getRoleDisplayName } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const Icon = roleIcons[currentRole];

  const roles: Array<'customer' | 'seller' | 'admin' | 'delivery' | 'support'> = [
    'customer', 'seller', 'admin', 'delivery', 'support'
  ];

  return (
    <>
      {/* Mobile: Bottom Sheet Style */}
      <div className="sm:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full border shadow-lg transition-all ${roleColors[currentRole]}`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium font-body">{getRoleDisplayName(currentRole)}</span>
        </button>
      </div>

      {/* Mobile Role Selector Modal */}
      {isOpen && (
        <>
          <div 
            className="sm:hidden fixed inset-0 bg-black/60 z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-white/10 rounded-t-2xl z-50 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-warm-white font-display text-lg">Switch Role</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-warm-gray">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {roles.map(role => {
                const RoleIcon = roleIcons[role];
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setRole(role);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      currentRole === role
                        ? roleColors[role]
                        : 'bg-dark-base text-warm-gray border-white/10 hover:border-white/20'
                    }`}
                  >
                    <RoleIcon className="w-5 h-5" />
                    <span className="font-body">{getRoleDisplayName(role)}</span>
                    {currentRole === role && (
                      <span className="ml-auto text-xs">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Desktop: Floating Pill */}
      <div className="hidden sm:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-2">
        <div className="glass rounded-lg p-3 shadow-dark border border-white/10 max-w-[200px]">
          <p className="text-xs text-warm-gray mb-2 font-body">Demo Mode: Click to switch roles</p>
          <button
            onClick={cycleRole}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 ${roleColors[currentRole]}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium font-body">{getRoleDisplayName(currentRole)}</span>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        </div>
      </div>
    </>
  );
};
