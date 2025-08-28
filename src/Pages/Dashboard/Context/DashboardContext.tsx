// src/Pages/Dashboard/Context/DashboardContext.tsx
// KORRIGIERT: Loading State hinzugefügt um Flackern zu vermeiden

import React, { createContext, useContext, ReactNode } from 'react';
import { User, Project, Message, Invoice } from '../Types/DashboardTypes';

interface DashboardContextType {
  user: User;
  projects: Project[];
  messages: Message[];
  invoices: Invoice[];
  notifications: number;
  isLoading: boolean; // ← HINZUGEFÜGT: Loading State
  onProjectUpdate: (project: Project) => void;
  onMessageRead: (messageId: string) => void;
  onSendMessage: (projectId: string, content: string) => void;
  onInvoiceUpdate: (invoice: Invoice) => void;
  onCreateInvoice: () => void;
  onPayInvoice: (invoiceId: string) => void;
  onUserUpdate: (user: User) => void;
  onLogout?: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
  user: User;
  projects: Project[];
  messages: Message[];
  invoices: Invoice[];
  notifications: number;
  isLoading: boolean; // ← HINZUGEFÜGT: Loading State Prop
  onProjectUpdate: (project: Project) => void;
  onMessageRead: (messageId: string) => void;
  onSendMessage: (projectId: string, content: string) => void;
  onInvoiceUpdate: (invoice: Invoice) => void;
  onCreateInvoice: () => void;
  onPayInvoice: (invoiceId: string) => void;
  onUserUpdate: (user: User) => void;
  onLogout?: () => void;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  user,
  projects,
  messages,
  invoices,
  notifications,
  isLoading, // ← HINZUGEFÜGT: Loading State Parameter
  onProjectUpdate,
  onMessageRead,
  onSendMessage,
  onInvoiceUpdate,
  onCreateInvoice,
  onPayInvoice,
  onUserUpdate,
  onLogout
}) => {
  const value = {
    user,
    projects,
    messages,
    invoices,
    notifications,
    isLoading, // ← HINZUGEFÜGT: Loading State im Context Value
    onProjectUpdate,
    onMessageRead,
    onSendMessage,
    onInvoiceUpdate,
    onCreateInvoice,
    onPayInvoice,
    onUserUpdate,
    onLogout
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};