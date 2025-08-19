// src/Services/Dashboard-Service.ts
// KORRIGIERT: Dashboard-Service ohne doppelte API-Pfade
import axiosInstance from "./AxiosInstance-Service";
import {
  User,
  Project,
  Message,
  ApiResponse,
} from "@/Pages/Dashboard/Types/DashboardTypes";

interface DashboardData {
  user: User;
  projects: Project[];
  messages: Message[];
  notifications: number;
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalMessages: number;
    unreadMessages: number;
    totalFiles: number;
  };
}

class DashboardService {
  // ===========================
  // DASHBOARD OVERVIEW
  // ===========================

  async getDashboardData(): Promise<DashboardData> {
    try {
      // KORRIGIERT: Kein doppeltes /api - axiosInstance hat bereits baseURL mit /api
      const response = await axiosInstance.get("/dashboard");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to load dashboard data");
      }
    } catch (error: any) {
      console.error("❌ Dashboard Service Error:", error);
      this.handleError(error);
      throw error;
    }
  }

  // ===========================
  // PROJEKT-VERWALTUNG
  // ===========================

  async getProjects(): Promise<Project[]> {
    try {
      // KORRIGIERT: Relative URL ohne /api
      const response = await axiosInstance.get("/dashboard/projects");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to load projects");
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async createProject(projectData: {
    name: string;
    type: string;
    description: string;
    deadline: string;
    priority: string;
    customerId: string;
  }): Promise<Project> {
    try {
      const response = await axiosInstance.post(
        "/dashboard/projects",
        projectData
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to create project");
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProject(
    projectId: string,
    updates: Partial<Project>
  ): Promise<Project> {
    try {
      const response = await axiosInstance.put(
        `/dashboard/projects/${projectId}`,
        updates
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to update project");
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      const response = await axiosInstance.delete(
        `/dashboard/projects/${projectId}`
      );

      if (response.data.success) {
      } else {
        throw new Error(response.data.error || "Failed to delete project");
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  // ===========================
  // NACHRICHTEN-VERWALTUNG
  // ===========================

  async getMessages(projectId?: string): Promise<Message[]> {
    try {
      const url = projectId
        ? `/dashboard/messages?projectId=${projectId}`
        : "/dashboard/messages";
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to load messages");
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async sendMessage(messageData: {
    projectId: string;
    content: string;
    attachments?: File[];
  }): Promise<Message> {
    try {
      // FormData für Datei-Uploads
      const formData = new FormData();
      formData.append("projectId", messageData.projectId);
      formData.append("content", messageData.content);

      if (messageData.attachments) {
        messageData.attachments.forEach((file, index) => {
          formData.append(`attachments`, file);
        });
      }

      const response = await axiosInstance.post(
        "/dashboard/messages",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to send message");
      }
    } catch (error: any) {
      console.error("❌ Send Message Error:", error);
      this.handleError(error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const response = await axiosInstance.put(
        `/dashboard/messages/${messageId}/read`
      );

      if (response.data.success) {
      } else {
        throw new Error(
          response.data.error || "Failed to mark message as read"
        );
      }
    } catch (error: any) {
      console.error("❌ Mark Message Read Error:", error);
      this.handleError(error);
      throw error;
    }
  }

  // ===========================
  // BENUTZER-VERWALTUNG
  // ===========================

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    company?: string;
  }): Promise<User> {
    try {
      const response = await axiosInstance.put(
        "/dashboard/profile",
        profileData
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("❌ Update Profile Error:", error);
      this.handleError(error);
      throw error;
    }
  }

  async getCustomers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get("/dashboard/customers");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to load customers");
      }
    } catch (error: any) {
      console.error("❌ Customers Service Error:", error);
      this.handleError(error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const response = await axiosInstance.get("/dashboard/stats");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to load statistics");
      }
    } catch (error: any) {
      console.error("❌ Stats Service Error:", error);
      this.handleError(error);
      throw error;
    }
  }

  // ===========================
  // HILFSFUNKTIONEN
  // ===========================

  private handleError(error: any): void {
    if (error.response) {
      // Server-Response mit Fehler
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "Server-Fehler";
      console.error("Server Error:", message);
      throw new Error(message);
    } else if (error.request) {
      // Request wurde gesendet, aber keine Response erhalten
      console.error("Network Error:", error.request);
      throw new Error(
        "Netzwerk-Fehler. Bitte prüfen Sie Ihre Internetverbindung."
      );
    } else {
      // Anderer Fehler
      console.error("Unexpected Error:", error.message);
      throw new Error(
        error.message || "Ein unerwarteter Fehler ist aufgetreten."
      );
    }
  }

  // Hilfsfunktion für formatierte Zeitangaben
  formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMs = now.getTime() - messageTime.getTime();

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `vor ${days} Tag${days > 1 ? "en" : ""}`;
    } else if (hours > 0) {
      return `vor ${hours} Stunde${hours > 1 ? "n" : ""}`;
    } else if (minutes > 0) {
      return `vor ${minutes} Minute${minutes > 1 ? "n" : ""}`;
    } else {
      return "gerade eben";
    }
  }

  // Projekt-Status-Farben
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      planning: "#3b82f6",
      inProgress: "#f59e0b",
      review: "#8b5cf6",
      completed: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  }

  // Prioritäts-Farben
  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      low: "#10b981",
      medium: "#f59e0b",
      high: "#ef4444",
      urgent: "#dc2626",
    };
    return colors[priority] || "#6b7280";
  }
}

// Singleton-Instanz exportieren
const dashboardService = new DashboardService();
export default dashboardService;
