import {
  Category,
  QuestionSet,
  Question,
  ParsedQuestionDraft,
  SoloSession,
  SoloQuestionClientView,
  AnswerFeedback,
  SessionResultSummary,
  ReviewQuestionItem,
  MultiplayerRoom,
  RoomParticipant,
  PracticeHistoryItem,
} from '../types';

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${BACKEND_URL}/api`;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request gagal: ${response.statusText}`);
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  async getCategories(): Promise<Category[]> {
    return request<Category[]>('/categories');
  },

  async createCategory(name: string, description?: string): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async getQuestionSets(categoryId?: string, status?: string): Promise<QuestionSet[]> {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (status) params.append('status', status);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<QuestionSet[]>(`/question-sets${qs}`);
  },

  async getQuestionSetById(id: string): Promise<QuestionSet> {
    return request<QuestionSet>(`/question-sets/${id}`);
  },

  async createQuestionSet(data: { category_id: string; title: string; description?: string; status?: string }): Promise<QuestionSet> {
    return request<QuestionSet>('/question-sets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateQuestionSet(
    id: string,
    data: { category_id?: string; title?: string; description?: string; status?: string }
  ): Promise<QuestionSet> {
    return request<QuestionSet>(`/question-sets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteQuestionSet(id: string): Promise<void> {
    await request(`/question-sets/${id}`, { method: 'DELETE' });
  },

  async getQuestions(filters: { questionSetId?: string; categoryId?: string; status?: string } = {}): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters.questionSetId) params.append('questionSetId', filters.questionSetId);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.status) params.append('status', filters.status);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<Question[]>(`/questions${qs}`);
  },

  async createQuestion(data: {
    category_id: string;
    question_set_id: string;
    question_text: string;
    explanation?: string;
    difficulty?: string;
    status?: string;
    options: { option_label: string; option_text: string; is_correct: boolean }[];
  }): Promise<Question> {
    return request<Question>('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateQuestion(
    id: string,
    data: {
      category_id?: string;
      question_set_id?: string;
      question_text?: string;
      explanation?: string;
      difficulty?: string;
      status?: string;
      options?: { id?: string; option_label: string; option_text: string; is_correct: boolean }[];
    }
  ): Promise<Question> {
    return request<Question>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteQuestion(id: string): Promise<void> {
    await request(`/questions/${id}`, { method: 'DELETE' });
  },

  async uploadDocument(file: File): Promise<{
    fileName: string;
    totalQuestions: number;
    validCount: number;
    warningCount: number;
    questions: ParsedQuestionDraft[];
    errors: string[];
  }> {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_BASE}/import/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Gagal memproses dokumen.');
    }

    return data.data;
  },

  async saveImportedQuestions(payload: {
    questionSetId: string;
    categoryId: string;
    questions: ParsedQuestionDraft[];
    status: 'draft' | 'published';
  }): Promise<{ savedCount: number }> {
    return request<{ savedCount: number }>('/import/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async startSoloSession(
    questionSetId: string,
    durationPerQuestion: number = 30,
    playerName: string = 'Pengguna'
  ): Promise<{ session: SoloSession; firstQuestion: SoloQuestionClientView }> {
    return request<{ session: SoloSession; firstQuestion: SoloQuestionClientView }>('/solo/start', {
      method: 'POST',
      body: JSON.stringify({ questionSetId, durationPerQuestion, playerName }),
    });
  },

  async getSoloQuestion(sessionId: string, order: number): Promise<SoloQuestionClientView> {
    return request<SoloQuestionClientView>(`/solo/${sessionId}/question/${order}`);
  },

  async submitSoloAnswer(
    sessionId: string,
    payload: {
      questionId: string;
      selectedOptionId: string | null;
      isTimeout: boolean;
      timeTakenSeconds: number;
      playerName?: string;
    }
  ): Promise<AnswerFeedback> {
    return request<AnswerFeedback>(`/solo/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async finishSoloSession(sessionId: string, playerName: string = 'Pengguna'): Promise<SessionResultSummary> {
    return request<SessionResultSummary>(`/solo/${sessionId}/finish`, {
      method: 'POST',
      body: JSON.stringify({ playerName }),
    });
  },

  async getSoloReview(sessionId: string): Promise<ReviewQuestionItem[]> {
    return request<ReviewQuestionItem[]>(`/solo/${sessionId}/review`);
  },

  async getHistory(): Promise<PracticeHistoryItem[]> {
    return request<PracticeHistoryItem[]>('/solo/history');
  },

  async createMultiplayerRoom(
    hostName: string,
    questionSetId: string,
    durationPerQuestion: number = 30
  ): Promise<MultiplayerRoom> {
    return request<MultiplayerRoom>('/multiplayer/room', {
      method: 'POST',
      body: JSON.stringify({ hostName, questionSetId, durationPerQuestion }),
    });
  },

  async getMultiplayerRoom(code: string): Promise<MultiplayerRoom> {
    return request<MultiplayerRoom>(`/multiplayer/room/${code}`);
  },

  async joinMultiplayerRoom(
    roomCode: string,
    playerName: string
  ): Promise<{ room: MultiplayerRoom; participant: RoomParticipant }> {
    return request<{ room: MultiplayerRoom; participant: RoomParticipant }>('/multiplayer/join', {
      method: 'POST',
      body: JSON.stringify({ roomCode, playerName }),
    });
  },

  async setMultiplayerReady(roomId: string, playerName: string, isReady: boolean): Promise<RoomParticipant> {
    return request<RoomParticipant>('/multiplayer/ready', {
      method: 'POST',
      body: JSON.stringify({ roomId, playerName, isReady }),
    });
  },

  async getAIServerStatus(): Promise<{ hasServerKey: boolean; supportedModels: string[]; heuristicEngineReady: boolean }> {
    return request('/ai/status');
  },

  async solveQuestionsWithAI(
    questions: any[],
    apiKey?: string
  ): Promise<
    {
      index: number;
      questionId?: string;
      correct_label: string;
      confidence: number;
      explanation: string;
      source: 'gemini' | 'heuristic';
    }[]
  > {
    return request('/ai/solve-questions', {
      method: 'POST',
      body: JSON.stringify({ questions, apiKey }),
    });
  },

  async solveQuestionSetWithAI(
    setId: string,
    apiKey?: string
  ): Promise<{
    totalSolved: number;
    results: any[];
  }> {
    return request(`/ai/solve-set/${setId}`, {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    });
  },
};

