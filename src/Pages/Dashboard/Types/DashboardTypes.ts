// src/Pages/Dashboard/Types/DashboardTypes.ts
// Zentrale TypeScript Typen für das Dashboard

export type DashboardView = 'overview' | 'projects' | 'messages' | 'profile';

export type UserRole = 'admin' | 'mitarbeiter' | 'kunde';

export type ProjectType = 'website' | 'newsletter' | 'bewerbung' | 'ecommerce' | 'custom';

export type ProjectStatus = 'planning' | 'inProgress' | 'review' | 'completed';

export type ProjectPriority = 'low' | 'medium' | 'high';

export type MessageSenderRole = 'kunde' | 'mitarbeiter';

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
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  assignedEmployee?: string;
  deadline: string;
  createdAt: string;
  messagesCount: number;
  filesCount: number;
  progress: number;
  priority: ProjectPriority;
  description?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  projectId: string;
  sender: string;
  senderRole: MessageSenderRole;
  content: string;
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
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
}

// Dashboard Component Props
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
}

export interface DashboardMessagesProps {
  messages: Message[];
  projects: Project[];
  onMessageRead: (messageId: string) => void;
}

export interface DashboardProfileProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

// Utility Types für API Responses
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
  assignedEmployee?: string;
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

// Mock Data Helpers
export interface MockDataService {
  getProjects: (userId: string) => Promise<Project[]>;
  getMessages: (userId: string) => Promise<Message[]>;
  createProject: (project: CreateProjectForm) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<Project>;
  sendMessage: (message: SendMessageForm) => Promise<Message>;
  markMessageAsRead: (messageId: string) => Promise<void>;
}