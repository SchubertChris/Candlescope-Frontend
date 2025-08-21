// src/Pages/Dashboard/Types/NewsletterTypes.ts
// VOLLSTÄNDIGE NEWSLETTER TYPES - Frontend TypeScript Interfaces
export type NewsletterStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
export type NewsletterTemplateCategory = 'announcement' | 'newsletter' | 'promotion' | 'update' | 'custom';
export type SubscriberStatus = 'active' | 'unconfirmed' | 'unsubscribed';
export type NewsletterView = 'dashboard' | 'subscribers' | 'templates' | 'create' | 'edit' | 'statistics';

// ===========================
// NEWSLETTER SUBSCRIBER INTERFACES
// ===========================
export interface NewsletterSubscriber {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string; // Virtual field
  isConfirmed: boolean;
  isActive: boolean;
  confirmationToken?: string;
  unsubscribeToken: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  unsubscribeReason?: 'user_request' | 'bounce' | 'spam_complaint' | 'admin_action';
  source: 'contact_form' | 'newsletter_signup' | 'manual_import' | 'api';
  ipAddress: string;
  userAgent: string;
  totalEmailsReceived: number;
  totalEmailsOpened: number;
  lastOpenedAt?: string;
  totalLinksClicked: number;
  lastClickedAt?: string;
  openRate: number; // Virtual field
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriberForm {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface SubscriberFilters {
  status: SubscriberStatus;
  search: string;
  page: number;
  limit: number;
}

// ===========================
// NEWSLETTER TEMPLATE INTERFACES
// ===========================
export interface NewsletterTemplate {
  _id: string;
  name: string;
  subject: string;
  preheader: string;
  content: {
    html: string;
    text: string;
    json?: any; // Rich editor state
  };
  images: NewsletterImage[];
  scheduledDate?: string;
  isScheduled: boolean;
  status: NewsletterStatus;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sentAt?: string;
  isTemplate: boolean;
  templateCategory: NewsletterTemplateCategory;
  openRate: number; // Virtual field
  clickRate: number; // Virtual field
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CreateTemplateForm {
  name: string;
  subject: string;
  preheader: string;
  content: {
    html: string;
    text: string;
    json?: any;
  };
  images: NewsletterImage[];
  scheduledDate?: string;
  templateCategory: NewsletterTemplateCategory;
}

export interface UpdateTemplateForm extends Partial<CreateTemplateForm> {
  _id: string;
}

export interface TemplateFilters {
  status: NewsletterStatus | 'all';
  category?: NewsletterTemplateCategory;
  limit: number;
}

// ===========================
// NEWSLETTER SEND LOG INTERFACES
// ===========================
export interface NewsletterSendLog {
  _id: string;
  newsletterId: string;
  subscriberId: string;
  recipientEmail: string;
  subject: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  firstClickedAt?: string;
  openCount: number;
  clickCount: number;
  errorMessage?: string;
  retryCount: number;
  providerMessageId?: string;
  providerResponse?: any;
  createdAt: string;
  updatedAt: string;
}

// ===========================
// NEWSLETTER STATISTICS INTERFACES
// ===========================
export interface NewsletterStats {
  totalSubscribers: number;
  confirmedSubscribers: number;
  unconfirmedSubscribers: number;
  totalNewslettersSent: number;
  scheduledNewsletters: number;
  avgOpenRate: number;
  confirmationRate: number;
}

export interface TemplateStats {
  templateId: string;
  templateName: string;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  sentAt: string;
}

export interface SubscriberGrowth {
  date: string;
  newSubscribers: number;
  totalSubscribers: number;
  unsubscribes: number;
}

// ===========================
// API RESPONSE INTERFACES
// ===========================
export interface NewsletterApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedSubscribers {
  subscribers: NewsletterSubscriber[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalSubscribers: number;
  };
}

export interface NewsletterSendResult {
  templateId: string;
  totalSubscribers: number;
  sentCount: number;
  failedCount: number;
  sentAt: string;
}

export interface NewsletterConfirmation {
  requiresConfirmation: boolean;
  subscriberCount: number;
  message: string;
}

// ===========================
// RICH TEXT EDITOR INTERFACES
// ===========================
export interface RichEditorContent {
  html: string;
  text: string;
  json?: any; // Editor state (Quill, TinyMCE, etc.)
}

export interface EditorImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  position?: 'left' | 'center' | 'right';
}

export interface EditorConfig {
  toolbar: string[];
  placeholder: string;
  maxLength?: number;
  allowImages: boolean;
  allowLinks: boolean;
  allowFormatting: boolean;
}

// ===========================
// NEWSLETTER DASHBOARD PROPS
// ===========================
export interface NewsletterDashboardProps {
  userRole: 'admin' | 'kunde';
  onViewChange?: (view: NewsletterView) => void;
}

export interface NewsletterOverviewProps {
  stats: NewsletterStats;
  recentTemplates: NewsletterTemplate[];
  isLoading: boolean;
  onCreateTemplate: () => void;
  onViewSubscribers: () => void;
  onViewTemplates: () => void;
}

export interface SubscriberManagementProps {
  subscribers: NewsletterSubscriber[];
  pagination: PaginatedSubscribers['pagination'];
  filters: SubscriberFilters;
  isLoading: boolean;
  onFiltersChange: (filters: Partial<SubscriberFilters>) => void;
  onSubscriberDelete: (subscriberId: string) => void;
  onSubscriberAdd: (subscriber: CreateSubscriberForm) => void;
  onPageChange: (page: number) => void;
}

export interface TemplateManagementProps {
  templates: NewsletterTemplate[];
  filters: TemplateFilters;
  isLoading: boolean;
  onFiltersChange: (filters: Partial<TemplateFilters>) => void;
  onTemplateCreate: () => void;
  onTemplateEdit: (templateId: string) => void;
  onTemplatePreview: (templateId: string) => void;
  onTemplateSend: (templateId: string) => void;
  onTemplateDelete: (templateId: string) => void;
}

export interface TemplateEditorProps {
  template?: NewsletterTemplate;
  isEditing: boolean;
  isLoading: boolean;
  onSave: (template: CreateTemplateForm | UpdateTemplateForm) => void;
  onCancel: () => void;
  onPreview: (template: CreateTemplateForm) => void;
  onSchedule: (template: CreateTemplateForm, date: string) => void;
}

export interface NewsletterPreviewProps {
  template: NewsletterTemplate;
  onClose: () => void;
  onEdit: () => void;
  onSend: () => void;
  onSchedule: (date: string) => void;
}

export interface NewsletterStatsProps {
  stats: NewsletterStats;
  templateStats: TemplateStats[];
  subscriberGrowth: SubscriberGrowth[];
  isLoading: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

// ===========================
// FORM VALIDATION INTERFACES
// ===========================
export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export interface TemplateValidation extends ValidationResult {
  warnings?: string[];
}

export interface SubscriberValidation extends ValidationResult {
  duplicateEmail?: boolean;
}

// ===========================
// NEWSLETTER SERVICE INTERFACES
// ===========================
export interface NewsletterService {
  // Subscribers
  getSubscribers: (filters: SubscriberFilters) => Promise<NewsletterApiResponse<PaginatedSubscribers>>;
  createSubscriber: (subscriber: CreateSubscriberForm) => Promise<NewsletterApiResponse<NewsletterSubscriber>>;
  deleteSubscriber: (subscriberId: string) => Promise<NewsletterApiResponse<void>>;
  
  // Templates
  getTemplates: (filters: TemplateFilters) => Promise<NewsletterApiResponse<NewsletterTemplate[]>>;
  getTemplate: (templateId: string) => Promise<NewsletterApiResponse<NewsletterTemplate>>;
  createTemplate: (template: CreateTemplateForm) => Promise<NewsletterApiResponse<NewsletterTemplate>>;
  updateTemplate: (template: UpdateTemplateForm) => Promise<NewsletterApiResponse<NewsletterTemplate>>;
  deleteTemplate: (templateId: string) => Promise<NewsletterApiResponse<void>>;
  previewTemplate: (templateId: string) => Promise<NewsletterApiResponse<any>>;
  sendTemplate: (templateId: string, confirm: boolean) => Promise<NewsletterApiResponse<NewsletterSendResult | NewsletterConfirmation>>;
  
  // Statistics
  getStats: () => Promise<NewsletterApiResponse<NewsletterStats>>;
  getTemplateStats: (dateRange?: { start: string; end: string }) => Promise<NewsletterApiResponse<TemplateStats[]>>;
  getSubscriberGrowth: (dateRange?: { start: string; end: string }) => Promise<NewsletterApiResponse<SubscriberGrowth[]>>;
  
  // Public endpoints
  subscribeNewsletter: (email: string, firstName?: string, lastName?: string) => Promise<NewsletterApiResponse<any>>;
}

// ===========================
// UTILITY TYPES
// ===========================
export type NewsletterAction = 
  | 'CREATE_TEMPLATE'
  | 'EDIT_TEMPLATE'
  | 'DELETE_TEMPLATE'
  | 'SEND_TEMPLATE'
  | 'SCHEDULE_TEMPLATE'
  | 'PREVIEW_TEMPLATE'
  | 'ADD_SUBSCRIBER'
  | 'DELETE_SUBSCRIBER'
  | 'VIEW_STATS';

export interface NewsletterPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSend: boolean;
  canViewStats: boolean;
  canManageSubscribers: boolean;
}

// ===========================
// ERROR HANDLING
// ===========================
export interface NewsletterError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface NewsletterErrorBoundaryState {
  hasError: boolean;
  error?: NewsletterError;
}

// ===========================
// EXPORT ALL TYPES
// ===========================
export type {
  NewsletterStatus,
  NewsletterTemplateCategory,
  SubscriberStatus,
  NewsletterView
};