// src/Services/Contact-Service.ts
// BEREINIGT: Ohne Duplikate, für deine Backend-Integration
import axiosInstance from './AxiosInstance-Service';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  newsletter: boolean;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    contactId: string;
    timestamp: string;
  };
}

class ContactService {
  
  // Kontaktanfrage senden
  async sendContactRequest(formData: ContactFormData): Promise<ContactResponse> {
    try {
      console.log('📧 SENDING CONTACT REQUEST:', formData.email);
      
      const response = await axiosInstance.post('/contact', {
        ...formData,
        source: 'website_contact_form'
      });

      console.log('✅ CONTACT REQUEST SUCCESS:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ CONTACT REQUEST ERROR:', error);
      
      // Spezifische Fehlerbehandlung für Rate Limiting
      if (error.response?.status === 429) {
        throw new Error('Zu viele Anfragen. Bitte warten Sie 15 Minuten und versuchen Sie es erneut.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.');
    }
  }

  // Projekt-spezifische Anfrage (aus OffersSection)
  async sendProjectInquiry(projectType: string, contactData: Partial<ContactFormData>): Promise<ContactResponse> {
    try {
      console.log('🎯 PROJECT INQUIRY:', projectType);
      
      const response = await axiosInstance.post('/contact/project-inquiry', {
        ...contactData,
        projectType,
        source: 'offers_section'
      });

      console.log('✅ PROJECT INQUIRY SUCCESS:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ PROJECT INQUIRY ERROR:', error);
      
      if (error.response?.status === 429) {
        throw new Error('Zu viele Anfragen. Bitte warten Sie 15 Minuten.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Fehler beim Senden der Projekt-Anfrage.');
    }
  }

  // Rate-Limit Status prüfen
  async checkRateLimit(email: string): Promise<any> {
    try {
      const response = await axiosInstance.get(`/contact/rate-limit/${email}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ RATE LIMIT CHECK ERROR:', error);
      return null;
    }
  }

  // Frontend-Validierung vor dem Senden
  async validateContactSubmission(formData: ContactFormData): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Frontend-Validierung
    if (!formData.name.trim()) {
      errors.push('Name ist erforderlich');
    }

    if (!formData.email.trim()) {
      errors.push('E-Mail ist erforderlich');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      }
    }

    if (!formData.message.trim()) {
      errors.push('Nachricht ist erforderlich');
    } else if (formData.message.length > 2000) {
      errors.push('Nachricht darf maximal 2000 Zeichen lang sein');
    }

    // Rate-Limit prüfen
    try {
      const rateLimitStatus = await this.checkRateLimit(formData.email);
      if (rateLimitStatus && !rateLimitStatus.data.canSubmit) {
        errors.push('Zu viele Anfragen von dieser E-Mail-Adresse. Bitte warten Sie 15 Minuten.');
      }
    } catch (error) {
      console.warn('⚠️ Could not check rate limit:', error);
      // Rate-Limit-Fehler nicht blockierend
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Newsletter-Anmeldung (für spätere Verwendung)
  async subscribeNewsletter(email: string, name?: string): Promise<ContactResponse> {
    try {
      console.log('📬 NEWSLETTER SUBSCRIPTION:', email);
      
      const response = await axiosInstance.post('/newsletter/subscribe', {
        email,
        name,
        source: 'contact_form',
        timestamp: new Date().toISOString()
      });

      console.log('✅ NEWSLETTER SUBSCRIPTION SUCCESS');
      return response.data;
      
    } catch (error: any) {
      console.error('❌ NEWSLETTER SUBSCRIPTION ERROR:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Fehler bei der Newsletter-Anmeldung.');
    }
  }
}

// Singleton-Pattern
const contactService = new ContactService();

// Development Debug
if (import.meta.env.DEV) {
  (window as any).contactService = contactService;
  console.log('🔧 ContactService available in window.contactService for debugging');
}

export default contactService;