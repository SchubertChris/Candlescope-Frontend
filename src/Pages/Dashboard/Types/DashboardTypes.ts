// src/Pages/Dashboard/Types/DashboardTypes.ts
// ERWEITERT: Newsletter-Integration zu bestehenden Dashboard-Types
// GEÄNDERT: Newsletter-View zu DashboardView hinzugefügt

export type DashboardView = 'overview' | 'projects' | 'messages' | 'profile' | 'newsletter'; // GEÄNDERT: newsletter hinzugefügt

// GEÄNDERT: Nur noch 2 Rollen
export type UserRole = 'admin' | 'kunde';

export type ProjectType = 'website' | 'newsletter' | 'bewerbung' | 'ecommerce' | 'custom';

export type ProjectStatus = 'planning' | 'inProgress' | 'review' | 'completed';

export type ProjectPriority = 'low' | 'medium' | 'high';

export type MessageSenderRole = 'admin' | 'kunde';

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
  // HINZUGEFÜGT: Für Kunde-Admin Zuordnung
  assignedAdmin?: string; // Nur bei Kunden: welcher Admin zuständig ist
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  // GEÄNDERT: Admin statt Mitarbeiter
  assignedAdmin: string;
  // HINZUGEFÜGT: Kunde-Zuordnung für Datenschutz
  customerId: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
  filesCount: number;
  // ENTFERNT: progress (nicht mehr sichtbar)
  priority: ProjectPriority;
  description?: string;
  tags?: string[];
  // HINZUGEFÜGT: Für bessere Organisation
  isActive: boolean;
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
  // HINZUGEFÜGT: Für Datenschutz
  customerId: string; // Welcher Kunde darf diese Nachricht sehen
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
  customerId: string; // Datenschutz
}

// Dashboard Component Props - ERWEITERT mit Newsletter
export interface DashboardHeaderProps {
  user: User;
  notifications: number;
  onLogout: () => void;
}

export interface DashboardNavigationProps {
  activeView: DashboardView;
  notifications: number;
  userRole: UserRole; // HINZUGEFÜGT: Für Newsletter-Berechtigung
  onViewChange: (view: DashboardView) => void;
  onLogout: () => void; // HINZUGEFÜGT: Logout-Handler
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
  onCreateProject?: () => void; // Nur für Admin
}

export interface DashboardMessagesProps {
  messages: Message[];
  projects: Project[];
  onMessageRead: (messageId: string) => void;
  onSendMessage: (projectId: string, content: string) => void;
}

export interface DashboardProfileProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

// NEU: Newsletter Dashboard Props
export interface DashboardNewsletterProps {
  userRole: UserRole;
  onViewChange?: (view: DashboardView) => void;
}

// API Types - ERWEITERT
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

// Form Types - ANGEPASST
export interface CreateProjectForm {
  name: string;
  type: ProjectType;
  description: string;
  deadline: string;
  priority: ProjectPriority;
  customerId: string; // Welcher Kunde bekommt das Projekt
}

export interface UpdateUserForm {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
}

export interface SendMessageForm {
  projectId: string;
  content: string;
  attachments?: File[];
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
}

export interface MessageService {
  getMessages: (projectId?: string) => Promise<ApiResponse<Message[]>>;
  sendMessage: (message: SendMessageForm) => Promise<ApiResponse<Message>>;
  markAsRead: (messageId: string) => Promise<ApiResponse<void>>;
  getUnreadCount: () => Promise<ApiResponse<number>>;
}

export interface UserService {
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (updates: UpdateUserForm) => Promise<ApiResponse<User>>;
  getCustomers: () => Promise<ApiResponse<User[]>>; // Nur für Admin
}

// NEU: Dashboard View Permissions - Welche Rollen können welche Views sehen
export interface DashboardViewPermissions {
  overview: UserRole[];
  projects: UserRole[];
  messages: UserRole[];
  profile: UserRole[];
  newsletter: UserRole[]; // Nur Admin
}

// NEU: Dashboard State Management
export interface DashboardState {
  activeView: DashboardView;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  notifications: number;
}

// NEU: Dashboard Actions für State Management
export type DashboardAction = 
  | { type: 'SET_ACTIVE_VIEW'; payload: DashboardView }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: number }
  | { type: 'CLEAR_ERROR' };

// NEU: Dashboard Utility Functions
export interface DashboardUtils {
  canUserAccessView: (userRole: UserRole, view: DashboardView) => boolean;
  getViewLabel: (view: DashboardView) => string;
  getViewIcon: (view: DashboardView) => string;
  formatUserName: (user: User) => string;
  formatDate: (dateString: string) => string;
  formatRelativeTime: (dateString: string) => string;
}

// KONSTANTEN für View-Berechtigungen
export const DASHBOARD_VIEW_PERMISSIONS: DashboardViewPermissions = {
  overview: ['admin', 'kunde'],
  projects: ['admin', 'kunde'],
  messages: ['admin', 'kunde'],
  profile: ['admin', 'kunde'],
  newsletter: ['admin'] // Nur Admin kann Newsletter verwalten
};

// KONSTANTEN für View-Labels
export const DASHBOARD_VIEW_LABELS: Record<DashboardView, string> = {
  overview: 'Übersicht',
  projects: 'Projekte',
  messages: 'Nachrichten',
  profile: 'Profil',
  newsletter: 'Newsletter'
};

// KONSTANTEN für View-Icons (Lucide React Icon Namen)
export const DASHBOARD_VIEW_ICONS: Record<DashboardView, string> = {
  overview: 'Home',
  projects: 'FolderOpen', 
  messages: 'MessageSquare',
  profile: 'User',
  newsletter: 'Mail'
};

// Utility Functions als Konstanten
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

// NEU: Dashboard Navigation Item Interface
export interface DashboardNavigationItem {
  id: DashboardView;
  label: string;
  icon: string;
  allowedRoles: UserRole[];
  badge?: number | null;
  adminOnly?: boolean;
}

// NEU: Standard Navigation Items Konfiguration
export const getDashboardNavigationItems = (notifications: number = 0): DashboardNavigationItem[] => [
  {
    id: 'overview',
    label: DASHBOARD_VIEW_LABELS.overview,
    icon: DASHBOARD_VIEW_ICONS.overview,
    allowedRoles: ['admin', 'kunde']
  },
  {
    id: 'projects',
    label: DASHBOARD_VIEW_LABELS.projects,
    icon: DASHBOARD_VIEW_ICONS.projects,
    allowedRoles: ['admin', 'kunde']
  },
  {
    id: 'messages',
    label: DASHBOARD_VIEW_LABELS.messages,
    icon: DASHBOARD_VIEW_ICONS.messages,
    allowedRoles: ['admin', 'kunde'],
    badge: notifications > 0 ? notifications : null
  },
  {
    id: 'newsletter',
    label: DASHBOARD_VIEW_LABELS.newsletter,
    icon: DASHBOARD_VIEW_ICONS.newsletter,
    allowedRoles: ['admin'],
    adminOnly: true
  },
  {
    id: 'profile',
    label: DASHBOARD_VIEW_LABELS.profile,
    icon: DASHBOARD_VIEW_ICONS.profile,
    allowedRoles: ['admin', 'kunde']
  }
];

// Export aller Types für einfache Verwendung
export type {
  DashboardView,
  UserRole,
  ProjectType,
  ProjectStatus,
  ProjectPriority,
  MessageSenderRole,
  User,
  Project,
  Message,
  MessageAttachment,
  ProjectFile,
  DashboardViewPermissions,
  DashboardState,
  DashboardAction,
  DashboardUtils,
  DashboardNavigationItem
};