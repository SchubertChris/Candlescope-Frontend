// src/Pages/Dashboard/Types/DashboardTypes.ts
// ERWEITERT: 6 Dashboard-Bereiche + neue Interfaces

// ERWEITERT: 6 Views statt 5
export type DashboardView = 'overview' | 'projects' | 'messages' | 'invoices' | 'newsletter' | 'settings' | 'profile';

export type UserRole = 'admin' | 'kunde';

export type ProjectType = 'website' | 'newsletter' | 'bewerbung' | 'ecommerce' | 'custom';

export type ProjectStatus = 'planning' | 'inProgress' | 'review' | 'completed';

export type ProjectPriority = 'low' | 'medium' | 'high';

export type MessageSenderRole = 'admin' | 'kunde';

// NEU: Invoice Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'bank_transfer' | 'paypal' | 'stripe' | 'cash';

// Bestehende Interfaces...
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  company?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  assignedAdmin?: string;
  // NEU: Erweiterte Geschäftsdaten
  businessData?: {
    taxId?: string;
    vatNumber?: string;
    address?: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    phone?: string;
    website?: string;
  };
  // NEU: 2FA Settings
  twoFactorAuth?: {
    enabled: boolean;
    backupCodes?: string[];
    lastUsed?: string;
  };
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  assignedAdmin: string;
  customerId: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
  filesCount: number;
  priority: ProjectPriority;
  description?: string;
  tags?: string[];
  isActive: boolean;
  // NEU: Unsichtbare Admin-Notizen
  adminNotes?: string;
  // NEU: Projektdateien mit Textanhängen
  files?: ProjectFile[];
}

// NEU: Invoice Interface
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  adminId: string;
  projectId?: string; // Optional: Zuordnung zu Projekt
  status: InvoiceStatus;
  amount: number;
  currency: string;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  description: string;
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // NEU: Zahlungsinformationen
  paymentInfo?: {
    transactionId?: string;
    paymentReference?: string;
    bankDetails?: {
      accountNumber: string;
      routingNumber: string;
      bankName: string;
    };
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  senderRole: MessageSenderRole;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
  attachments?: MessageAttachment[];
  customerId: string;
  // NEU: Unsichtbare Admin-Notizen
  adminNote?: string;
  isAdminNoteVisible?: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  customerId: string;
  // NEU: Textanhang zu jeder Datei
  description?: string;
  category?: string;
  version?: string;
}

// Dashboard Component Props - ERWEITERT
export interface DashboardHeaderProps {
  user: User;
  notifications: number;
  onLogout: () => void;
}

export interface DashboardNavigationProps {
  activeView: DashboardView;
  notifications: number;
  userRole: UserRole;
  onViewChange: (view: DashboardView) => void;
  onLogout: () => void;
}

export interface DashboardOverviewProps {
  projects: Project[];
  messages: Message[];
  notifications: number;
  onViewChange: (view: DashboardView) => void;
}

export interface DashboardProjectsProps {
  projects: Project[];
  userRole: UserRole;
  onProjectUpdate: (project: Project) => void;
  onCreateProject?: () => void;
}

export interface DashboardMessagesProps {
  messages: Message[];
  projects: Project[];
  onMessageRead: (messageId: string) => void;
  onSendMessage: (projectId: string, content: string) => void;
}

// NEU: Invoice Props
export interface DashboardInvoicesProps {
  invoices: Invoice[];
  userRole: UserRole;
  onInvoiceUpdate?: (invoice: Invoice) => void;
  onCreateInvoice?: () => void;
  onPayInvoice?: (invoiceId: string) => void;
}

// NEU: Settings Props
export interface DashboardSettingsProps {
  user: User;
  userRole: UserRole;
  onUserUpdate: (user: User) => void;
  on2FAToggle?: (enabled: boolean) => void;
  onPasswordChange?: (oldPassword: string, newPassword: string) => void;
}

export interface DashboardProfileProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export interface DashboardNewsletterProps {
  userRole: UserRole;
  onViewChange?: (view: DashboardView) => void;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface CreateProjectForm {
  name: string;
  type: ProjectType;
  description: string;
  deadline: string;
  priority: ProjectPriority;
  customerId: string;
}

export interface UpdateUserForm {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  businessData?: User['businessData'];
}

export interface SendMessageForm {
  projectId: string;
  content: string;
  attachments?: File[];
  adminNote?: string; // NEU: Unsichtbare Admin-Notizen
}

// NEU: Invoice Forms
export interface CreateInvoiceForm {
  customerId: string;
  projectId?: string;
  description: string;
  items: Omit<InvoiceItem, 'id' | 'totalPrice'>[];
  dueDate: string;
  notes?: string;
  taxRate: number;
}

export interface UpdateInvoiceForm extends Partial<CreateInvoiceForm> {
  id: string;
  status?: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paymentInfo?: Invoice['paymentInfo'];
}

// Backend Service Interfaces
export interface AuthService {
  getCurrentUser: () => User | null;
  login: (email: string, password: string) => Promise<ApiResponse<User>>;
  logout: () => void;
  refreshToken: () => Promise<ApiResponse<User>>;
}

export interface ProjectService {
  getProjects: () => Promise<ApiResponse<Project[]>>;
  getProject: (id: string) => Promise<ApiResponse<Project>>;
  createProject: (project: CreateProjectForm) => Promise<ApiResponse<Project>>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<ApiResponse<Project>>;
  deleteProject: (id: string) => Promise<ApiResponse<void>>;
  uploadFile: (projectId: string, file: File, description?: string) => Promise<ApiResponse<ProjectFile>>;
}

export interface MessageService {
  getMessages: (projectId?: string) => Promise<ApiResponse<Message[]>>;
  sendMessage: (message: SendMessageForm) => Promise<ApiResponse<Message>>;
  markAsRead: (messageId: string) => Promise<ApiResponse<void>>;
  getUnreadCount: () => Promise<ApiResponse<number>>;
}

// NEU: Invoice Service
export interface InvoiceService {
  getInvoices: (customerId?: string) => Promise<ApiResponse<Invoice[]>>;
  getInvoice: (id: string) => Promise<ApiResponse<Invoice>>;
  createInvoice: (invoice: CreateInvoiceForm) => Promise<ApiResponse<Invoice>>;
  updateInvoice: (id: string, updates: UpdateInvoiceForm) => Promise<ApiResponse<Invoice>>;
  markAsPaid: (id: string, paymentInfo: Invoice['paymentInfo']) => Promise<ApiResponse<Invoice>>;
  generatePDF: (id: string) => Promise<ApiResponse<string>>; // Returns PDF URL
}

export interface UserService {
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (updates: UpdateUserForm) => Promise<ApiResponse<User>>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<ApiResponse<void>>;
  enable2FA: () => Promise<ApiResponse<{ qrCode: string; backupCodes: string[] }>>;
  verify2FA: (code: string) => Promise<ApiResponse<void>>;
  disable2FA: (code: string) => Promise<ApiResponse<void>>;
  getCustomers: () => Promise<ApiResponse<User[]>>; // Nur für Admin
}

// Dashboard View Permissions - ERWEITERT
export interface DashboardViewPermissions {
  overview: UserRole[];
  projects: UserRole[];
  messages: UserRole[];
  invoices: UserRole[];
  newsletter: UserRole[];
  settings: UserRole[];
  profile: UserRole[];
}

// Dashboard State Management
export interface DashboardState {
  activeView: DashboardView;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  notifications: number;
}

export type DashboardAction = 
  | { type: 'SET_ACTIVE_VIEW'; payload: DashboardView }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: number }
  | { type: 'CLEAR_ERROR' };

// ERWEITERTE KONSTANTEN
export const DASHBOARD_VIEW_PERMISSIONS: DashboardViewPermissions = {
  overview: ['admin', 'kunde'],
  projects: ['admin', 'kunde'],
  messages: ['admin', 'kunde'],
  invoices: ['admin', 'kunde'],
  newsletter: ['admin'], // Nur Admin
  settings: ['admin', 'kunde'],
  profile: ['admin', 'kunde']
};

export const DASHBOARD_VIEW_LABELS: Record<DashboardView, string> = {
  overview: 'Übersicht',
  projects: 'Projekte',
  messages: 'Nachrichten',
  invoices: 'Rechnungen',
  newsletter: 'Newsletter',
  settings: 'Einstellungen',
  profile: 'Profil'
};

export const DASHBOARD_VIEW_ICONS: Record<DashboardView, string> = {
  overview: 'Home',
  projects: 'FolderOpen',
  messages: 'MessageSquare',
  invoices: 'ReceiptTax',
  newsletter: 'Mail',
  settings: 'Settings',
  profile: 'User'
};

// Utility Functions
export const canUserAccessView = (userRole: UserRole, view: DashboardView): boolean => {
  return DASHBOARD_VIEW_PERMISSIONS[view].includes(userRole);
};

export const getAvailableViews = (userRole: UserRole): DashboardView[] => {
  return Object.keys(DASHBOARD_VIEW_PERMISSIONS).filter(view => 
    canUserAccessView(userRole, view as DashboardView)
  ) as DashboardView[];
};

export const formatUserName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.firstName || user.lastName || user.email.split('@')[0];
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'gerade eben';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
  }
};

// NEU: Currency & Invoice Formatting
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatInvoiceNumber = (number: string, prefix: string = 'INV'): string => {
  return `${prefix}-${number.padStart(6, '0')}`;
};

// Export aller Types
// (Alle Typen und Interfaces werden bereits oben exportiert)