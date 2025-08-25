// src/Pages/Dashboard/Context/DashboardContext.tsx
// Dashboard Data Provider für alle Child-Components

import React, { createContext, useContext, ReactNode } from 'react';
import { User, Project, Message, Invoice } from '../Types/DashboardTypes';

interface DashboardContextType {
  user: User;
  projects: Project[];
  messages: Message[];
  invoices: Invoice[];
  notifications: number;
  onProjectUpdate: (project: Project) => void;
  onMessageRead: (messageId: string) => void;
  onSendMessage: (projectId: string, content: string) => void;
  onInvoiceUpdate: (invoice: Invoice) => void;
  onCreateInvoice: () => void;
  onPayInvoice: (invoiceId: string) => void;
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
  onProjectUpdate: (project: Project) => void;
  onMessageRead: (messageId: string) => void;
  onSendMessage: (projectId: string, content: string) => void;
  onInvoiceUpdate: (invoice: Invoice) => void;
  onCreateInvoice: () => void;
  onPayInvoice: (invoiceId: string) => void;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  user,
  projects,
  messages,
  invoices,
  notifications,
  onProjectUpdate,
  onMessageRead,
  onSendMessage,
  onInvoiceUpdate,
  onCreateInvoice,
  onPayInvoice
}) => {
  const value = {
    user,
    projects,
    messages,
    invoices,
    notifications,
    onProjectUpdate,
    onMessageRead,
    onSendMessage,
    onInvoiceUpdate,
    onCreateInvoice,
    onPayInvoice
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};