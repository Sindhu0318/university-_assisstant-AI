const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Citation {
  document_id: string;
  document_title: string;
  category?: string;
  section?: string;
  page_number?: number;
  version?: string;
  effective_date?: string;
  snippet?: string;
  relevance_score?: number;
}

export interface ChatMessage {
  id?: string;
  message_id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  language?: string;
  sources?: Citation[];
  suggested_followups?: string[];
  latency_ms?: number;
  query_intent?: string;
  feedback?: { is_helpful: number; comment?: string };
  timestamp?: string;
}

export interface Conversation {
  conversation_id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export interface AssessmentItem {
  id: number;
  code_module: string;
  code_presentation: string;
  id_assessment: number;
  assessment_type: string;
  date?: number;
  weight: number;
  title?: string;
  description?: string;
}

export interface NoticeItem {
  id: number;
  title: string;
  description: string;
  category: string;
  department: string;
  priority: string;
  date: string;
  effective_date: string;
  expiry_date?: string;
  attachment_url?: string;
  is_active: boolean;
}

export interface ScholarshipItem {
  id: number;
  name: string;
  category: string;
  eligibility: string;
  income_limit?: number;
  min_cgpa?: number;
  award_amount: string;
  deadline: string;
  application_url?: string;
  required_documents?: string;
  contact_person?: string;
}

export interface CalendarItem {
  id: number;
  title: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  semester: string;
  description?: string;
  is_holiday: boolean;
}

export interface FeeItem {
  id: number;
  program: string;
  category: string;
  amount: number;
  frequency: string;
  due_date: string;
  late_fee_policy?: string;
  description?: string;
}

export interface PlacementItem {
  id: number;
  company_name: string;
  tier: string;
  roles: string;
  ctc_lpa: number;
  min_cgpa: number;
  max_backlogs: number;
  eligible_branches: string;
  drive_date?: string;
  status: string;
  description?: string;
}

export interface DocumentItem {
  id: number;
  document_id: string;
  title: string;
  category: string;
  department: string;
  document_type: string;
  file_path: string;
  file_size_bytes: number;
  version: string;
  effective_date: string;
  status: string;
  chunk_count: number;
  created_at: string;
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) return null;
    return res.json();
  },

  // Chat
  sendMessage: async (
    message: string,
    conversation_id?: string,
    language?: string,
    uploaded_file_id?: string
  ) => {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        message,
        conversation_id,
        language: language || "en",
        uploaded_file_id,
      }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

  getChatHistory: async (): Promise<Conversation[]> => {
    const res = await fetch(`${API_BASE_URL}/chat/history`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) return [];
    return res.json();
  },

  getConversation: async (conversationId: string): Promise<Conversation> => {
    const res = await fetch(`${API_BASE_URL}/chat/${conversationId}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to fetch conversation");
    return res.json();
  },

  deleteConversation: async (conversationId: string) => {
    const res = await fetch(`${API_BASE_URL}/chat/${conversationId}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  submitFeedback: async (messageId: string, isHelpful: number, comment?: string) => {
    const res = await fetch(`${API_BASE_URL}/chat/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        message_id: messageId,
        is_helpful: isHelpful,
        comment,
      }),
    });
    return res.json();
  },

  // Assessments
  getAssessments: async (params?: {
    module?: string;
    presentation?: string;
    assessment_type?: string;
  }): Promise<AssessmentItem[]> => {
    const query = new URLSearchParams();
    if (params?.module && params.module !== "All") query.append("module", params.module);
    if (params?.presentation && params.presentation !== "All") query.append("presentation", params.presentation);
    if (params?.assessment_type && params.assessment_type !== "All") query.append("assessment_type", params.assessment_type);
    
    const res = await fetch(`${API_BASE_URL}/assessments?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  getAssessmentModules: async (): Promise<string[]> => {
    const res = await fetch(`${API_BASE_URL}/assessments/modules`);
    if (!res.ok) return [];
    return res.json();
  },

  getAssessmentPresentations: async (): Promise<string[]> => {
    const res = await fetch(`${API_BASE_URL}/assessments/presentations`);
    if (!res.ok) return [];
    return res.json();
  },

  getUpcomingAssessments: async (): Promise<AssessmentItem[]> => {
    const res = await fetch(`${API_BASE_URL}/assessments/upcoming`);
    if (!res.ok) return [];
    return res.json();
  },

  // Notices
  getNotices: async (category?: string, priority?: string): Promise<NoticeItem[]> => {
    const query = new URLSearchParams();
    if (category && category !== "All") query.append("category", category);
    if (priority && priority !== "All") query.append("priority", priority);
    const res = await fetch(`${API_BASE_URL}/notices?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  createNotice: async (noticeData: any) => {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(noticeData),
    });
    return res.json();
  },

  // Scholarships
  getScholarships: async (category?: string): Promise<ScholarshipItem[]> => {
    const query = new URLSearchParams();
    if (category && category !== "All") query.append("category", category);
    const res = await fetch(`${API_BASE_URL}/scholarships?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  matchScholarships: async (criteria: { cgpa: number; annual_income: number; is_sports_winner?: boolean }) => {
    const res = await fetch(`${API_BASE_URL}/scholarships/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(criteria),
    });
    return res.json();
  },

  // Calendar
  getCalendarEvents: async (event_type?: string, semester?: string): Promise<CalendarItem[]> => {
    const query = new URLSearchParams();
    if (event_type && event_type !== "All") query.append("event_type", event_type);
    if (semester && semester !== "All") query.append("semester", semester);
    const res = await fetch(`${API_BASE_URL}/calendar?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Fees
  getFees: async (category?: string): Promise<FeeItem[]> => {
    const query = new URLSearchParams();
    if (category && category !== "All") query.append("category", category);
    const res = await fetch(`${API_BASE_URL}/fees?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Placements
  getPlacements: async (tier?: string, status?: string): Promise<PlacementItem[]> => {
    const query = new URLSearchParams();
    if (tier && tier !== "All") query.append("tier", tier);
    if (status && status !== "All") query.append("status", status);
    const res = await fetch(`${API_BASE_URL}/placements?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Documents
  getDocuments: async (category?: string): Promise<DocumentItem[]> => {
    const query = new URLSearchParams();
    if (category && category !== "All") query.append("category", category);
    const res = await fetch(`${API_BASE_URL}/documents?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  uploadDocument: async (formData: FormData): Promise<DocumentItem> => {
    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Upload failed");
    }
    return res.json();
  },

  deleteDocument: async (docId: string) => {
    const res = await fetch(`${API_BASE_URL}/documents/${docId}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  reindexDocument: async (docId: string) => {
    const res = await fetch(`${API_BASE_URL}/documents/${docId}/reindex`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
  },
};
