// src/Pages/Dashboard/Types/DashboardTypes.ts
// ANGEPASST: 2-Rollen-System (Admin/Kunde) ohne Fortschritt

export type DashboardView = 'overview' | 'projects' | 'messages' | 'profile';

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

// Dashboard Component Props - ANGEPASST
export interface DashboardHeaderProps {
  user: User;
  notifications: number;
  onLogout: () => void;
}

export interface DashboardNavigationProps {
  activeView: DashboardView;
  notifications: number;
  onViewChange: (view: DashboardView) => void;
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