// src/Services/Newsletter-Service.ts
// VOLLSTÄNDIGER NEWSLETTER SERVICE - Frontend API-Client
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types
import {
  NewsletterApiResponse,
  NewsletterSubscriber,
  NewsletterTemplate,
  NewsletterStats,
  NewsletterSendResult,
  NewsletterConfirmation,
  PaginatedSubscribers,
  SubscriberFilters,
  TemplateFilters,
  CreateSubscriberForm,
  CreateTemplateForm,
  UpdateTemplateForm,
  TemplateStats,
  SubscriberGrowth
} from '@/Pages/Dashboard/Types/NewsletterTypes';

class NewsletterService {
  private api: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    
    this.api = axios.create({
      baseURL: `${this.baseURL}/newsletter`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Für Cookie-basierte Auth
      timeout: 30000, // 30 Sekunden Timeout
    });

    // Request Interceptor für Auth-Token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Debug Logging in Development
        if (import.meta.env.DEV) {
          console.log('📧 Newsletter API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            params: config.params,
            data: config.data
          });
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Newsletter Request Interceptor Error:', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor für Error Handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
          console.log('✅ Newsletter API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
          });
        }
        return response;
      },
      (error) => {
        console.error('❌ Newsletter API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.message || error.message,
          data: error.response?.data
        });

        // Auth-Fehler behandeln
        if (error.response?.status === 401) {
          // Token ungültig - zur Login-Seite weiterleiten
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // ===========================
  // SUBSCRIBER MANAGEMENT
  // ===========================

  /**
   * Lädt alle Abonnenten mit Filterung und Pagination
   */
  async getSubscribers(filters: SubscriberFilters): Promise<NewsletterApiResponse<PaginatedSubscribers>> {
    try {
      const response = await this.api.get('/subscribers', {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search,
          status: filters.status
        }
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Laden der Abonnenten', error);
    }
  }

  /**
   * Erstellt einen neuen Abonnenten (Admin-only)
   */
  async createSubscriber(subscriber: CreateSubscriberForm): Promise<NewsletterApiResponse<NewsletterSubscriber>> {
    try {
      const response = await this.api.post('/subscribers', subscriber);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Hinzufügen des Abonnenten', error);
    }
  }

  /**
   * Löscht einen Abonnenten (Admin-only)
   */
  async deleteSubscriber(subscriberId: string): Promise<NewsletterApiResponse<void>> {
    try {
      const response = await this.api.delete(`/subscribers/${subscriberId}`);

      return {
        success: true,
        data: undefined,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Löschen des Abonnenten', error);
    }
  }

  /**
   * Exportiert Abonnenten als CSV
   */
  async exportSubscribers(filters?: Partial<SubscriberFilters>): Promise<NewsletterApiResponse<Blob>> {
    try {
      const response = await this.api.get('/subscribers/export', {
        params: filters,
        responseType: 'blob'
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Exportieren der Abonnenten', error);
    }
  }

  // ===========================
  // TEMPLATE MANAGEMENT
  // ===========================

  /**
   * Lädt alle Newsletter-Templates
   */
  async getTemplates(filters: TemplateFilters): Promise<NewsletterApiResponse<NewsletterTemplate[]>> {
    try {
      const response = await this.api.get('/templates', {
        params: {
          status: filters.status,
          category: filters.category,
          limit: filters.limit
        }
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Laden der Templates', error);
    }
  }

  /**
   * Lädt ein einzelnes Template
   */
  async getTemplate(templateId: string): Promise<NewsletterApiResponse<NewsletterTemplate>> {
    try {
      const response = await this.api.get(`/templates/${templateId}`);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Laden des Templates', error);
    }
  }

  /**
   * Erstellt ein neues Template
   */
  async createTemplate(template: CreateTemplateForm): Promise<NewsletterApiResponse<NewsletterTemplate>> {
    try {
      // Validierung vor dem Senden
      const validation = this.validateTemplate(template);
      if (!validation.isValid) {
        return {
          success: false,
          data: {} as NewsletterTemplate,
          error: Object.values(validation.errors).join(', ')
        };
      }

      const response = await this.api.post('/templates', template);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Erstellen des Templates', error);
    }
  }

  /**
   * Aktualisiert ein Template
   */
  async updateTemplate(template: UpdateTemplateForm): Promise<NewsletterApiResponse<NewsletterTemplate>> {
    try {
      // Validierung vor dem Senden
      const validation = this.validateTemplate(template);
      if (!validation.isValid) {
        return {
          success: false,
          data: {} as NewsletterTemplate,
          error: Object.values(validation.errors).join(', ')
        };
      }

      const { _id, ...updateData } = template;
      const response = await this.api.put(`/templates/${_id}`, updateData);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Aktualisieren des Templates', error);
    }
  }

  /**
   * Löscht ein Template
   */
  async deleteTemplate(templateId: string): Promise<NewsletterApiResponse<void>> {
    try {
      const response = await this.api.delete(`/templates/${templateId}`);

      return {
        success: true,
        data: undefined,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Löschen des Templates', error);
    }
  }

  /**
   * Generiert eine Template-Vorschau
   */
  async previewTemplate(templateId: string): Promise<NewsletterApiResponse<any>> {
    try {
      const response = await this.api.post(`/templates/${templateId}/preview`);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Generieren der Vorschau', error);
    }
  }

  /**
   * Versendet ein Template oder fordert Bestätigung an
   */
  async sendTemplate(templateId: string, confirm: boolean = false): Promise<NewsletterApiResponse<NewsletterSendResult | NewsletterConfirmation>> {
    try {
      const response = await this.api.post(`/templates/${templateId}/send`, {
        confirm
      });

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Versenden des Newsletters', error);
    }
  }

  /**
   * Plant ein Template für späteren Versand
   */
  async scheduleTemplate(templateId: string, scheduledDate: string): Promise<NewsletterApiResponse<NewsletterTemplate>> {
    try {
      const response = await this.api.put(`/templates/${templateId}`, {
        scheduledDate,
        isScheduled: true,
        status: 'scheduled'
      });

      return {
        success: true,
        data: response.data.data,
        message: 'Template erfolgreich geplant'
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Planen des Templates', error);
    }
  }

  // ===========================
  // STATISTICS
  // ===========================

  /**
   * Lädt Newsletter-Statistiken
   */
  async getStats(): Promise<NewsletterApiResponse<NewsletterStats>> {
    try {
      const response = await this.api.get('/stats');

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Laden der Statistiken', error);
    }
  }

  /**
   * Lädt Template-spezifische Statistiken
   */
  async getTemplateStats(dateRange?: { start: string; end: string }): Promise<NewsletterApiResponse<TemplateStats[]>> {
    try {
      const response = await this.api.get('/stats/templates', {
        params: dateRange
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Laden der Template-Statistiken', error);
    }
  }

  /**
   * Lädt Abonnenten-Wachstum über Zeit
   */
  async getSubscriberGrowth(dateRange?: { start: string; end: string }): Promise<NewsletterApiResponse<SubscriberGrowth[]>> {
    try {
      const response = await this.api.get('/stats/growth', {
        params: dateRange
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Laden der Wachstums-Statistiken', error);
    }
  }

  // ===========================
  // PUBLIC ENDPOINTS (für Newsletter-Anmeldung)
  // ===========================

  /**
   * Öffentliche Newsletter-Anmeldung
   */
  async subscribeNewsletter(email: string, firstName?: string, lastName?: string): Promise<NewsletterApiResponse<any>> {
    try {
      const response = await this.api.post('/subscribe', {
        email,
        firstName,
        lastName,
        source: 'contact_form'
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler bei der Newsletter-Anmeldung', error);
    }
  }

  /**
   * E-Mail-Bestätigung (Double-Opt-In)
   */
  async confirmSubscription(token: string): Promise<NewsletterApiResponse<any>> {
    try {
      const response = await this.api.get(`/confirm/${token}`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler bei der Bestätigung', error);
    }
  }

  /**
   * Newsletter abbestellen
   */
  async unsubscribeNewsletter(token: string): Promise<NewsletterApiResponse<any>> {
    try {
      const response = await this.api.get(`/unsubscribe/${token}`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return this.handleError('Fehler beim Abmelden', error);
    }
  }

  // ===========================
  // VALIDATION HELPERS
  // ===========================

  /**
   * Validiert Template-Daten vor dem Senden
   */
  private validateTemplate(template: Partial<CreateTemplateForm>): { isValid: boolean; errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};

    // Name validieren
    if (!template.name || template.name.trim().length === 0) {
      errors.name = 'Template-Name ist erforderlich';
    } else if (template.name.length > 100) {
      errors.name = 'Template-Name darf maximal 100 Zeichen lang sein';
    }

    // Subject validieren
    if (!template.subject || template.subject.trim().length === 0) {
      errors.subject = 'Betreff ist erforderlich';
    } else if (template.subject.length > 200) {
      errors.subject = 'Betreff darf maximal 200 Zeichen lang sein';
    }

    // Content validieren
    if (!template.content || !template.content.html || template.content.html.trim().length === 0) {
      errors.content = 'HTML-Content ist erforderlich';
    }

    // Scheduled Date validieren
    if (template.scheduledDate) {
      const scheduledDate = new Date(template.scheduledDate);
      const now = new Date();
      
      if (scheduledDate <= now) {
        errors.scheduledDate = 'Geplantes Datum muss in der Zukunft liegen';
      }
    }

    // Images validieren
    if (template.images && template.images.length > 0) {
      template.images.forEach((image, index) => {
        if (!image.url || !this.isValidUrl(image.url)) {
          errors[`image_${index}`] = `Bild ${index + 1}: Ungültige URL`;
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validiert eine URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // ===========================
  // UTILITY METHODS
  // ===========================

  /**
   * Einheitliche Error-Behandlung
   */
  private handleError<T>(defaultMessage: string, error: any): NewsletterApiResponse<T> {
    let errorMessage = defaultMessage;
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      data: {} as T,
      error: errorMessage
    };
  }

  /**
   * Formatiert Dateien für Download
   */
  async downloadFile(blob: Blob, filename: string): Promise<void> {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ File download failed:', error);
      throw new Error('Fehler beim Download der Datei');
    }
  }

  /**
   * Formatiert HTML für Vorschau
   */
  sanitizeHtml(html: string): string {
    // Einfache HTML-Säuberung (in Produktion sollte DOMPurify verwendet werden)
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }

  /**
   * Generiert Personalisierungs-Vorschau
   */
  generatePersonalizationPreview(content: string, subscriberData?: Partial<NewsletterSubscriber>): string {
    const mockData = {
      firstName: subscriberData?.firstName || 'Max',
      lastName: subscriberData?.lastName || 'Mustermann',
      email: subscriberData?.email || 'max.mustermann@example.com'
    };

    return content
      .replace(/\{\{firstName\}\}/g, mockData.firstName)
      .replace(/\{\{lastName\}\}/g, mockData.lastName)
      .replace(/\{\{fullName\}\}/g, `${mockData.firstName} ${mockData.lastName}`)
      .replace(/\{\{email\}\}/g, mockData.email);
  }

  /**
   * Berechnet geschätzte Versandzeit
   */
  calculateEstimatedSendTime(subscriberCount: number): string {
    // Annahme: 10 E-Mails pro Sekunde (Batch-Verarbeitung)
    const emailsPerSecond = 10;
    const totalSeconds = Math.ceil(subscriberCount / emailsPerSecond);
    
    if (totalSeconds < 60) {
      return `ca. ${totalSeconds} Sekunden`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.ceil(totalSeconds / 60);
      return `ca. ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
    } else {
      const hours = Math.ceil(totalSeconds / 3600);
      return `ca. ${hours} Stunde${hours > 1 ? 'n' : ''}`;
    }
  }
}

// ===========================
// SINGLETON EXPORT
// ===========================
const newsletterService = new NewsletterService();

// Development Debug
if (import.meta.env.DEV) {
  (window as any).newsletterService = newsletterService;
  console.log('📧 Newsletter Service available in window.newsletterService for debugging');
}

export default newsletterService;