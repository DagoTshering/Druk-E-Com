// ============================================================================
// ROLE CONTEXT
// ============================================================================
// Manages the active role across the application for demo purposes
// ============================================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserRole } from '../dataStore';

const roles: UserRole[] = ['customer', 'seller', 'admin', 'delivery', 'support'];

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  cycleRole: () => void;
  availableRoles: UserRole[];
  getRoleDisplayName: (role: UserRole) => string;
  getRoleColor: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  const setRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
  }, []);

  const cycleRole = useCallback(() => {
    const currentIndex = roles.indexOf(currentRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    setCurrentRole(roles[nextIndex]);
  }, [currentRole]);

  const getRoleDisplayName = useCallback((role: UserRole): string => {
    const displayNames: Record<UserRole, string> = {
      customer: 'Customer',
      seller: 'Seller',
      admin: 'Admin',
      delivery: 'Delivery',
      support: 'Support Agent'
    };
    return displayNames[role];
  }, []);

  const getRoleColor = useCallback((role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      customer: 'bg-blue-500',
      seller: 'bg-emerald-500',
      admin: 'bg-purple-500',
      delivery: 'bg-orange-500',
      support: 'bg-pink-500'
    };
    return colors[role];
  }, []);

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole,
        cycleRole,
        availableRoles: roles,
        getRoleDisplayName,
        getRoleColor
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
